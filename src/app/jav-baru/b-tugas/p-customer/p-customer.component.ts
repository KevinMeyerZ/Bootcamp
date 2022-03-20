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
  selector: 'app-p-customer',
  templateUrl: './p-customer.component.html',
  styleUrls: ['./p-customer.component.scss']
})
export class PCustomerComponent implements OnInit {
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

  ngOnInit(): void {
    this.data();
    this.data_customer();
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
 
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
 
    // use passed valuable to update state
    this.daterange.start = value.start.format('YYYY-MM-DD');
    this.daterange.end = value.end.format('YYYY-MM-DD');
  }

  filter_customer;

  total_bawah;
  data_database;
  colspanku;
  bulan;
  tahun;
  grand_total;

  public val: string;

  database_customer;

  selectValue: string[];

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

  changeFn(val){
    this.filter_customer = "";
    for(let i = 0; i<val.length; i++){
      this.filter_customer += val[i]+',';
    }
    this.filter_customer = this.filter_customer.substring(0, this.filter_customer.length - 1);
    console.log(this.filter_customer);
  }

  search(): void{
    if(this.filter_customer == null){
      this.filter_customer = '';
    }
    if(this.daterange.start != null){
      var today = new Date(this.daterange.start);
      var mm = String(today.getMonth() + 1).padStart(2);
      var yyyy = today.getFullYear();

      var convert = Number(mm);
      this.landaService
        .DataGet('/b_laporan/test_p_customer', {
          tahun : yyyy,
          bulan : convert,
          customer: this.filter_customer
        })
        .subscribe((res: any) => {
          this.data_database = res.data.list;
          this.total_bawah = res.data.total_bawah;
          this.colspanku = res.data.colspanku;
          this.bulan = res.data.bulan;
          this.tahun = res.data.tahun;
          this.grand_total = res.data.grand_total;
          this.colspanku = res.data.colspanku;
        });
    }

    if(this.filter_customer != null){
      var today = new Date();
      var mm = String(today.getMonth() + 1).padStart(2);
      var yyyy = today.getFullYear();

      var convert = Number(mm);
      this.landaService
        .DataGet('/b_laporan/test_p_customer', {
          tahun : yyyy,
          bulan : convert,
          customer: this.filter_customer
        })
        .subscribe((res: any) => {
          this.data_database = res.data.list;
          this.total_bawah = res.data.total_bawah;
          this.colspanku = res.data.colspanku;
          this.bulan = res.data.bulan;
          this.tahun = res.data.tahun;
          this.grand_total = res.data.grand_total;
          this.colspanku = res.data.colspanku;
        });
    }
  }

  exportexcel(){
    var today = new Date(this.daterange.start);
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();

    var convert = Number(mm);
    var link = "http://localhost/training-angular-9/api/b_laporan/test_p_customer?is_export=1&bulan="+convert+"&tahun="+yyyy+"&customer="+this.filter_customer+"";
    window.open(link);
  }

  data(){
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();

    var convert = Number(mm);
    this.landaService
      .DataGet('/b_laporan/test_p_customer', {
        tahun : yyyy,
        bulan : convert
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.total_bawah = res.data.total_bawah;
        this.colspanku = res.data.colspanku;
        this.bulan = res.data.bulan;
        this.tahun = res.data.tahun;
        this.grand_total = res.data.grand_total;
        this.colspanku = res.data.colspanku;
      });
  }

}
