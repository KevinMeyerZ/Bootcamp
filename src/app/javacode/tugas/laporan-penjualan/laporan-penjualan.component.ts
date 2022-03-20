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
  selector: 'app-laporan-penjualan',
  templateUrl: './laporan-penjualan.component.html',
  styleUrls: ['./laporan-penjualan.component.scss']
})
export class LaporanPenjualanComponent implements OnInit {
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
    customer,
    menu
    
  }

  data_database;
  total_transaksi
  totalku = 0;
  total_bawah;

  tgl_awal="";
  tgl_akhir="";

  ngOnInit(): void {
    this.modelParam = {
      customer: '',
      menu:''
    }
    this.empty();
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

  empty() {
    this.model = {

    };
    this.data();
  }

  exportpdf(){
    var pdf = 'http://localhost/training-angular-9/api/b_laporan/rekap_menu?awal=1&is_print=1'+'&customer='+this.modelParam.customer+'&menu='+this.modelParam.menu+'&tgl_awal='+this.tgl_awal+'&tgl_akhir='+this.tgl_akhir;
    window.open(pdf);
  }

  search(): void{
    if(this.tgl_awal != null){
      this.tgl_awal = this.daterange.start;
      this.tgl_akhir = this.daterange.end;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }else{
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }
}

  data(){
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pagingType: 'full_numbers',
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
          tgl_awal: this.tgl_awal,
          tgl_akhir: this.tgl_akhir
        };
        this.landaService.DataGet('/b_laporan/rekap_menu', params).subscribe((res: any) => {
          this.data_database = res.data.list;
          this.total_bawah = res.data.total_bawah;
          this.total_transaksi = this.data_database.length;
          this.totalku = 0;
          for(let x=0; x<this.data_database.length; x++){
            this.totalku = this.totalku + this.data_database[x]['total'];
          }
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      },
    };
  }
}
