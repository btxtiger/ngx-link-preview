import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent {
   public links = ['/assets/open-graph-test/case-de-papel.json'];
   public colors2 = [
      '',
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'light-blue',
      'cyan',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'grey',
      'blue-grey'
   ];
   public colors = [
      '',
      'blue',
      'amber',
      'teal'
   ];

   public apiCallbackFn = route => {
      // return this.http.get(route);

      // Hard code for demo purposes:
      return this.http.get('/assets/open-graph-test/medium-angular.json').pipe(delay(2500));
   };

   constructor(private http: HttpClient) {}

   public previewClick(link: string): void {
      alert('Link:\n' + link + '\nwas clicked!');
   }
}
