import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-laporan-menu',
  templateUrl: './laporan-menu.component.html',
  styleUrls: ['./laporan-menu.component.scss']
})
export class LaporanMenuComponent implements OnInit {
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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  model: any = {

  };
  modelParam: {
    kategori
  };

  src_kategori="";
  sc_kategori;

  data_database;
  produknya;
  kategorinya;
  g_hasil = 0;
  month;

  tgl_awal;
  tgl_akhir;

  kat_button="btn btn-outline-primary w-sm";

  ngOnInit(): void {
    this.modelParam = {
      kategori:''
    }
    this.empty();
    this.data_get();
    this.s_kategori();
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
 
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
 
    // use passed valuable to update state
    this.daterange.start = value.start.format('MM');
    this.daterange.end = value.end.format('MM');
    this.daterange.label = value.label;
  }

  empty() {
    this.model = {

    };
  }

  kategori_click(number){
    if(number == ''){
      var get_el = document.getElementById("kat_button");
      get_el.classList.remove("btn-outline-primary");
      get_el.classList.add("btn-primary");
      for(let i=0; i<this.sc_kategori.length; i++){
          var get_el = document.getElementById("kat_button"+this.sc_kategori[i]['id']);
          get_el.classList.remove("btn-primary");
          get_el.classList.add("btn-outline-primary");
      }
      this.src_kategori = number;
    }else{
      var get_el = document.getElementById("kat_button");
      get_el.classList.remove("btn-primary");
      get_el.classList.add("btn-outline-primary");
      for(let i=0; i<this.sc_kategori.length; i++){
        if(this.sc_kategori[i]['id'] == number){
          var get_el = document.getElementById("kat_button"+number);
          get_el.classList.remove("btn-outline-primary");
          get_el.classList.add("btn-primary");
          this.src_kategori = number;
        }else{
          var get_el = document.getElementById("kat_button"+this.sc_kategori[i]['id']);
          get_el.classList.remove("btn-primary");
          get_el.classList.add("btn-outline-primary");
        }
      }
    }
    
    
  }

  s_kategori(){
    this.landaService
    .DataGet('/b_menu/kategori', {
      
    })
    .subscribe((res: any) => {
      this.sc_kategori = res.data.user;
    });
  }

  search(): void{
      this.tgl_awal = this.daterange.start;
      this.tgl_akhir = this.daterange.end;
      this.landaService
      .DataGet('/b_laporan/per_bulan', {
        month : this.tgl_awal,
        kategori : this.src_kategori
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.produknya = res.data.produk;
        this.kategorinya = res.data.kategori;
        this.total_g(this.data_database);
        this.month = res.data.month;
      });
  }

  data_get(){
    this.landaService
      .DataGet('/b_laporan/per_bulan', {
        awal : 1,
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
        this.produknya = res.data.produk;
        this.kategorinya = res.data.kategori;
        this.total_g(this.data_database);
        this.month = res.data.month;
      });
  }

  goleki(hari, detail, nama, kategori){
    var val = 0;
    for(let i=0; i<detail.length; i++){
      const dororo = detail[i];
      if(hari == dororo.hariku && dororo.nama == nama && dororo.kategori == kategori){
        val = dororo.total;
      }
    }
      return val;
  }
  
  c_produk(produk,kategori){
    var output;
      if(produk['produk_kategori'] == kategori){
        output = produk.produk;
      }
    if(output !=null){
      return output;
    }
  }

  totalku(produk,kategori){
    var total = 0;
    for(let i=0; i<this.data_database.length; i++){
      for(let x=0; x<this.data_database[i]['detail'].length; x++){
        if(this.data_database[i]['detail'][x]['nama'] == produk && this.data_database[i]['detail'][x]['kategori'] == kategori){
          total += this.data_database[i]['detail'][x]['total'];
        }
      }
    }
    return total;
  }

  total_kat(kategori){
    var total = 0;
    for(let i=0; i<this.data_database.length; i++){
      for(let x=0; x<this.data_database[i]['detail'].length; x++){
        if(this.data_database[i]['detail'][x]['kategori'] == kategori){
          total += this.data_database[i]['detail'][x]['total'];
        }
      }
    }
    return total;
  }

  grand_total(total){
    var hasil = 0;
    if(total != null){
      hasil = total;
    }
    return hasil;
  }

  total_g(data){
    this.g_hasil = 0;
    for(let i=0; i<data.length; i++){
      if(data[i]['total_pertanggal'] == null){
        
      }else{
        this.g_hasil = this.g_hasil + data[i]['total_pertanggal'];
      }
    }
  }

  exportexcel(){
    if(this.tgl_awal == null){
      var pdf = 'http://localhost/training-angular-9/api/b_laporan/per_bulan?awal=1&is_export=1'+'&kategori='+this.src_kategori+'&month='+this.tgl_awal;
      window.open(pdf);
    }else{
      var pdf = 'http://localhost/training-angular-9/api/b_laporan/per_bulan?is_export=1'+'&kategori='+this.src_kategori+'&month='+this.tgl_awal;
      window.open(pdf);
    }
   
  }
}
