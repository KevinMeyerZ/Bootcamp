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

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { RegisterComponent } from './register/register.component';
import { TLoginComponent } from './t-login/t-login.component';
import { TRegisterComponent } from './t-register/t-register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TopbarComponent } from './topbar/topbar.component';

import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CKEditorModule } from "ckeditor4-angular";


import { ProdukComponent } from './produk/produk.component';
import { SidebarkuComponent } from './sidebarku/sidebarku.component';
import { TopbarkuComponent } from './topbarku/topbarku.component';
import { KasirComponent } from './kasir/kasir.component';
import { TransaksiComponent } from './transaksi/transaksi.component';
import { LaporanpenjualanComponent } from './laporanpenjualan/laporanpenjualan.component';
import { CetaklaporanpenjualanComponent } from './cetaklaporanpenjualan/cetaklaporanpenjualan.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { TestComponent } from './test/test.component';
import { LaporanPerbulanComponent } from './laporan-perbulan/laporan-perbulan.component';

export const options: Partial<IConfig> = {
  thousandSeparator: '.',
};


@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent, RegisterComponent, TLoginComponent, TRegisterComponent, ResetPasswordComponent, TopbarComponent, ProdukComponent, SidebarkuComponent, TopbarkuComponent, KasirComponent, TransaksiComponent, LaporanpenjualanComponent, CetaklaporanpenjualanComponent, UpdateProfileComponent, TestComponent, LaporanPerbulanComponent],
  imports: [
    CommonModule,
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
    AuthRoutingModule,
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

  ]
})
export class AuthModule { }
