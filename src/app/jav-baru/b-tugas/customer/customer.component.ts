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

  @ViewChild('closebutton') private closebutton: NgbModal;

  model: any = {

  };
  modelParam: {
    namaku,
    statusku
  }

  showFilter: boolean;

  data_database;
  final_verifikasi;
  id_ver;

  verifikasi_button="btn bg-custom";

  verif = [
    {
     status: 1,
     nama: 'Verifikasi'
    },
    {
     status: 2,
     nama: 'Unverifikasi'
    }
  ];

  ngOnInit(): void {
    this.modelParam = {
      namaku: '',
      statusku: ''
    }
    this.empty();
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  verifikasiku(number){
    if(number == 'Verifikasi'){
      var angka = 1;
    }else{
      var angka = 2;
    }
    console.log(angka);
    for(let i=1; i<=2; i++){
      if(i == angka){
        var get_el = document.getElementById("v_button"+angka);
        get_el.classList.remove("bg-custom");
        get_el.classList.add("btn-dark");
        this.final_verifikasi = number;
      }else{
        var get_el = document.getElementById("v_button"+i);
        get_el.classList.remove("btn-dark");
        get_el.classList.add("bg-custom");
      }
    }
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  async verfikasiModal(content: any, id: string, status: string) {
    this.modalService.open(content);
    await this.delay(10);
    this.verifikasiku(status);
    this.id_ver = id;
    this.final_verifikasi = status;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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
        this.landaService.DataGet('/m_customer_java/customer', params).subscribe((res: any) => {
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
    .DataPost('/m_customer_java/edit_customer', {
      id: this.id_ver,
      status: this.final_verifikasi,
    })
    .subscribe((res: any) => {
      console.log(res.data.user);
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
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
  

}
