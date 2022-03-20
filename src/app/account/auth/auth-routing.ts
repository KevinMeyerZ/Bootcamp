import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { TRegisterComponent } from './t-register/t-register.component';
import { TLoginComponent } from './t-login/t-login.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ProdukComponent } from './produk/produk.component';
import { KasirComponent} from './kasir/kasir.component';
import { TransaksiComponent} from './transaksi/transaksi.component';
import { LaporanpenjualanComponent} from './laporanpenjualan/laporanpenjualan.component';
import { CetaklaporanpenjualanComponent} from './cetaklaporanpenjualan/cetaklaporanpenjualan.component';
import { UpdateProfileComponent} from './update-profile/update-profile.component';
import { LaporanPerbulanComponent} from './laporan-perbulan/laporan-perbulan.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
    // {
    //     path: 'signup',
    //     component: SignupComponent
    // },
    // {
    //     path: 'reset-password',
    //     component: PasswordresetComponent
    // },
    // {
    //     path: 'register',
    //     component: RegisterComponent
    // },
    {
        path: 't_login',
        component: TLoginComponent
    },
    {
        path: 't_register',
        component: TRegisterComponent
    },
    {
        path: 'forgot-password',
        component: PasswordresetComponent
    },
    {
        path: 'dashboard',
        component: TopbarComponent
    },
    {
        path: 'produk',
        component: ProdukComponent
    },
    {
        path: 'kasir',
        component: KasirComponent
    },
    {
        path: 'transaksi',
        component: TransaksiComponent
    },
    {
        path: 'laporan-penjualan',
        component: LaporanpenjualanComponent
    },
    {
        path: 'cetak-laporan',
        component: CetaklaporanpenjualanComponent
    },
    {
        path: 'update-profil',
        component: UpdateProfileComponent
    },
    {
        path: 'laporan-perbulan',
        component: LaporanPerbulanComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
