import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  @ViewChild('recipe') recipes: ElementRef;
  @ViewChild('place') places: ElementRef;
  recipeValue: any;
  placeValue: any;
  venueList = [];
  recipeList = [];

  currentLat: any;
  currentLong: any;
  geolocationPosition: any;

  constructor(private _http: HttpClient) {
  }

  ngOnInit() {

    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.geolocationPosition = position;
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
      });
  }

  getVenues() {

    this.recipeValue = this.recipes.nativeElement.value;
    this.placeValue = this.places.nativeElement.value;

    if (this.recipeValue !== null) {
      /**
       * Write code to get recipe
       */
      this._http.get('https://api.edamam.com/search?q=' + this.recipeValue + '&app_id=131f87b2'
        + '&app_key=e8637ac1a692f8197089661450c770db').subscribe((response: any) => {
        this.recipeList = Object.keys(response.hits).map(function (R) {
          const recipe = response.hits[R].recipe;
          return {name: recipe.label, icon: recipe.image, url: recipe.url};
        });
        console.log(response.hits);
      });

    }

    if (this.placeValue != null && this.placeValue !== '' && this.recipeValue != null && this.recipeValue !== '') {
      /**
       * Write code to get place
       */
      this._http.get('https://api.foursquare.com/v2/venues/search?' + '&client_id=JYY2DAATTZHLIBMI4B5TTDCOKPACRK4MHBFBQZX2FUWO1IZT'
        + '&client_secret=0DJSFD4XGK4QWTPHXHOSCOFDV2YBNSXNR0J4UK23TJSBUIZ4' + '&v=20190928' + '&limit=10' + '&near= ' + this.placeValue
        + '&query =' + this.recipeValue).subscribe((response: any) => {
        this.venueList = Object.keys(response.response.venues).map(function (P) {
          const place = response.response.venues[P];
          return {name: place.name, formattedAddress: place.location.formattrdAddress};
        });
        console.log(response);
      });
    }
  }
}
