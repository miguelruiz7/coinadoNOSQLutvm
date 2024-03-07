import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentasxcPage } from './cuentasxc.page';

describe('CuentasxcPage', () => {
  let component: CuentasxcPage;
  let fixture: ComponentFixture<CuentasxcPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CuentasxcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
