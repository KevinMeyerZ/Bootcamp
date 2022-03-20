import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
    ) { }

  data_menu;
  data_kategori;

  data_makanan;
  data_minuman;
  data_bulan;
  data_tahun;
  data_bawah;

  data_menupunya;

  ngOnInit(): void {
    this.data();
    this.data_menuku();
  }

  
  data(): void{
    this.landaService
    .DataGet('/b_laporan/test_perbulan', {
      tahun: 2022,
      bulan:  1,
    })
    .subscribe((res: any) => {
      this.data_makanan = res.data.makanan;
      this.data_tahun = res.data.tahun;
      this.data_bulan = res.data.bulan;
      this.data_minuman = res.data.minuman;
      this.data_bawah = res.data.total_bawah;
      console.log(this.data_makanan);
      console.log(this.data_minuman);
    });
  }

  data_menuku(): void{
    this.landaService
    .DataGet('/b_laporan/test_menu', {
    })
    .subscribe((res: any) => {
     this.data_menupunya = res;
     console.log(this.data_menupunya);
    });
  }

  data_menuklo(kategori, data){
    if(kategori == data['kategori']){
      return data['menu'];
    }
  }

  data_koreksi(data){
      if(data == this.data_makanan[data]['menu']){
        return this.data_makanan[data]['menu'];
      }else{
        
      }
  }

}
