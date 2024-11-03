import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditavehiculoPage } from './editavehiculo.page';

describe('EditavehiculoPage', () => {
  let component: EditavehiculoPage;
  let fixture: ComponentFixture<EditavehiculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditavehiculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
