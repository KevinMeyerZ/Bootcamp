import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
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
    nama
  }

  showFilter: boolean;
  showForm: boolean;

  imageSrc: string;
  imageChangedEvent: any = '';

  inputDisabled: boolean = true;

  //xixi
  pageTitle;
  tambah = 0;
  edit_v = 0;

  data_database;
  database_akses;

  id_hapus;

  inputType = 'password';
  button_pass = 'icon fa fa-eye-slash';

  inputType2 = 'password';
  button_pass2 = 'icon fa fa-eye-slash';

  inputType3 = 'password';
  button_pass3 = 'icon fa fa-eye-slash';


  requiredForm: FormGroup = new FormGroup({});

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
    this.data_akses();
  }

  data_akses(){
    this.landaService
      .DataGet('/m_user_java/select_akses', {

      })
      .subscribe((res: any) => {
        this.database_akses = res.data.list;
      });
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  myForm(){
    this.requiredForm = this.fb.group({
      id: [''],
      nama: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')] ],
      password: [''],
      c_password: [''],
      p_lama: [''],
      v_password: [''],
      v_c_password: [''],
      fileSource: [''],
      hak_akses: ['', Validators.required],
    });
  }

  get f(){
    return this.requiredForm.controls;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    const reader = new FileReader();
    const [file] = event.target.files;

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageSrc  = reader.result as string;
      this.requiredForm.patchValue({
        fileSource: reader.result
      });
    };
  }

  change_pass(){
    if(this.inputType == 'password'){
      this.inputType = 'text';
      this.button_pass = 'icon fa fa-eye';
    }else{
      this.inputType = 'password';
      this.button_pass = 'icon fa fa-eye-slash';
    }
  }

  change_pass2(){
    if(this.inputType2 == 'password'){
      this.inputType2 = 'text';
      this.button_pass2 = 'icon fa fa-eye';
    }else{
      this.inputType2 = 'password';
      this.button_pass2 = 'icon fa fa-eye-slash';
    }
  }

  change_pass3(){
    if(this.inputType3 == 'password'){
      this.inputType3 = 'text';
      this.button_pass3 = 'icon fa fa-eye';
    }else{
      this.inputType3 = 'password';
      this.button_pass3 = 'icon fa fa-eye-slash';
    }
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.tambah = 0;
    this.edit_v = 1;
    if(val.foto == null || val.foto == ""){
      
    }else{
      this.imageSrc = "http://localhost/training-angular-9/api/"+val.foto
    }

    this.pageTitle = 'Edit User';
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
        this.landaService.DataGet('/m_user_java/list_user', params).subscribe((res: any) => {
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
      .DataPost('/m_user_java/hapus_data', {
        id: this.id_hapus
      })
      .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Hapus User !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'User Telah Terhapus');
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

  create() {
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.tambah = 1;
    this.pageTitle = 'Tambah User';
  }

  checkCheckBoxvalue(e){
    console.log(e.target.value = 1);
    if (e.target.checked) {
      this.inputDisabled = null;
    } else {
      this.inputDisabled = true;
    }
  }

  index() {
    this.imageSrc  = "";
    this.showForm = !this.showForm;
    this.inputDisabled = true;
    this.f.p_lama.setValue('');
    this.f.password.setValue('');
    this.f.c_password.setValue('');
    this.f.v_password.setValue('');
    this.f.v_c_password.setValue('');
    this.f.fileSource.setValue('');
    this.data();
  }

  submit(){
    this.landaService
    .DataPost('/m_user_java/tambah_user', {
      nama: this.f.nama.value,
      email: this.f.email.value,
      password: this.f.password.value,
      c_password: this.f.c_password.value,
      fileSource: this.requiredForm.value['fileSource'],
      hak_akses: this.f.hak_akses.value,
    })
    .subscribe((res: any) => {
        if (res.data.list == null) {
          this.landaService.alertError('Gagal Tambah User !!', res.data.massage);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'User Telah Tersimpan');
          this.index();
        }
    });
  }

  submit_edit(){
    this.landaService
    .DataPost('/m_user_java/update_user', {
      id: this.f.id.value,
      nama: this.f.nama.value,
      email: this.f.email.value,
      p_lama: this.f.p_lama.value,
      password: this.f.v_password.value,
      c_password: this.f.v_c_password.value,
      fileSource: this.requiredForm.value['fileSource'],
      hak_akses: this.f.hak_akses.value,
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah User !!', res.data.massage);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'User Telah Tersimpan');
        }
    });
  }

}
