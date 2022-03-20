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

  table: FormGroup;

  constructor(
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ){ 
    this.table = this.fb.group({
      phoneValue: this.fb.array([]),
    }); 
  }

  model: any = {

  };
  modelParam: {
    kategori,
    menu
  }
  showForm: boolean;

  data_database;
  sc_kategori;
  pageTitle;

  tambah = 0;
  edit_v = 0;
  
  imageSrc: string;
  imageChangedEvent: any = '';

  id_hapus;

  tambahForm: FormGroup = new FormGroup({});
  splitData: FormGroup;
  
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
      menu: ''
    }
    this.myForm();
    this.s_kategori();
    this.splitData = this.fb.group({
      splitValue: this.fb.array([]),
    });
    this.empty();
    this.s_kategori();
  }

  search(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  deleteModal(content: any, id: string) {
    this.modalService.open(content);
    this.id_hapus = id;
  }

  datareload(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  b_hapus(): void {
    this.landaService
      .DataPost('/b_menu/hapus_data', {
        id_produk: this.id_hapus
      })
      .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
          this.datareload();
        }
      });
  }

  create() {
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.tambah = 1;
    this.pageTitle = 'Tambah Menu';
  }

  edit(val) {
    this.tambah = 0;
    this.pageKategori = val.nama_kategori;
    this.pageIdk = val.id_kategori;
    this.kategori = val.id_kategori;
    this.status = val.status;
    this.showForm = !this.showForm;
    this.model = val;
    this.edit_v = 1;
    if(val.level != null){
      var split_l1 = val.level.split("|");
    }

    if(val.toping != null){
      var split1 = val.toping.split("|");
    }
    
    
    console.log(val);
    this.data();

    for(let i=0; i<split1.length; i++){
      var split2 = split1[i].split(",");
      var coba = this.fb.group({
        keterangan : split2[0],
        tipe : 1,
        harga : split2[1]
      });
      this.splitdata().push(coba);
    }

    for(let i=0; i<split_l1.length; i++){
      var split2 = split_l1[i].split(",");
      var coba = this.fb.group({
        keterangan : split2[0],
        tipe : 2,
        harga : split2[1]
      });
      this.splitdata().push(coba);
    }

    this.pageTitle = 'Edit Menu';

    // this.kategori_click(val.id_kategori);
    
    // this.isView = false;
    // this.isEdit = true;
  }

  index() {
    this.showForm = !this.showForm;
    this.splitData = this.fb.group({
      splitValue: this.fb.array([]),
    });
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
          limit: dataTablesParameters.length,
        };
        this.landaService.DataGet('/b_menu/menu', params).subscribe((res: any) => {
          this.data_database = res.data.user;
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      },
    };
  }

  s_kategori(){
    this.landaService
    .DataGet('/b_menu/kategori', {
      
    })
    .subscribe((res: any) => {
      this.sc_kategori = res.data.user;
    });
  }

  splitdata(): FormArray {
    return this.splitData.get('splitValue') as FormArray;
  }

  split(): FormGroup {
    return this.fb.group({
      keterangan: '',
      tipe: '',
      harga: ''
    });
  }

  addSplit() {
    this.splitdata().push(this.split());
  }

  deleteSplit(i: number) {
    this.splitdata().removeAt(i);
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


  myForm() {
    this.tambahForm = this.fb.group({
    id: [''],
    nama_menu: ['', Validators.required ],
    harga: ['', Validators.required ],
    dekripsi: ['', Validators.required ],
    fileSource: ['']
    });
  }

  get f(){
    return this.tambahForm.controls;
  }

  kategori_click(number){
    console.log(number);
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
    for(let i=0; i<2; i++){
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

  submit(){
    var tl = this.splitdata().value;
    const topping = [];
    const level = [];
    for(let i=0; i<tl.length; i++){
      if(tl[i]['tipe'] == '1'){
        topping.push(tl[i]);
      }else{
        level.push(tl[i]);
      }
    }

    var data_topping="";
    var data_level="";

    for(let i=0; i<topping.length; i++){
      data_topping += topping[i]['keterangan']+','+topping[i]['harga']+'|'
    }

    for(let i=0; i<level.length; i++){
      data_level += level[i]['keterangan']+','+level[i]['harga']+'|'
    }

    data_topping = data_topping.substring(0, data_topping.length - 1);
    data_level = data_level.substring(0, data_level.length - 1);

    this.landaService
    .DataPost('/b_menu/tambah_produk', {
      id_outlet: 1,
      nama: this.f.nama_menu.value,
      harga: this.f.harga.value,
      id_kategori: this.kategori,
      fileSource: this.tambahForm.value['fileSource'],
      toping: data_topping,
      deskripsi: this.f.dekripsi.value,
      status: this.status,
      level: data_level
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
        }
    });
  }

  submit_edit(){
    var tl = this.splitdata().value;
    const topping = [];
    const level = [];

    for(let i=0; i<tl.length; i++){
      if(tl[i]['tipe'] == '1'){
        topping.push(tl[i]);
      }else{
        level.push(tl[i]);
      }
    }

    var data_topping="";
    var data_level="";

    for(let i=0; i<topping.length; i++){
      data_topping += topping[i]['keterangan']+','+topping[i]['harga']+'|'
    }

    for(let i=0; i<level.length; i++){
      data_level += level[i]['keterangan']+','+level[i]['harga']+'|'
    }

    data_topping = data_topping.substring(0, data_topping.length - 1);
    data_level = data_level.substring(0, data_level.length - 1);

    console.log(topping);
    this.landaService
    .DataPost('/b_menu/update_produk', {
      id_outlet: 1,
      id: this.f.id.value,
      nama: this.f.nama_menu.value,
      harga: this.f.harga.value,
      status: this.status,
      id_kategori: this.kategori,
      fileSource: this.tambahForm.value['fileSource'],
      toping: data_topping,
      deskripsi: this.f.dekripsi.value,
      level: data_level
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
