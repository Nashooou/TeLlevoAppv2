import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudAdminPage } from './crud-admin.page';

describe('CrudAdminPage', () => {
  let component: CrudAdminPage;
  let fixture: ComponentFixture<CrudAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
