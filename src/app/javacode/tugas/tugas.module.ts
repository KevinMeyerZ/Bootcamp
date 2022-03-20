import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { Daterangepicker } from 'ng2-daterangepicker';

import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbPaginationModule,
  NgbNavModule,
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';


import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CKEditorModule } from "ckeditor4-angular";

import { TugasRoutingModule } from './tugas-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopbarComponent } from './topbar/topbar.component';
import { CustomerComponent } from './customer/customer.component';
import { MenuComponent } from './menu/menu.component';
import { TambahMenuComponent } from './tambah-menu/tambah-menu.component';
import { LaporanMenuComponent } from './laporan-menu/laporan-menu.component';
import { LaporanPenjualanComponent } from './laporan-penjualan/laporan-penjualan.component';
import { LaporanCustomerComponent } from './laporan-customer/laporan-customer.component';
import { PromoComponent } from './promo/promo.component';
import { DiskonComponent } from './diskon/diskon.component';
import { VoucherComponent } from './voucher/voucher.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { VoucherTambahComponent } from './voucher-tambah/voucher-tambah.component';
import { HakAksesComponent } from './hak-akses/hak-akses.component';
import { TestComponent } from './test/test.component';

export const options: Partial<IConfig> = {
  thousandSeparator: '.',
};

@NgModule({
  declarations: [DashboardComponent, TopbarComponent, CustomerComponent, MenuComponent, TambahMenuComponent, LaporanMenuComponent, LaporanPenjualanComponent, LaporanCustomerComponent, PromoComponent, DiskonComponent, VoucherComponent, UserComponent, LoginComponent, VoucherTambahComponent, HakAksesComponent, TestComponent],
  imports: [
    CommonModule,
    TugasRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbModule,
    ChartsModule,
    NgxPaginationModule,
    CKEditorModule,
    ImageCropperModule,
    DataTablesModule,
    FormsModule,
    UiSwitchModule,
    ArchwizardModule,
    NgxMaskModule.forRoot(options),
    Daterangepicker
  ]
})
export class TugasModule { }
