import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

const routes: Routes = [
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'javacode', loadChildren: () => import('./javacode/javacode.module').then(m => m.JavacodeModule) },
  { path: 'jav_baru', loadChildren: () => import('./jav-baru/jav-baru.module').then(m => m.JavBaruModule) },
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top',  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
