import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
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
    namaku,
    statusku
  }

  data_database;
  id_ver;
  status;
  namast;
  final_verifikasi;
  verif = [
    {
     status: 0,
     nama: 'Verifikasi'
    },
    {
     status: 1,
     nama: 'Unverifikasi'
    }
  ];

  verifikasi_button="btn bg-custom";
  verifikasi_button2="btn btn-dark";

  showFilter: boolean;

  ngOnInit(): void {
    this.modelParam = {
      namaku: '',
      statusku: ''
    }
    this.empty();
    this.data();
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  verfikasiModal(content: any, id: string, status: string) {
    this.modalService.open(content);
    if(status == '0'){
      this.status = status;
      this.namast = 'Verifikasi';
      this.id_ver = id;
      this.final_verifikasi = status;
    }else{
      this.status = status;
      this.namast = 'Unverifikasi';
      this.id_ver = id;
      this.final_verifikasi = status
    }
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  submit(){
    this.landaService
    .DataPost('/b_voucher/customer', {
      id: this.id_ver,
      status: this.final_verifikasi,
    })
    .subscribe((res: any) => {
      console.log(res.data.user);
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
          this.data();
          this.reloadtabel();
        }
    });
  }

  reloadtabel(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  verifikasiku(number){
    for(let i=0; i<2; i++){
      if(i == number){
        var get_el = document.getElementById("v_button"+number);
        get_el.classList.remove("bg-custom");
        get_el.classList.add("btn-dark");
        this.final_verifikasi = number;
      }else{
        var get_el = document.getElementById("v_button"+i);
        console.log(get_el);
        get_el.classList.remove("btn-dark");
        get_el.classList.add("bg-custom");
      }
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
        this.landaService.DataGet('/b_dashboard/customer', params).subscribe((res: any) => {
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
