import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-laporan-customer',
  templateUrl: './laporan-customer.component.html',
  styleUrls: ['./laporan-customer.component.scss']
})
export class LaporanCustomerComponent implements OnInit {
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

  model: any = {

  };
  modelParam: {
    customer
  }

  data_database;
  year;
  month;
  customer;

  tgl_awal;
  tgl_akhir;

  total = 0;

  ngOnInit(): void {
    this.modelParam = {
      customer:''
    }
    this.empty();
    this.data_get();
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
 
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
 
    // use passed valuable to update state
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

  empty() {
    this.model = {

    };
  }

  search(): void{
      this.tgl_awal = this.daterange.start.format('MM');
      this.tgl_akhir = this.daterange.start.format('YYYY');
      this.landaService
      .DataGet('/b_laporan/customer', {
        month : this.tgl_awal,
        year : this.tgl_akhir,
        customer : this.modelParam.customer
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.year = res.data.year;
        this.month = res.data.month;
        this.customer = res.data.customer;
      });
  }
  

  data_get(){
    this.landaService
      .DataGet('/b_laporan/customer', {
        awal : 1
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.year = res.data.year;
        this.month = res.data.month;
        this.customer = res.data.customer;
      });
  }

  detail(customer,detail){
    var val = 0;
    for(let i=0; i<detail.length; i++){
      const dororo = detail[i];
      if(customer == dororo.nama){
        val = dororo.total;
      }
    }
      return val;
  }

  total_c(customer){
    var total=0;
    for(let i=0; i<this.data_database.length; i++){
      for(let x=0; x<this.data_database[i]['detail'].length; x++){
        if(this.data_database[i]['detail'][x]['nama'] == customer){
          total += this.data_database[i]['detail'][x]['total'];
        }
      }
    }
    return total;
  }

  grand_total(number){
    if(number != null){
      return number;
    }else{
      return 0;
    }
  }

  total_grand(){
    var total = 0;
    for(let i=0; i<this.data_database.length; i++){
      if(this.data_database[i]['g_total'] != null){
        total += this.data_database[i]['g_total'];
      }
    }

    return total;
  }

  exportexcel(){
    var link = "http://localhost/training-angular-9/api/b_laporan/customer?awal=1&is_export=1&month="+this.tgl_awal+"&year="+this.tgl_akhir+"&customer="+this.modelParam.customer+"";
    window.open(link);
  }
  
}
