import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyPointFormComponent } from './key-point-form.component';

describe('KeyPointFormComponent', () => {
  let component: KeyPointFormComponent;
  let fixture: ComponentFixture<KeyPointFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyPointFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeyPointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
