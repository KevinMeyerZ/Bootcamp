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
    customer
  }

  data_database;
  total_ngaji;
  total_ontime;

  showFilter: boolean;
  
  ngOnInit(): void {
    this.modelParam = {
      customer: ''
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
        this.landaService.DataGet('/m_diskon_java/list_customer', params).subscribe((res: any) => {
          this.data_database = res.data.list;
          this.total_ngaji = res.data.t_ngaji;
          this.total_ontime = res.data.t_ontime;
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
    .DataPost('/m_diskon_java/update_ngaji', {
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

  edit_ontime(id,number){
    if(number == 0){
      var hasil = 1;
    }else{
      var hasil = 0;
    }
    this.landaService
    .DataPost('/m_diskon_java/update_ontime', {
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
