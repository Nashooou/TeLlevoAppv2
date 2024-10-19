import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistravehiculoPage } from './registravehiculo.page';

describe('RegistravehiculoPage', () => {
  let component: RegistravehiculoPage;
  let fixture: ComponentFixture<RegistravehiculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistravehiculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
