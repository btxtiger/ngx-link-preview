import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OpenGraphMetaData } from '../../interfaces/open-graph-meta-data';
import { NgxLinkPreviewCacheService } from '../../services/ngx-link-preview-cache.service';
import { Observable } from 'rxjs';

@Component({
   selector: 'ngx-link-preview',
   templateUrl: './ngx-link-preview.component.html',
   styleUrls: ['./ngx-link-preview.component.scss']
})
export class NgxLinkPreviewComponent implements OnChanges {
   /** Plain links string array */
   @Input()
   public links: string[] = [];

   /** Input string to parse for links */
   @Input()
   public parseForLinksStr: string;

   /** Method that does the API request, provide as class member arrow function from parent */
   @Input()
   public getApiEndpoint$: (requestUrl: string) => Observable<any>;

   /** API route where to get the meta data from, component will build the request url
    * Schema: api.example.com/api/get-meta-data?url=www.example.com
    */
   @Input()
   public apiRoute: string;

   /** Target url will be attached as encodeURI(btoa(url)), so it must be decoded on the server */
   @Input()
   public queryParamName = 'url';

   /** boolean: show image in preview */
   @Input()
   public showImage = true;

   /** boolean: show site name in preview */
   @Input()
   public showSiteName = true;

   /** boolean: show title in preview */
   @Input()
   public showTitle = true;

   /** boolean: show description in preview */
   @Input()
   public showDescription = true;

   /** boolean: show link url in preview */
   @Input()
   public showLinkUrl = false;

   /** boolean: use cache to display links faster after on next rendering */
   @Input()
   public useCache = true;

   /** Event emitter: on click to handle the click event */
   @Output()
   public previewClick = new EventEmitter();

   /** Scanned links[] from @Input() links & @Input() parseForLinks */
   private scannedLinks: string[] = [];

   /** Array of metadata objects where the preview is rendered from */
   public previews: OpenGraphMetaData[] = [];

   constructor(private cacheSvc: NgxLinkPreviewCacheService) {}

   /**
    * Preview will be refreshed every time a change is recognized
    */
   ngOnChanges(changes: SimpleChanges): void {
      this.init();
   }

   /**
    * Init preview
    */
   private init() {
      this.scannedLinks = [];
      this.previews = [];
      this.checkInputParameters();

      if (this.parseForLinksStr) {
         // Parse for links and push to links
         const links = this.parseStringForLinks(this.parseForLinksStr);
         this.scannedLinks = this.scannedLinks.concat(links);
      }
      if (this.links && this.links.length) {
         this.scannedLinks = this.scannedLinks.concat(this.links);
      }

      for (const link of this.scannedLinks) {
         const encodedLink = this.encodeUrlSafe(link);
         const requestUrl = this.apiRoute + '?' + this.queryParamName + '=' + encodedLink;

         // Try to load from cache, use encodedLink as key
         if (this.useCache && this.cacheSvc.getCacheItem(encodedLink)) {
            this.previews.push(this.cacheSvc.getCacheItem(encodedLink));
         } else {
            this.getApiEndpoint$(requestUrl).subscribe((resp: OpenGraphMetaData) => {
               this.cacheSvc.updateCacheItem(encodedLink, resp);
               this.previews.push(resp);
            });
         }
      }
   }

   /**
    * On link click emit to EventEmitter
    */
   public onLinkClick(url: string): void {
      this.previewClick.emit(url);
   }
   public disableDefaultLink(event: MouseEvent): void {
      event.preventDefault();
   }

   /**
    * Encode string url safe
    */
   private encodeUrlSafe(url: string): string {
      return encodeURI(btoa(url));
   }

   /**
    * Check required input parameters
    */
   private checkInputParameters(): void {
      if (!this.apiRoute) {
         throw new Error('<ngx-link-preview></ngx-link-preview> Missing [apiRoute] input parameter');
      }
      if (!this.getApiEndpoint$) {
         throw new Error('<ngx-link-preview></ngx-link-preview> Missing [getApiEndpoint$] input parameter');
      }
   }

   /**
    * Parse string for links
    */
   private parseStringForLinks(msg: string): string[] {
      const links = msg.match(
         /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)/gim
      );

      if (links) {
         return links;
      } else {
         return [];
      }
   }

   /**
    * Get sanitized image url due data often contains url errors
    */
   private getSanitizedImageUrl(p: OpenGraphMetaData): string {
      if (p['og:image'].startsWith('http')) {
         return p['og:image'];
      } else if (p['og:image'].startsWith('www')) {
         return p['og:image'];
      } else if (p['og:image'].startsWith('//www')) {
         return 'https://' + p['og:image'].slice(2);
      } else if (p['og:image'].startsWith('/yts/')) {
         return 'https://' + p.source + p['og:image'];
      }
   }
}
