import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'b_tugas', loadChildren: () => import('./b-tugas/b-tugas.module').then(m => m.BTugasModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JavBaruRoutingModule { }
