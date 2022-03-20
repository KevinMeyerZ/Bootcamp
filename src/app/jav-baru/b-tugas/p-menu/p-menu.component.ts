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
  selector: 'app-p-menu',
  templateUrl: './p-menu.component.html',
  styleUrls: ['./p-menu.component.scss']
})
export class PMenuComponent implements OnInit {
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
  //
  total_bawah;
  data_makanan;
  data_minuman;
  colspanku;
  colspanku2;
  bulan;
  tahun;
  grand_total;

  f_kategori;

  tgl;

  day = [];

  kategori_button="btn bg-custom";

  ngOnInit(): void {
    this.data();
  }

  f_status(number){
    if(number == 0){
      this.f_kategori = '';
    }
    if(number == 1){
      this.f_kategori = 'makanan'
    }
    if(number == 2){
      this.f_kategori = 'minuman'
    }
    for(let i=0; i<=2; i++){
      if(i == number){
        var get_el = document.getElementById("kategori_button"+number);
        get_el.classList.remove("bg-custom");
        get_el.classList.add("btn-dark");
      }else{
        var get_el = document.getElementById("kategori_button"+i);
        get_el.classList.remove("btn-dark");
        get_el.classList.add("bg-custom");
      }
    }
  }

  search(): void{
    if(this.daterange.start != null){
      var today = new Date(this.daterange.start);
      var mm = String(today.getMonth() + 1).padStart(2);
      var yyyy = today.getFullYear();

      var convert = Number(mm);
      this.landaService
        .DataGet('/b_laporan/test_perbulan', {
          tahun : yyyy,
          bulan : convert,
          kategori : this.f_kategori
        })
        .subscribe((res: any) => {
          this.data_makanan = res.data.data_makanan;
          this.data_minuman = res.data.data_minuman;
          this.total_bawah = res.data.total_bawah;
          this.bulan = res.data.bulan;
          this.tahun = res.data.tahun;
          this.grand_total = res.data.grand_total;
          this.colspanku = res.data.colspanku;
          this.colspanku2 = res.data.colspanku2;
        });
    }else{
        var today = new Date();
        var mm = String(today.getMonth() + 1).padStart(2);
        var yyyy = today.getFullYear();

        var convert = Number(mm);
        this.landaService
          .DataGet('/b_laporan/test_perbulan', {
            tahun : yyyy,
            bulan : convert,
            kategori : this.f_kategori
          })
          .subscribe((res: any) => {
            this.data_makanan = res.data.data_makanan;
            this.data_minuman = res.data.data_minuman;
            this.total_bawah = res.data.total_bawah;
            this.bulan = res.data.bulan;
            this.tahun = res.data.tahun;
            this.grand_total = res.data.grand_total;
            this.colspanku = res.data.colspanku;
            this.colspanku2 = res.data.colspanku2;
          });
    }
}

  // tampilkan(){
  //   console.log()
  //   var today = new Date('2022-01-06');
  //   var mm = String(today.getMonth() + 1).padStart(2);
  //   var yyyy = today.getFullYear();

  //   this.getDaysInMonth(mm,yyyy);
  // }

  // getDaysInMonth(month, year) {
  //   var convert = Number(month)-1;
  //   this.day = [];
  //   var date = new Date(year, convert, 1);
  //   while (date.getMonth() === convert) {
  //     this.day.push({hari : String(date.getDate())});
  //     date.setDate(date.getDate() + 1);
  //   }
  //   this.data();
  // }

  // delay(ms: number) {
  //   return new Promise( resolve => setTimeout(resolve, ms) );
  // }

  data(){
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();

    var convert = Number(mm);
    this.landaService
      .DataGet('/b_laporan/test_perbulan', {
        tahun : yyyy,
        bulan : convert
      })
      .subscribe((res: any) => {
        this.data_makanan = res.data.data_makanan;
        this.data_minuman = res.data.data_minuman;
        this.total_bawah = res.data.total_bawah;
        this.bulan = res.data.bulan;
        this.tahun = res.data.tahun;
        this.grand_total = res.data.grand_total;
        this.colspanku = res.data.colspanku;
        this.colspanku2 = res.data.colspanku2;
        this.f_status(0);
      });
  }

  exportexcel(){
    var today = new Date(this.daterange.start);
    var mm = String(today.getMonth() + 1).padStart(2);
    var yyyy = today.getFullYear();

    var convert = Number(mm);
    var link = "http://localhost/training-angular-9/api/b_laporan/test_perbulan?is_export=1&bulan="+convert+"&tahun="+yyyy+"&kategori="+this.f_kategori+"";
    window.open(link);
  }

  // data(){
  //   this.dtOptions = {
  //     serverSide: true,
  //     processing: true,
  //     ordering: false,
  //     pagingType: 'full_numbers',
  //     ajax: (dataTablesParameters: any, callback) => {
  //       const params = {
  //         filter: JSON.stringify(this.modelParam),
  //         offset: dataTablesParameters.start,
  //         limit: dataTablesParameters.length,
  //       };
  //       this.landaService.DataGet('/b_laporan/test_perbulan', params).subscribe((res: any) => {
  //         this.data_database = res.data.list;
  //         this.colspanku = res.data.colspanku;
  //         this.bulan = res.data.bulan;
  //         this.tahun = res.data.tahun;
  //         this.colspanku = res.data.colspanku;
  //         this.colspanku2 = res.data.colspanku2;
  //         callback({
  //           recordsTotal: res.data.totalItems,
  //           recordsFiltered: res.data.totalItems,
  //           data: [],
  //         });
  //       });
  //     },
  //   };
  // }

}
