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
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
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
    customer,
    voucher
  }

  tambahForm: FormGroup = new FormGroup({});
  
  database_customer;
  database_voucher;
  data_database;

  pageTitle;
  showForm: boolean;
  tambah;
  edit_v;
  id_hapus;

  showFilter: boolean;
  
  imageSrc: string;

  Datahasil_final;

  plus_day;

  ngOnInit(): void {
    this.modelParam = {
      customer: '',
      voucher: ''
    }
    this.data_customer();
    this.data_voucher();
    this.myForm();
    this.data();
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  myForm() {
    this.tambahForm = this.fb.group({
    id: [''],
    customer: ['', Validators.required ],
    tanggal: ['', Validators.required ],
    jumlah: ['', Validators.required ],
    catatan: ['', Validators.required ],
    voucher: [''],
    nominal: [''],
    fileSource: ['']
    });
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  create(){
    this.imageSrc = "";
    this.edit_v = 0;
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Voucher';
    this.tambah = 1;
  }

  edit(val) {
    this.tambah = 0;
    this.showForm = !this.showForm;
    this.model = val;
    this.edit_v = 1;
    this.imageSrc = "http://localhost/training-angular-9/api/"+val.gambar;

    this.pageTitle = 'Edit Voucher';
  }

  b_hapus(){
    this.landaService
    .DataPost('/b_voucher/hapus_voucher', {
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

  index() {
    this.showForm = !this.showForm;
    this.data();
  }

  get f(){
    return this.tambahForm.controls;
  }

  data_customer(){
    this.landaService
      .DataGet('/b_dashboard/customer', {
        awal : 1
      })
      .subscribe((res: any) => {
        this.database_customer = res.data.user;
      });
  }

  data_voucher(){
    this.landaService
      .DataGet('/b_voucher/list_promo', {

      })
      .subscribe((res: any) => {
        this.database_voucher = res.data.user;
      });
  }

  p_voucher(num: string){
    this.Datahasil_final = this.database_voucher.filter(x => x.id_promo == num);
    console.log(this.Datahasil_final);
    this.f.nominal.setValue(this.Datahasil_final[0]['harga']);
    this.imageSrc = "http://localhost/training-angular-9/api/"+this.Datahasil_final[0]['gambar'];
    this.plus_day = this.Datahasil_final[0]['kadaluarsa'];
  }

  submit(){
    this.landaService
    .DataPost('/b_voucher/tambah_voucher', {
      id_customer: this.f.customer.value,
      tgl_awal: this.f.tanggal.value,
      tgl_akhir: this.plus_day,
      jumlah: this.f.jumlah.value,
      catatan: this.f.catatan.value,
      v_promo_id: this.f.voucher.value,
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
    this.landaService
    .DataPost('/b_voucher/update_voucher', {
      id: this.f.id.value,
      id_customer: this.f.customer.value,
      tgl_awal: this.f.tanggal.value,
      tgl_akhir: this.plus_day,
      jumlah: this.f.jumlah.value,
      catatan: this.f.catatan.value,
      v_promo_id: this.f.voucher.value,
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

  deleteModal(content: any, id: string){
    this.modalService.open(content);
    this.id_hapus = id;
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
        this.landaService.DataGet('/b_voucher/list_voucher', params).subscribe((res: any) => {
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



}
