import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentasxpPage } from './cuentasxp.page';

describe('CuentasxpPage', () => {
  let component: CuentasxpPage;
  let fixture: ComponentFixture<CuentasxpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CuentasxpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
