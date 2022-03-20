import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { DaterangepickerComponent } from 'ng2-daterangepicker';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  @ViewChild(DaterangepickerComponent)
  private picker: DaterangepickerComponent;

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

  tambahForm: FormGroup = new FormGroup({});

  database_voucher;
  database_customer
  data_database;
  Datahasil_final;

  pageTitle;
  tambah;
  edit_v;

  plus_day;

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    datepicker.start = value.start;
    var futureDate = new Date(datepicker.start);
    futureDate.setDate(futureDate.getDate() + this.plus_day);
    // any object can be passed to the selected event and it will be passed back here
    this.picker.datePicker.setEndDate(futureDate);
 
    // use passed valuable to update state
    this.daterange.start = value.start;
    this.daterange.end = futureDate;
  }
  

  imageSrc: string;

  model: any = {

  };
  modelParam: {
    customer,
    voucher
  }

  showForm: boolean;
  showFilter: boolean;

  id_hapus;

  ckEditorConfig: Array<{}>;

  ngOnInit(): void {
    this.modelParam = {
      customer: '',
      voucher: ''
    }
    this.empty();
    this.myForm();
  }

  empty() {
    this.model = {

    };
    this.data();
    this.data_voucher();
    this.data_customer();
  }

  print(url) {
    var win = window.open('');
    var gambar = "http://localhost/training-angular-9/api/"+url;
    win.document.write('<img src="' + gambar + '" onload="window.print();window.close()" />');
    win.focus();
  }

  myForm() {
    this.tambahForm = this.fb.group({
    id: [''],
    customer: ['', Validators.required ],
    jumlah: ['', Validators.required ],
    catatan: ['', Validators.required ],
    voucher: [''],
    nominal: [''],
    fileSource: ['']
    });
  }

  index() {
    this.showForm = !this.showForm;
    this.data();
  }

  get f(){
    return this.tambahForm.controls;
  }

  submit(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var wingi = new Date(this.daterange.start);
    var dd1 = String(wingi.getDate()).padStart(2, '0');
    var mm2 = String(wingi.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy3 = wingi.getFullYear();

    var baru = mm + '-' + dd + '-' + yyyy;
    var baruku = mm2 + '-' + dd1 + '-' + yyyy3;
    if(baru > baruku){
      this.landaService.alertError('Gagal Tambah Voucher !!', 'Tanggal harus Melewati Tanggal Saat Ini');
    }else{
      this.landaService
      .DataPost('/m_voucher_java/tambah_voucher', {
        m_customer_id: this.f.customer.value,
        tgl_awal: this.daterange.start,
        tgl_akhir: this.daterange.end,
        jumlah: this.f.jumlah.value,
        catatan: this.f.catatan.value,
        m_promo_id: this.f.voucher.value,
      })
      .subscribe((res: any) => {
          if (res.data.user == null) {
            this.landaService.alertError('Gagal Tambah Voucher !!', res.errors);
          } else {   
            this.landaService.alertSuccess('Berhasil', 'Voucher Telah Tersimpan');
            this.index();
          }
      });
    }
  }

  submit_edit(){
    if(this.f.jumlah.value == 0){
      this.landaService.alertError('Gagal Edit Voucher !!', 'Jumlah Harus lebih dari 0');
    }else{
      this.landaService
      .DataPost('/m_voucher_java/update_voucher', {
        id: this.f.id.value,
        m_customer_id: this.f.customer.value,
        tgl_awal: this.daterange.start,
        tgl_akhir: this.daterange.end,
        jumlah: this.f.jumlah.value,
        catatan: this.f.catatan.value,
        m_promo_id: this.f.voucher.value,
      })
      .subscribe((res: any) => {
        console.log(res.data.user);
          if (res.data.user == null) {
            this.landaService.alertError('Gagal Update !!', res.errors);
          } else {   
            this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
            this.data();
          }
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
        };
        this.landaService.DataGet('/m_voucher_java/list_voucher', params).subscribe((res: any) => {
          this.data_database = res.data.list;
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      },
    };
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  deleteModal(content: any, id: string){
    this.modalService.open(content);
    this.id_hapus = id;
  }

  p_voucher(num: string){
    if(num != "" || num != null){
      this.Datahasil_final = this.database_voucher.filter(x => x.id == num);
      this.f.nominal.setValue(this.Datahasil_final[0]['harga']);
      this.imageSrc = "http://localhost/training-angular-9/api/"+this.Datahasil_final[0]['foto'];
      this.plus_day = this.Datahasil_final[0]['kadaluarsa'];
      console.log(this.plus_day);
    }else{
      this.f.nominal.setValue("");
      this.imageSrc = "";
    }
  }

  data_customer(){
    this.landaService
      .DataGet('/m_voucher_java/customer', {

      })
      .subscribe((res: any) => {
        this.database_customer = res.data.list;
      });
  }

  data_voucher(){
    this.landaService
      .DataGet('/m_voucher_java/list_promo', {

      })
      .subscribe((res: any) => {
        this.database_voucher = res.data.list;
      });
  }

  b_hapus(){
    this.landaService
    .DataPost('/m_voucher_java/hapus_voucher', {
      id: this.id_hapus
    })
    .subscribe((res: any) => {
      if (res.data.user == null) {
        this.landaService.alertError('Gagal Tambah Voucher !!', res.errors);
      } else {   
        this.landaService.alertSuccess('Berhasil', 'Voucher Telah Tersimpan');
        this.modalService.dismissAll();
        this.datareload();
      }
    });
  }

  datareload(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  notifikasi(){
    this.landaService.alertSuccess('Berhasil', 'Notifikasi Telah Terkirim');
  }

  create(){
    this.imageSrc = "";
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Voucher';
    this.tambah = 1;
  }

  async edit(val) {
    this.tambah = 0;
    this.showForm = !this.showForm;
    this.model = val;
    this.edit_v = 1;
    if(val.foto != null){
      this.imageSrc = "http://localhost/training-angular-9/api/"+val.foto;
    }
    this.pageTitle = 'Edit Voucher';
    await this.delay(10);
    this.picker.datePicker.setStartDate(val.tgl_awal);
    this.picker.datePicker.setEndDate(val.tgl_akhir);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
