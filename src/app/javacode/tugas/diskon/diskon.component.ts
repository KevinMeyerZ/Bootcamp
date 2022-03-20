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
  selector: 'app-diskon',
  templateUrl: './diskon.component.html',
  styleUrls: ['./diskon.component.scss']
})
export class DiskonComponent implements OnInit {
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
    karyawan
  }

  data_database;
  total_ngaji;
  total_kehadiran;
  total_rekruit;
  showFilter: boolean;

  ngOnInit(): void {
    this.modelParam = {
      karyawan: ''
    }
    this.empty();
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
        this.landaService.DataGet('/b_karyawan/list_karyawan', params).subscribe((res: any) => {
          this.data_database = res.data.user;
          this.total_ngaji = this.data_database.filter(x => x.s_ngaji === 1);
          this.total_kehadiran = this.data_database.filter(x => x.s_kehadiran === 1);
          this.total_rekruit = this.data_database.filter(x => x.s_rekruit === 1);
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      },
    };
  }

  pencarian(){
    this.showFilter = !this.showFilter;
  }

  edit_ngaji(id,number){
    if(number == 0){
      var hasil = 1;
    }else{
      var hasil = 0;
    }
    this.landaService
    .DataPost('/b_karyawan/update_ngaji', {
      id: id,
      number: hasil
    })
    .subscribe((res: any) => {
      console.log(res.data.user);
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
          this.datareload();
        }
    });
  }

  edit_kehadiran(id,number){
    if(number == 0){
      var hasil = 1;
    }else{
      var hasil = 0;
    }
    this.landaService
    .DataPost('/b_karyawan/update_kehadiran', {
      id: id,
      number: hasil
    })
    .subscribe((res: any) => {
      console.log(res.data.user);
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
          this.datareload();
        }
    });
  }

  edit_rekruit(id, number){
    if(number == 0){
      var hasil = 1;
    }else{
      var hasil = 0;
    }
    this.landaService
    .DataPost('/b_karyawan/update_rekruit', {
      id: id,
      number: hasil
    })
    .subscribe((res: any) => {
      console.log(res.data.user);
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
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
