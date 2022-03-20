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
  selector: 'app-hak-akses',
  templateUrl: './hak-akses.component.html',
  styleUrls: ['./hak-akses.component.scss']
})
export class HakAksesComponent implements OnInit {
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
  ){}
  
  tambahForm: FormGroup = new FormGroup({});
  dataFinal = {auth:{},setting:{},laporan:{}};

  showForm: boolean;
  showFilter: boolean;

  data_database;
  mencoba = true;
  
  id_hapus;
  edit_v;
  tambah;

  model: any = {

  };
  modelParam: {
    nama
  }

  ngOnInit(): void {
    this.modelParam = {
      nama: ''
    }
    this.empty();
    this.myForm();
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
          limit: dataTablesParameters.length,
        };
        this.landaService.DataGet('/m_user_java/select_akses', params).subscribe((res: any) => {
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

  myForm() {
    this.tambahForm = this.fb.group({
    id: [''],
    nama: [''],
    });
  }

  get f(){
    return this.tambahForm.controls;
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  centang(event, parent, tipe, val){
    // if (tipe == 1) {
    //   this.dataFinal[parent] = {};
    // }else{
      this.dataFinal[parent][val] = event.target.checked;
      console.log(this.dataFinal);
    // }
  }

  submit(){
    
   this.landaService
    .DataPost('/m_user_java/tambah_akses', {
      user: this.f.nama.value,
      akses: this.dataFinal,
    })
    .subscribe((res: any) => {
        if (res.data.massage == null) {
          this.landaService.alertError('Gagal Tambah Hak Akses !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Hak Akses Telah Tersimpan');
          this.index();
        }
    });
  }

  submit_edit(){
    this.landaService
    .DataPost('/m_user_java/edit_akses', {
      id: this.f.id.value,
      nama: this.f.nama.value,
      akses: this.dataFinal,
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Edit Hak Akses !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Hak Akses Telah Teredit');
        }
    });
  }

  deleteModal(content: any, id: string) {
    this.modalService.open(content);
    this.id_hapus = id;
  }

  hapus(){
    this.landaService
      .DataPost('/m_user_java/hapus_akses', {
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

  edit(val){
    console.log(val.akses['laporan'])
    if(val.akses['auth'].length == 0){
      val.akses['auth'] = {};
    }
    if(val.akses['setting'].length == 0){
      val.akses['setting'] = {};
    }
    if(val.akses['laporan'].length == 0){
      val.akses['laporan'] = {};
    }
    this.dataFinal = val.akses;
    this.tambah = 0;
    this.edit_v = 1;
    this.showForm = !this.showForm;
    this.model = val;
  }

  create(){
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.tambah = 1;
  }

  index() {
    this.dataFinal = {auth:{},setting:{},laporan:{}};
    this.showForm = !this.showForm;
    this.data();
  }

}
