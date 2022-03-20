import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestmcComponent } from './testmc/testmc.component';



const routes: Routes = [
  {
    path: 'testmc',
    component: TestmcComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
