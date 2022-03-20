import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private modalService: NgbModal, 
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  inputType = 'password';
  button_pass = 'icon fa fa-eye-slash';

  inputType2 = 'password';
  button_pass2 = 'icon fa fa-eye-slash';

  data_get = this.authenticationService.currentUser();
  data_database;

  nama;

  requiredForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.data();
    this.myForm();
  }

  data(){
    this.landaService
      .DataGet('/b_karyawan/list_user', {
        id : this.data_get['id'],
      })
      .subscribe((res: any) => {
        this.data_database = res.data.user;
        this.nama = this.data_database[0]['nama'];
        this.f.nama.setValue(this.data_database[0]['nama']);
        this.f.email.setValue(this.data_database[0]['email']);
      });
  }

  myForm(){
    this.requiredForm = this.formBuilder.group({
      nama: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: [''],
      c_password: [''],
      fileSource: [''],
    });
  }

  get f(){
    return this.requiredForm.controls;
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

  submit(){
    if(this.f.password.value == this.f.c_password.value){
      alert('Password Sama');
    }else{
      alert('Password Tidak Sama');
    }
  }

}
