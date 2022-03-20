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
  selector: 'app-p-penjualan',
  templateUrl: './p-penjualan.component.html',
  styleUrls: ['./p-penjualan.component.scss']
})
export class PPenjualanComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  apiURL = environment.apiURL;
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

  data_database;
  grand_total;
  grand_diskon;

  database_customer;
  database_menu;
  filter_customer;
  filter_menu;

  selectValue: string[];
  selectValue2: string[];

  ngOnInit(): void {
    this.data();
    this.data_customer();
    this.data_menu();
  }

  data_customer(){
    this.landaService
      .DataGet('/m_voucher_java/customer', {

      })
      .subscribe((res: any) => {
        this.database_customer = res.data.list;
        const data = [];
        for(let i=0;i<this.database_customer.length; i++){
          data.push(this.database_customer[i]['nama'])
        }
        this.selectValue = data;
      });
  }

  exportpdf(){
    var today = new Date(this.daterange.start);
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();

    var convert = Number(mm);
    var link = "http://localhost/training-angular-9/api/b_laporan/test_kode_final?is_print=1&bulan="+convert+"&tahun="+yyyy+"&customer="+this.filter_customer+"&menu="+this.filter_menu;
    window.open(link);
  }

  data_menu(){
    this.landaService
      .DataGet('/m_menu_java/menu', {

      })
      .subscribe((res: any) => {
        this.database_menu = res.data.list;
        const data = [];
        for(let i=0;i<this.database_menu.length; i++){
          data.push(this.database_menu[i]['nama'])
        }
        this.selectValue2 = data;
      });
  }

  changeFn2(val){
    this.filter_menu = "";
    for(let i = 0; i<val.length; i++){
      this.filter_menu += val[i]+',';
    }
    this.filter_menu = this.filter_menu.substring(0, this.filter_menu.length - 1);
  }

  changeFn(val){
    this.filter_customer = "";
    for(let i = 0; i<val.length; i++){
      this.filter_customer += val[i]+',';
    }
    this.filter_customer = this.filter_customer.substring(0, this.filter_customer.length - 1);
  }
  
  search(){
    if(this.filter_customer == null){
      this.filter_customer = "";
    }
    if(this.filter_menu == null){
      this.filter_menu = "";
    }
    if(this.daterange.start != null){
      var today = new Date(this.daterange.start);
      var mm = String(today.getMonth() + 1).padStart(2);
      var yyyy = today.getFullYear();

      var convert = Number(mm);
      console.log(this.filter_customer);
      this.landaService
      .DataGet('/b_laporan/test_kode_final', {
        tahun : yyyy,
        bulan : convert,
        customer: this.filter_customer,
        menu: this.filter_menu
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.grand_total = res.data.grand_total;
        this.grand_diskon = res.data.grand_diskon;
      });
    }else{
      var today = new Date();
      var mm = String(today.getMonth() + 1).padStart(2);
      var yyyy = today.getFullYear();

      var convert = Number(mm);
      console.log(this.filter_customer);
      this.landaService
      .DataGet('/b_laporan/test_kode_final', {
        tahun : yyyy,
        bulan : convert,
        customer: this.filter_customer,
        menu: this.filter_menu
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.grand_total = res.data.grand_total;
        this.grand_diskon = res.data.grand_diskon;
      });
    }

  }

  data(){
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();

    var convert = Number(mm);
    this.landaService
      .DataGet('/b_laporan/test_kode_final', {
        tahun : yyyy,
        bulan : convert
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.grand_total = res.data.grand_total;
        this.grand_diskon = res.data.grand_diskon;
      });
  }
  
  detail_nama(list){
    for(let i=1; i<list.length; i++){
      return list[i]['menu'];
    }
  }

}
