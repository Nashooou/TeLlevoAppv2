import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerViajeDetallePage } from './ver-viaje-detalle.page';

describe('VerViajeDetallePage', () => {
  let component: VerViajeDetallePage;
  let fixture: ComponentFixture<VerViajeDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerViajeDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
