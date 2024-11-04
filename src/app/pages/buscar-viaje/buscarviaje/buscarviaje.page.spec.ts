import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarviajePage } from './buscarviaje.page';

describe('BuscarviajePage', () => {
  let component: BuscarviajePage;
  let fixture: ComponentFixture<BuscarviajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarviajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
