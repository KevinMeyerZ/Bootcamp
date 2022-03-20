import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EventEmitterService } from '../event-emitter.service';
import { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';  
import * as XLSX from 'xlsx'; 
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-laporanpenjualan',
  templateUrl: './laporanpenjualan.component.html',
  styleUrls: ['./laporanpenjualan.component.scss']
})
export class LaporanpenjualanComponent implements OnInit {
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

  qtyForm: FormGroup = new FormGroup({});

  constructor(
    private eventEmitterService: EventEmitterService, 
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
    ) { }

  //pdf
  exportpdfku = 0;
  exportexcelku = 0;
  
  page = 1;
  count = 0;
  tableSize = 5;

  //total
  total_transaksi
  totalku = 0;
  total_bawah;
  
  //search
  tgl_awal="";
  tgl_akhir="";
  data_filter;
  kasir_data;
  jenis_pembayaran;
  jenis_customer;
  model: any = {

  };
  modelParam: {
    kasir,
    jenis_pembayaran,
    status,
    range
  }
  
  data_database;

  //detail
  data_detail;
  data_produk;
  total_produk;
  data_detail_qty;

  data_get = this.authenticationService.currentUser();
  id_hapus;


  ngOnInit(): void {
    this.modelParam = {
      kasir: '',
      jenis_pembayaran: '',
      status: '',
      range:''
    }
    this.uqtyForm();
    this.data(); 
    this.data_kasir();
    this.data_jenis();
    this.data_customer();
    this.empty();
    this.data_baru();
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    console.log(value);
 
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
 
    // use passed valuable to update state
    this.daterange.start = value.start.format('YYYY-MM-DD');
    this.daterange.end = value.end.format('YYYY-MM-DD');
    this.daterange.label = value.label;
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  onTableDataChange(event){
    this.page = event;
  }

  uqtyForm() {
    this.qtyForm = this.fb.group({
    id_detail: ['', Validators.required ],
    qty: ['', Validators.required],
    kodeku: ['', Validators.required]
    });
  }

  get qty_control(){
    return this.qtyForm.controls;
  }

  submit_edit(){
    this.landaService
    .DataPost('/l_penjualan/edit_qty', {
      id_detail: this.qty_control.id_detail.value,
      qty: this.qty_control.qty.value,
      kode:this.qty_control.kodeku.value
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
        }
    });
  }
  
  search(): void{
    console.log(this.daterange.start);
    if(this.daterange.start == null && this.daterange.end == null){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }else{
      this.tgl_awal = this.daterange.start;
      this.tgl_akhir = this.daterange.end;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }
  }
  
  kirim_data(pdfmodal: any){
    this.eventEmitterService.onFirstComponentButtonClick(this.data_filter);
    this.modalService.open(pdfmodal, { size: 'xl' });
  }

  detailModal(modaldetail: any, id: string) {
    this.modalService.open(modaldetail);
    this.getDetail(id);
  }

  b_hapus(){
    this.landaService
      .DataPost('/l_penjualan/hapus_data', {
        id_transaksi: this.id_hapus
      })
      .subscribe((res: any) => {

      });
  }

  deleteModal(modaldelete: any, id: string) {
    this.modalService.open(modaldelete);
    this.id_hapus = id;
  }

  modalQty(modalqty: any, id: string) {
    this.modalService.open(modalqty);
    this.data_detail_qty = this.data_produk.filter(x => x.id_detail === id);
    this.qty_control.id_detail.setValue(this.data_detail_qty[0]['id_detail']);
    this.qty_control.qty.setValue(this.data_detail_qty[0]['qty']);
  }

  getDetail(id){
    this.data_detail = this.data_database.filter(x => x.kode === id);
    this.qty_control.kodeku.setValue(this.data_detail[0]['kode']);
    this.data_produk = this.data_detail[0]['detail'];
    this.total_produk = this.data_produk.length;
  }

  exportexcel(){
    var excel = 'http://localhost/training-angular-9/api/l_penjualan/rekap_penjualan?is_export=1'+'&kasir='+this.modelParam.kasir+'&tgl_awal='+this.daterange.start+'&tgl_akhir='+this.daterange.end;
    window.open(excel);
  }

  exportpdf(){
    console.log(this.modelParam.kasir);
    var pdf = 'http://localhost/training-angular-9/api/l_penjualan/rekap_penjualan?is_print=1'+'&kasir='+this.modelParam.kasir+'&tgl_awal='+this.daterange.start+'&tgl_akhir='+this.daterange.end;
    window.open(pdf);
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
        this.landaService.DataGet('/l_penjualan/rekap_penjualan', params).subscribe((res: any) => {
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

  data_baru(){
    this.landaService
      .DataGet('/l_penjualan/rekap_penjualan', {
        
      })
      .subscribe((res: any) => {
        this.data_database = res.data.list;
      });
  }

  data_kasir(){
    this.landaService
      .DataPost('/laporan_penjualan/kasir', {
        
      })
      .subscribe((res: any) => {
        this.kasir_data = res.data.user;
      });
  }

  data_jenis(){
    this.landaService
      .DataPost('/laporan_penjualan/jenis_pembayaran', {
        
      })
      .subscribe((res: any) => {
        this.jenis_pembayaran = res.data.user;
      });
  }

  data_customer(){
    this.landaService
      .DataPost('/l_penjualan/jenis_customer', {
        
      })
      .subscribe((res: any) => {
        this.jenis_customer = res.data.user;
      });
  }

  validasi(){
    if(this.data_get == null){
      this.router.navigate(['/account/t_login']);
    }else{
      console.log(this.data_get);
    }
  }

}
