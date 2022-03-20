import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { MenuComponent } from './menu/menu.component';
import { TambahMenuComponent } from './tambah-menu/tambah-menu.component';
import { LaporanMenuComponent } from './laporan-menu/laporan-menu.component';
import { LaporanPenjualanComponent } from './laporan-penjualan/laporan-penjualan.component';
import { LaporanCustomerComponent } from './laporan-customer/laporan-customer.component';
import { DiskonComponent } from './diskon/diskon.component';
import { VoucherComponent } from './voucher/voucher.component';
import { PromoComponent } from './promo/promo.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { VoucherTambahComponent } from './voucher-tambah/voucher-tambah.component';
import { HakAksesComponent } from './hak-akses/hak-akses.component';
import { TestComponent } from './test/test.component';


const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent
  // },
  // {
  //   path: 'customer',
  //   component: CustomerComponent
  // },
  // {
  //   path: 'menu',
  //   component: MenuComponent
  // },
  // {
  //   path: 'tambah_menu',
  //   component: TambahMenuComponent
  // },
  // {
  //   path: 'laporan_menu',
  //   component: LaporanMenuComponent
  // },
  // {
  //   path: 'laporan_penjualan',
  //   component: LaporanPenjualanComponent
  // },
  // {
  //   path: 'laporan_customer',
  //   component: LaporanCustomerComponent
  // },
  // {
  //   path: 'diskon',
  //   component: DiskonComponent
  // },
  // {
  //   path: 'voucher',
  //   component: VoucherComponent
  // },
  // {
  //   path: 'promo',
  //   component: PromoComponent
  // },
  // {
  //   path: 'user',
  //   component: UserComponent
  // },
  // {
  //   path: 'login',
  //   component: LoginComponent
  // },
  // {
  //   path: 'voucher_tambah',
  //   component: VoucherTambahComponent
  // },
  // {
  //   path: 'hak_akses',
  //   component: HakAksesComponent
  // },
  {
    path: 'test',
    component: TestComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class TugasRoutingModule { }
