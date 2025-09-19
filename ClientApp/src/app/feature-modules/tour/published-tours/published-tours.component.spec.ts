import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedToursComponent } from './published-tours.component';

describe('TourPreviewComponent', () => {
  let component: PublishedToursComponent;
  let fixture: ComponentFixture<PublishedToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedToursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
