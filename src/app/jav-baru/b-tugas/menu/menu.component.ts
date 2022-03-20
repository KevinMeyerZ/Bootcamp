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
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  apiURL = environment.apiURL;

  constructor(
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  @ViewChild('modaldelete') closebutton;

  model: any = {

  };
  modelParam: {
    kategori,
    menu
    
  }

  data_database;
  id_hapus;

  tambahForm: FormGroup = new FormGroup({});
  splitData: FormGroup;
  splitData2: FormGroup;

  showFilter: boolean;
  showForm: boolean;

  imageSrc: string;
  imageChangedEvent: any = '';

  sc_kategori: any = [{id: 1, nama_kategori:'makanan'},{id:2, nama_kategori:'minuman'},{id:3, nama_kategori:'snack'}];

  //xixi
  pageTitle;
  tambah = 0;
  edit_v = 0;

  kategori;
  status;

  kat_button="btn btn-outline-primary w-sm";
  kat_button2="btn btn-primary";
  pageKategori;
  pageIdk;

  ada_button="btn btn-outline-primary w-sm";
  ada_button2="btn btn-primary";

  ngOnInit(): void {
    this.modelParam = {
      kategori: '',
      menu:''
    }
    this.empty();
    this.myForm();
    this.splitData = this.fb.group({
      splitValue: this.fb.array([]),
    });
    this.splitData2 = this.fb.group({
      splitValue2: this.fb.array([]),
    });
  }

  usAmount = 100;
  updateUSAmount(event) {
    this.usAmount = event.target.value;
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  empty() {
    this.model = {

    };
    this.data();
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
          limit: dataTablesParameters.length
        };
        this.landaService.DataGet('/m_menu_java/dashboard_menu', params).subscribe((res: any) => {
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

  deleteModal(content: any, id: string) {
    this.modalService.open(content);
    this.id_hapus = id;
  }

  hapus(){
    this.landaService
      .DataPost('/m_menu_java/hapus_data', {
        id: this.id_hapus
      })
      .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Hapus Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Terhapus');
          this.datareload();
          this.modalService.dismissAll();
        }
      });
  }

  datareload(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  index() {
    this.imageSrc  = "";
    this.f.fileSource.setValue('');
    this.showForm = !this.showForm;
    this.splitData = this.fb.group({
      splitValue: this.fb.array([]),
    });
    this.splitData2 = this.fb.group({
      splitValue2: this.fb.array([]),
    });
    this.data();
  }

  async create() {
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.tambah = 1;
    this.pageTitle = 'Tambah Menu';
    await this.delay(10);
    this.status_menu(1);
    this.kategori_click(1);

  }

  edit(val) {
    if(val.kategori == 'makanan'){
      var coba = 1;
    }else{
      var coba = 2;
    }
    if(val.status == 'ada'){
      var coba2 = 1;
    }else{
      var coba2 = 2;
    }
    if(val.foto != null && val.foto != ''){
      this.imageSrc = "http://localhost/training-angular-9/api/"+val.foto;
    }
    this.tambah = 0;
    this.pageKategori = val.kategori;
    this.pageIdk = coba;
    this.kategori = coba;
    this.status = coba2;
    this.showForm = !this.showForm;
    this.model = val;
    this.edit_v = 1;
    
    for(let i=0; i<val.detail.length; i++){
      if(val.detail[i]['tipe'] == 'topping'){
        var angka = 1;
      }else{
        var angka = 2;
      }
      var cuanki = this.fb.group({
        id: val.detail[i]['id_topping'],
        keterangan : val.detail[i]['detail_nama'],
        tipe : angka,
        harga : val.detail[i]['harga']
      });
      this.splitdata2().push(cuanki);
      console.log(cuanki);
    }

    this.data();

    this.pageTitle = 'Edit Menu';
  }

  myForm() {
    this.tambahForm = this.fb.group({
    id: [''],
    nama_menu: ['', Validators.required ],
    harga: ['', [Validators.required, Validators.pattern("^[0-9]*$")] ],
    dekripsi: ['', Validators.required ],
    fileSource: ['']
    });
  }

  get f(){
    return this.tambahForm.controls;
  }

  submit(){
    var tl = this.splitdata().value;

    for(let i = 0; i<tl.length; i++){
      if(tl[i]['keterangan'] == '' || tl[i]['tipe'] == '' || tl[i]['harga'] == ''){
        this.landaService.alertError('Gagal Tambah Produk !!','Lengkapi Inputan Topping');
        var validasi = 2;
      }
    }

    if(validasi != 2){
      this.landaService
      .DataPost('/m_menu_java/tambah_menu', {
        nama: this.f.nama_menu.value,
        kategori: this.kategori,
        harga: this.f.harga.value,
        deskripsi: this.f.dekripsi.value,
        status: this.status,
        fileSource: this.tambahForm.value['fileSource'],
        detail: tl,
      })
      .subscribe((res: any) => {
          if (res.data.user == null) {
            this.landaService.alertError('Gagal Tambah Produk !!', res.data.massage);
          } else {   
            this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
            this.index();
          }
      });
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  splitdata(): FormArray {
    return this.splitData.get('splitValue') as FormArray;
  }

  splitdata2(): FormArray {
    return this.splitData2.get('splitValue2') as FormArray;
  }

  split(): FormGroup {
    return this.fb.group({
      keterangan: '',
      tipe: '',
      harga: ''
    });
  }

  split2(): FormGroup {
    return this.fb.group({
      id:'',
      keterangan: '',
      tipe: '',
      harga: ''
    });
  }

  addSplit() {
    this.splitdata().push(this.split());
  }

  addSplit2() {
    this.splitdata2().push(this.split2());
  }

  deleteSplit(i: number) {
    this.splitdata().removeAt(i);
  }

  deleteSplit2(i: number) {
    this.splitdata2().removeAt(i);
  }

  kategori_click(number){
    for(let i=0; i<this.sc_kategori.length; i++){
      if(this.sc_kategori[i]['id'] == number){
        var get_el = document.getElementById("kat_button"+number);
        get_el.classList.remove("btn-outline-primary");
        get_el.classList.add("btn-primary");
        this.kategori = number;
      }else{
        var get_el = document.getElementById("kat_button"+this.sc_kategori[i]['id']);
        get_el.classList.remove("btn-primary");
        get_el.classList.add("btn-outline-primary");
      }
    }
    
  }

  status_menu(number){
    for(let i=1; i<3; i++){
      if(i == number){
        var get_el = document.getElementById("ada_button"+number);
        get_el.classList.remove("btn-outline-primary");
        get_el.classList.add("btn-primary");
        this.status = number;
      }else{
        var get_el = document.getElementById("ada_button"+i);
        get_el.classList.remove("btn-primary");
        get_el.classList.add("btn-outline-primary");
      }
    }
  }

  delete_topping(id,i){
    this.splitdata2().removeAt(i);
    this.landaService
    .DataPost('/m_menu_java/hapus_topping', {
      id: id
    })
    .subscribe((res: any) => {
      if (res.data.user == null) {
        this.landaService.alertError('Gagal Hapus Topping !!', res.errors);
      } else {   
        this.landaService.alertSuccess('Berhasil', 'Topping Telah Terhapus');
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    const reader = new FileReader();
    const [file] = event.target.files;

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageSrc  = reader.result as string;
      this.tambahForm.patchValue({
        fileSource: reader.result
      });
    };
  }

  submit_edit(){
    var data_baru = this.splitdata().value;
    var data_lama = this.splitdata2().value;

    console.log(data_baru);
    console.log(data_lama);
    this.landaService
    .DataPost('/m_menu_java/update_produk', {
      id: this.f.id.value,
      nama: this.f.nama_menu.value,
      kategori: this.kategori,
      harga: this.f.harga.value,
      deskripsi: this.f.dekripsi.value,
      status: this.status,
      fileSource: this.tambahForm.value['fileSource'],
      detail : data_lama,
      data_baru: data_baru
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
        }
    });
  }

}
