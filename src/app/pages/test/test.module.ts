import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestmcComponent } from './testmc/testmc.component';


@NgModule({
  declarations: [TestmcComponent],
  imports: [
    CommonModule,
    TestRoutingModule
  ]
})
export class TestModule { }
