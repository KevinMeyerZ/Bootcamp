import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-final',
  templateUrl: './test-final.component.html',
  styleUrls: ['./test-final.component.scss']
})
export class TestFinalComponent implements OnInit {
  public daterange: any = {};
 
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  constructor(
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
 
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
 
    // use passed valuable to update state
    this.daterange.start = value.start.format('YYYY-MM-DD');
    this.daterange.end = value.end.format('YYYY-MM-DD');
  }

  model: any = {

  };
  modelParam: {
    cabang,
    item,
    gudang
  }

  data_database;
  database_item;
  database_cabang;
  database_gudang;

  grand_jumlah;
  grand_harga;
  grand_saldo;

  ngOnInit(): void {
    this.modelParam = {
      cabang: '',
      item:'',
      gudang:''
    }
    this.data_kartu();
    this.data_item();
    this.data_cabang();
    this.empty()
  }

  empty() {
    this.model = {

    };
  }

  s_gudang(){
    this.landaService
      .DataGet('/test_ketiga/gudang', {
        id: this.modelParam.cabang
      })
      .subscribe((res: any) => {
        this.database_gudang = res.data.list;
      });
  }

  search(){
    this.grand_jumlah = 0;
    this.grand_harga = 0;
    this.grand_saldo = 0;
    if(this.daterange.start != null){
      // var today = new Date(this.daterange.start);
      // var mm = String(today.getMonth() + 1).padStart(2);
      // var yyyy = today.getFullYear();

      // var convert = Number(mm);
      this.landaService
      .DataGet('/test_ketiga/master', {
        tgl_awal : this.daterange.start,
        tgl_akhir : this.daterange.end,
        nama_item: this.modelParam.item,
        nama_gudang: this.modelParam.gudang,
        nama_cabang: this.modelParam.cabang
      })
      .subscribe((res: any) => {
        this.data_database = res.data.is_tampil;
        this.grand_jumlah = res.data.grand_jumlah[0].b_grand_jumlah;
        this.grand_harga = res.data.grand_jumlah[0].b_grand_harga;
        this.grand_saldo = res.data.grand_jumlah[0].b_grand_saldo;
      });
    }else{
      // var today = new Date();
      // var mm = String(today.getMonth() + 1).padStart(2);
      // var yyyy = today.getFullYear();

      // var convert = Number(mm);
      this.landaService
      .DataGet('/test_ketiga/master', {
        tgl_awal : this.daterange.start,
        tgl_akhir : this.daterange.end,
        nama_item: this.modelParam.item,
        nama_gudang: this.modelParam.gudang,
        nama_cabang: this.modelParam.cabang
      })
      .subscribe((res: any) => {
        this.data_database = res.data.is_tampil;
        this.grand_jumlah = res.data.grand_jumlah[0].b_grand_jumlah;
        this.grand_harga = res.data.grand_jumlah[0].b_grand_harga;
        this.grand_saldo = res.data.grand_jumlah[0].b_grand_saldo;
      });
    }

  }

  data_kartu(){
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();
    
    var convert = Number(mm);
    this.landaService
      .DataGet('/test_ketiga/master', {
        tahun : yyyy,
        bulan : convert,
        nama_item: 'FACIAL WASH NORMAL SKIN',
        nama_gudang: 'Gudang 1 (Satu) - HSD Sidoarjo',
        nama_cabang: 'HAYYU Sidoarjo'
      })
      .subscribe((res: any) => {
        this.data_database = res.data.is_tampil;
        this.grand_jumlah = res.data.grand_jumlah;
      });
  }

  data_item(){
    this.landaService
      .DataGet('/test_ketiga/item', {
      })
      .subscribe((res: any) => {
        this.database_item = res.data.list;
      });
  }

  data_cabang(){
    this.landaService
      .DataGet('/test_ketiga/cabang', {
      })
      .subscribe((res: any) => {
        this.database_cabang = res.data.list;
      });
  }

  data_gudang(){
    this.landaService
      .DataGet('/test_ketiga/gudang', {
      })
      .subscribe((res: any) => {
        this.database_gudang = res.data.list;
      });
  }

}
