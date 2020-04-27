# ngx-link-preview
[![npm](https://img.shields.io/npm/v/ngx-link-preview.svg)](https://www.npmjs.com/package/ngx-link-preview)
[![npm](https://img.shields.io/npm/dm/ngx-link-preview.svg)](https://www.npmjs.com/package/ngx-link-preview)
[![npm](https://img.shields.io/librariesio/release/npm/ngx-link-preview)](https://www.npmjs.com/package/ngx-link-preview)

### The Open Graph link preview component for Angular 6+
![](https://raw.githubusercontent.com/btxtiger/ngx-link-preview/master/src/assets/link-preview-2.png)

### <a href="https://btxtiger.github.io/ngx-link-preview/" target="_blank">⇨ DEMO</a>

### Installation
```sh
npm install --save ngx-link-preview
```
```sh
yarn add ngx-link-preview
```

### Features
- Configurable preview
- Render array of links
- Parse links in string
- Loading indicator
- Theming: `default` and `modern` theme included

### Requirements
- Angular 6+
- You will need to create an endpoint at your backend to parse an url for meta tags.   
[See info below](#endpoint)

### Component configuration
#### 1. Import to your module
```ts
@NgModule({
   imports: [
      NgxLinkPreviewModule,
      ...
   ]
})
export class AppModule { }
```

#### 2. Use as regular component
```html
<ngx-link-preview></ngx-link-preview>
```

#### 3. Parameters: Configure the preview
#### • Two **required** parameters:
##### 1. `[apiRoute]="myApiRoute"`  
_apiRoute_ accepts any url, where you want to retrieve the metadata from. The 
target url will be attached by the component as base64 urlencoded query parameter. 
```ts
/** API route where to get the meta data from, component will build the full request url
 * Schema: api.example.com/api/get-meta-data?url=d3d3LmV4YW1wbGUuY29t
 */
@Input()
public apiRoute: string;
```

##### 2. `[getApiEndpoint$]="apiCallbackFn"`   
A generic callback function that returns an observable, that runs the api request on subscription.
You can use the default Angular HttpClient method, or your configured backend wrapper observable.
```ts
/** Method that does the API request, provide as class member arrow function from parent */
@Input()
public getApiEndpoint$: (requestUrl: string) => Observable<any>;
```

For example: 
```ts
public apiCallbackFn = (route: string) => {
   return this.http.get(route);
};
```
#### • **Optional** parameters
##### • Links that should be rendered, default: `[]`
```ts
/** Plain links string array */
@Input()
public links: string[] = [];
````

##### • Input string that should be parsed for links, can be combined with `links[]`
```ts
/** Input string to parse for links */
@Input()
public parseForLinksStr: string;
```

##### • Query parameter name, default: `'url'`
```ts
/** Target url will be attached as encodeURI(btoa(url)), so it must be decoded on the server */
@Input()
public queryParamName = 'url';
```

##### • Show image in preview, default: `true`
```ts
/** boolean: show image in preview */
@Input()
public showImage = true;
```

##### • Show site name in preview, default: `true`
```ts
/** boolean: show site name in preview */
@Input()
public showSiteName = true;
```

##### • Show title in preview, default: `true`
```ts
/** boolean: show title in preview */
@Input()
public showTitle = true;
```

##### • Show description in preview, default: `true`
```ts
/** boolean: show description in preview */
@Input()
public showDescription = true;
```

##### • Show url in preview, default: `false`
```ts
/** boolean: show link url in preview */
@Input()
public showLinkUrl = false;
```

##### • Use cache, default: `true`
```ts
/** boolean: use cache to display previews faster on next rendering */
@Input()
public useCache = true;
```

##### • Max cache age in milliseconds, default: `7 days`
```ts
/** number: max age the data cache of a link preview should be used */
@Input()
public maxCacheAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days
```

##### • Show loading indicator, default: `true`
```ts
/** boolean: show loading indicator */
@Input()
public showLoadingIndicator = true;
```

##### • HTML link `<a href="..."></a>` should be clickable, default: `false` 
```ts
/**
* boolean: whether the <a href="..."></a> link should be clickable.
* This is a question of context security. Otherwise use (previewClick) event.
*/
@Input()
public useHtmlLinkDefaultClickEvent = false;
```

##### • HTML link target, default: `'_blank'` (new tab)  
```ts
/**
* HtmlLinkTarget: where the HTML link should be opened on click.
* Only has an effect if [useHtmlLinkDefaultClickEvent]="true"
*/
@Input()
public htmlLinkTarget: HtmlLinkTarget = '_blank';
```

##### • Event emits the URL on click
```ts
/** Event emitter: on click to handle the click event, emits the clicked URL */
@Output()
public previewClicked = new EventEmitter<string>();
```
```html
<!-- $event: string is URL --> 
(previewClick)="previewClicked($event)"
```

### Theming
The package ships a default and a modern theme. The modern theme crops the preview image, what
might conclude in unintended results. To use the modern theme, just pass the css class:
```html
<ngx-link-preview class="modern"></ngx-link-preview>
```
**Feel free to create more themes and submit a pull request or open an issue!**
<details><summary>You can use this skeleton: (click to show)</summary>
<p>

```scss
.ngx-link-preview-container {
   .og-link-preview {
      &:hover {
      }
      .row {
         .col {
            &.preview-image {
            }
            &.text-data {
            }
            .image {
               img {
               }
            }
            .title {
            }
            .description {
            }
            .header {
               .site-name {
               }
            }
            .footer {
               .url {
               }
            }
         }
      }
   }
}
```

</p>
</details>


### Loading spinner
You can customize the loading spinner by passing your spinner as content of the component:
```html
<ngx-link-preview>
    <my-spinner-component></my-spinner-component>
</ngx-link-preview>

<!-- or alternatively (any child element): -->
<ngx-link-preview>
    <div class="spinner"></div>
</ngx-link-preview>
```

<a name="endpoint"></a>
### Endpoint configuration
#### Node.js example  
With node.js you can use [url-metadata](https://github.com/LevelNewsOrg/url-metadata)
```ts
import urlMetadata from 'url-metadata';

public getMetadata(request: Request, response: Response) {
   let { url } = request.query;
   url = this.decodeSafeUrl(url);
   
   urlMetadata(url).then(
      resp => {
         response.send(resp);
      },
      error => {
         response.send(error).status(500);
      }
   );
}

public decodeSafeUrl(value: string): string {
   const valueBase64 = decodeURI(value);
   return Buffer.from(valueBase64, 'base64').toString('utf8');
}
```
#### PHP example
```php
$router->get('/meta-tags', function() {
  $url = $_GET['url'];
  $urlDecoded = base64_decode(urldecode($url));
  ini_set('user_agent', 'Mozilla/4.0 (compatible; MSIE 6.0)');
  $sites_html = file_get_contents($urlDecoded);

  $html = new DOMDocument();
  @$html->loadHTML($sites_html);

  $metaTags = [
      'title' => '',
      'description' => '',
      'image' => '',
      'canonical' => '',
      'url' => '',
      'author' => '',
      'availability' => '',
      'keywords' => '',
      'og:description' => '',
      'og:determiner' => '',
      'og:image' => '',
      'og:image:height' => '',
      'og:image:secure_url' => '',
      'og:image:type' => '',
      'og:image:width' => '',
      'og:locale' => '',
      'og:locale:alternate' => '',
      'og:site_name' => '',
      'og:title' => '',
      'og:type' => '',
      'og:url' => '',
      'price' => '',
      'priceCurrency' => '',
      'source' => '',
  ];

  foreach ($html->getElementsByTagName('meta') as $meta) {
      $property = $meta->getAttribute('property');
      $content = $meta->getAttribute('content');
      if (strpos($property, 'og') === 0) {
          $metaTags[$property] = $content;

          if ($property === 'og:title') $metaTags['title'] = $property;
          if ($property === 'og:description') $metaTags['description'] = $property;
          if ($property === 'og:image') $metaTags['image'] = $property;
      }
  }
  $metaTags['canonical'] = $urlDecoded;
  $metaTags['url'] = $urlDecoded;

  return response()->json($metaTags);
});
```

![](https://raw.githubusercontent.com/btxtiger/ngx-link-preview/master/src/assets/link-preview-1.png)
