import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
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


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'customer',
    component: CustomerComponent
  },
  {
    path: 'promo',
    component: PromoComponent
  },
  {
    path: 'diskon',
    component: DiskonComponent
  },
  {
    path: 'voucher',
    component: VoucherComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'penjualan_menu',
    component: PMenuComponent
  },
  {
    path: 'penjualan_customer',
    component: PCustomerComponent
  },
  {
    path: 'penjualan',
    component: PPenjualanComponent
  },
  {
    path: 'hak_akses',
    component: HakAksesComponent
  },
  // {
  //   path: 'test_final',
  //   component: TestFinalComponent
  // }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BTugasRoutingModule { }
