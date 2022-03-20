import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartType } from './chartjs.model';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';

import {lineBarChart} from './data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  lineBarChart: ChartType;
  bulan_ini=0;
  hari_ini=0;
  kemarin_hari=0;
  kemarin_bulan=0;

  barchat = [];
  total_bar = [];

  data_profil;

  nama_p;
  foto_p;
  

  public daterange: any = {};

  data_get = this.authenticationService.currentUser();
 
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY' },
    alwaysShowCalendars: false,
  };

  ngOnInit(): void {
    this._fetchData();
    this.data_bulanini();
    this.data_hariini();
    this.hari_kemarin();
    this.bulan_kemarin();
  }


  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
 
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
 
    // use passed valuable to update state
    this.daterange.start = value.start.format('YYYY-MM-DD');
    this.daterange.end = value.end.format('YYYY-MM-DD');

    this.barchat = [];
    this.total_bar=[];

    this.landaService
      .DataPost('/b_dashboard/barchart', {
        date:this.daterange.start
      })
      .subscribe((res: any) => {
        var data = res.data.user;
        for(let i=0; i<data.length; i++){
         this.barchat.push(data[i]['bulan']);
         this.total_bar.push(data[i]['total_terjual']);
        }
      });
    lineBarChart.labels = this.barchat;
    lineBarChart.datasets[0]['data'] = this.total_bar;
    this.lineBarChart = lineBarChart;
  }


  private _fetchData() {
    this.landaService
      .DataPost('/b_dashboard/barchart', {
        
      })
      .subscribe((res: any) => {
        var data = res.data.user;
        for(let i=0; i<data.length; i++){
         this.barchat.push(data[i]['bulan']);
         this.total_bar.push(data[i]['total_terjual']);
        }
      });
    lineBarChart.labels = this.barchat;
    lineBarChart.datasets[0]['data'] = this.total_bar;
    this.lineBarChart = lineBarChart;
    
  }

  data_hariini(){
    this.landaService
      .DataPost('/b_dashboard/hari_ini', {
        
      })
      .subscribe((res: any) => {
        if(res.data.user[0]['total_hari'] == null){
          this.hari_ini = 0;
        }else{
          this.hari_ini = res.data.user[0]['total_hari'];
        }
      });
  }

  hari_kemarin(){
    this.landaService
      .DataPost('/b_dashboard/hari_kemarin', {
        
      })
      .subscribe((res: any) => {
        if(res.data.user[0]['total_hari'] == null){
          this.kemarin_hari = 0;
        }else{
          this.kemarin_hari = res.data.user[0]['total_hari'];
        }
      });
  }

  bulan_kemarin(){
    this.landaService
      .DataPost('/b_dashboard/bulan_kemarin', {
        
      })
      .subscribe((res: any) => {
        if(res.data.user[0]['bulan_ini'] == null){
          this.kemarin_bulan = 0;
        }else{
          this.kemarin_bulan = res.data.user[0]['bulan_ini'];
        }
      });
  }

  data_bulanini(){
    this.landaService
      .DataPost('/b_dashboard/bulan_ini', {
        
      })
      .subscribe((res: any) => {
        if(res.data.user[0]['bulan_ini'] == null){
          this.bulan_ini = 0;
        }else{
          this.bulan_ini = res.data.user[0]['bulan_ini'];
        }
      });
  }

}
