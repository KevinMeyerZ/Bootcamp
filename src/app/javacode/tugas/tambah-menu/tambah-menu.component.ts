import { FormBuilder, FormGroup, Validators, FormArray, } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tambah-menu',
  templateUrl: './tambah-menu.component.html',
  styleUrls: ['./tambah-menu.component.scss']
})
export class TambahMenuComponent implements OnInit {

  table: FormGroup;

  constructor(
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) 
  {this.table = this.fb.group({
    phoneValue: this.fb.array([]),
  }); }



  tambahForm: FormGroup = new FormGroup({});
  splitData: FormGroup;
  

  sc_kategori;
  kategori;
  status;

  kat_button="btn btn-outline-primary w-sm";

  ngOnInit(): void {
    this.myForm();
    this.s_kategori();
    this.splitData = this.fb.group({
      splitValue: this.fb.array([]),
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


  myForm() {
    this.tambahForm = this.fb.group({
    nama_menu: ['', Validators.required ],
    harga: ['', Validators.required ],
    dekripsi: ['', Validators.required ],
    });
  }

  get f(){
    return this.tambahForm.controls;
  }

  kategori_click(number){
    console.log(number);
    var get_el = document.getElementById("kat_button"+number);
    get_el.classList.remove("btn-outline-primary");
    get_el.classList.add("btn-primary");
    this.kategori = number;
  }

  status_menu(number){
    this.status = number;
  }

  s_kategori(){
    this.landaService
    .DataGet('/b_menu/kategori', {
      
    })
    .subscribe((res: any) => {
      this.sc_kategori = res.data.user;
    });
  }

  submit(){
    var tl = this.splitdata().value;
    const topping = [];
    const level = [];
    for(let i=0; i<tl.length; i++){
      if(tl[i]['tipe'] == 'Topping'){
        topping.push(tl[i]);
      }else{
        level.push(tl[i]);
      }
    }

    console.log(topping);
    console.log(level);
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

    console.log(data_topping);

    this.landaService
    .DataPost('/b_menu/tambah_produk', {
      id_outlet: 1,
      nama: this.f.nama_menu.value,
      harga: this.f.harga.value,
      id_kategori: this.kategori,
      // fileSource: this.requiredForm.value['fileSource'],
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

}
