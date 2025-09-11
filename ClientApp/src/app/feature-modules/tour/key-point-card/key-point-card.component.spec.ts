import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyPointCardComponent } from './key-point-card.component';

describe('KeyPointCardComponent', () => {
  let component: KeyPointCardComponent;
  let fixture: ComponentFixture<KeyPointCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyPointCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeyPointCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
