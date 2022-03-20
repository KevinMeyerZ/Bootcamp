import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCurrencyFormatModule } from 'mat-currency-format';

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

import { BTugasRoutingModule } from './b-tugas-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MenuComponent } from './menu/menu.component';
import { CustomerComponent } from './customer/customer.component';
import { PromoComponent } from './promo/promo.component';
import { VoucherComponent } from './voucher/voucher.component';
import { DiskonComponent } from './diskon/diskon.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { PMenuComponent } from './p-menu/p-menu.component';
import { PCustomerComponent } from './p-customer/p-customer.component';
import { PPenjualanComponent } from './p-penjualan/p-penjualan.component';
import { HakAksesComponent } from './hak-akses/hak-akses.component';
import { TestFinalComponent } from './test-final/test-final.component';

export const options: Partial<IConfig> = {
  thousandSeparator: '.',
};


@NgModule({
  declarations: [DashboardComponent, TopbarComponent, MenuComponent, CustomerComponent, PromoComponent, VoucherComponent, DiskonComponent, UserComponent, LoginComponent, PMenuComponent, PCustomerComponent, PPenjualanComponent, HakAksesComponent, TestFinalComponent],
  imports: [
    NgSelectModule,
    CommonModule,
    BTugasRoutingModule,
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
    Daterangepicker,
    MatCurrencyFormatModule
  ]
})
export class BTugasModule { }
