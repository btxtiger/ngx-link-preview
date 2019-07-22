import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLinkPreviewComponent } from './ngx-link-preview.component';

describe('NgxLinkPreviewComponent', () => {
   let component: NgxLinkPreviewComponent;
   let fixture: ComponentFixture<NgxLinkPreviewComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [NgxLinkPreviewComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NgxLinkPreviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
