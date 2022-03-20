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

  edit_v;
  tambah;

  showFilter: boolean;
  showForm: boolean;

  p_diskon;
  p_tipe;
  pageTitle;

  diskon_button="btn btn-outline-primary w-sm";
  diskon_button2="btn btn-primary"

  imageSrc: string;
  imageChangedEvent: any = '';

  tambahForm: FormGroup = new FormGroup({});

  data_database;
  id_hapus;

  ngOnInit(): void {
    this.modelParam = {
      nama: '',
      tipe: ''
    }
    this.myForm();
    this.data();
  }

  status_menu(number){
    for(let i=1; i<=2; i++){
      if(i == number){
        var get_el = document.getElementById("diskon_button"+number);
        get_el.classList.remove("btn-outline-primary");
        get_el.classList.add("btn-primary");
        this.p_diskon = number;
      }else{
        var get_el = document.getElementById("diskon_button"+i);
        get_el.classList.remove("btn-primary");
        get_el.classList.add("btn-outline-primary");
      }
    }
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
    nama: ['', Validators.required ],
    p_diskon: [''],
    harga: [''],
    kadaluarsa: ['', Validators.required ],
    fileSource: ['']
    });
  }

  submit(){
    this.landaService
    .DataPost('/b_voucher/tambah_promo', {
      nama: this.f.nama.value,
      tipe: this.p_diskon,
      diskon: this.f.p_diskon.value,
      fileSource: this.tambahForm.value['fileSource'],
      harga: this.f.harga.value,
      kadaluarsa: this.f.kadaluarsa.value,
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
        }
    });
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  create(){
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Menu';
    this.tambah = 1;
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  get f(){
    return this.tambahForm.controls;
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
        this.landaService.DataGet('/b_voucher/list_promo', params).subscribe((res: any) => {
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

  b_hapus(){
    this.landaService
    .DataPost('/b_voucher/hapus_data', {
      id: this.id_hapus
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

  datareload(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  
  deleteModal(content: any, id: string){
    this.modalService.open(content);
    this.id_hapus = id;
  }

  edit(val) {
    this.tambah = 0;
    this.showForm = !this.showForm;
    this.model = val;
    this.p_diskon = val.tipe;
    this.edit_v = 1;

    this.pageTitle = 'Edit Menu';
  }

  index() {
    this.showForm = !this.showForm;
    this.data();
  }

  submit_edit(){
    this.landaService
    .DataPost('/b_voucher/update_promo', {
      id: this.f.id.value,
      nama: this.f.nama.value,
      tipe: this.p_diskon,
      diskon: this.f.p_diskon.value,
      fileSource: this.tambahForm.value['fileSource'],
      harga: this.f.harga.value,
      kadaluarsa: this.f.kadaluarsa.value,
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
