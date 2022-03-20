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
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss']
})
export class PromoComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  apiURL = environment.apiURL;

  ckEditorConfig: Array<{}>;

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
    nama,
    tipe
  }

  showFilter: boolean;
  showForm: boolean;

  inputDisabled1 = 1;
  inputDisabled2 = 1;

  edit_v;
  tambah;

  p_diskon;
  p_tipe;
  pageTitle;

  imageSrc: string;
  imageChangedEvent: any = '';

  tambahForm: FormGroup = new FormGroup({});
  

  data_database;
  id_hapus;

  diskon_button="btn bg-custom";

  ngOnInit(): void {
    this.modelParam = {
      nama: '',
      tipe: ''
    }
    this.empty();
    this.myForm();
  }

  usAmount = 100;
  updateUSAmount(event) {
    this.usAmount = event.target.value;
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  myForm() {
    this.tambahForm = this.fb.group({
    id: [''],
    nama: ['', Validators.required ],
    p_diskon: ['', [Validators.pattern("^[0-9]*$")] ],
    harga: ['', [Validators.pattern("^[0-9]*$")] ],
    kadaluarsa: ['', Validators.required ],
    fileSource: [''],
    deskripsi: ['', Validators.required ],
    });
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
        this.landaService.DataGet('/m_promo_java/list_promo', params).subscribe((res: any) => {
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

  submit(){
    this.landaService
    .DataPost('/m_promo_java/tambah_promo', {
      nama: this.f.nama.value,
      tipe: this.p_diskon,
      diskon: this.f.p_diskon.value,
      fileSource: this.tambahForm.value['fileSource'],
      harga: this.f.harga.value,
      kadaluarsa: this.f.kadaluarsa.value,
      deskripsi: this.f.deskripsi.value,
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
          this.index();
        }
    });
  }

  submit_edit(){
    this.landaService
    .DataPost('/m_promo_java/update_promo', {
      id: this.f.id.value,
      nama: this.f.nama.value,
      tipe: this.p_diskon,
      diskon: this.f.p_diskon.value,
      fileSource: this.tambahForm.value['fileSource'],
      harga: this.f.harga.value,
      kadaluarsa: this.f.kadaluarsa.value,
      deskripsi: this.f.deskripsi.value,
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

  async create(){
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Promo';
    this.tambah = 1;
    await this.delay(10);
    this.status_menu(1);
  }

  get f(){
    return this.tambahForm.controls;
  }

  status_menu(number){
    if(number == 1){
      this.inputDisabled1 = 2;
      this.inputDisabled2 = 1;
    }else{
      this.inputDisabled1 = 1;
      this.inputDisabled2 = 2;
    }
    for(let i=1; i<=2; i++){
      if(i == number){
        var get_el = document.getElementById("diskon_button"+number);
        get_el.classList.remove("bg-custom");
        get_el.classList.add("btn-dark");
        this.p_diskon = number;
      }else{
        var get_el = document.getElementById("diskon_button"+i);
        get_el.classList.remove("btn-dark");
        get_el.classList.add("bg-custom");
      }
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  

  index() {
    this.showForm = !this.showForm;
    this.imageSrc = "";
    this.data();
  }

  async edit(val) {
    this.tambah = 0;
    this.showForm = !this.showForm;
    this.model = val;
    this.edit_v = 1;

    if(val.foto != null){
      this.imageSrc = "http://localhost/training-angular-9/api/"+val.foto;
    }

    this.pageTitle = 'Edit Promo';
    if(val.tipe == 'Diskon'){
      var status = 1;
    }else{
      var status = 2;
    }
    await this.delay(10);
    this.status_menu(status);
  }

  b_hapus(){
    this.landaService
    .DataPost('/m_promo_java/hapus_data', {
      id: this.id_hapus
    })
    .subscribe((res: any) => {
      if (res.data.user == null) {
        this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
      } else {   
        this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
        this.modalService.dismissAll();
        this.datareload();
      }
    });
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  deleteModal(content: any, id: string){
    this.modalService.open(content);
    this.id_hapus = id;
  }

  datareload(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
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

}
