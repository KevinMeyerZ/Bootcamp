import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';
import { ChartType } from './chartjs.model';

import { lineAreaChart, lineBarChart} from './data';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  data_get = this.authenticationService.currentUser();
  
  bulan_ini;
  hari_ini;
  terjual;
  best;

  kategori1;
  kategori2;

  // Line Chart
  lineAreaChart: ChartType;
  // Bar Chart
  lineBarChart: ChartType = {
    labels: [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
    ],
    datasets: [
        {
            label: 'Produk Terjual',
            backgroundColor: 'rgba(52, 195, 143, 0.8)',
            borderColor: 'rgba(52, 195, 143, 0.8)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(52, 195, 143, 0.9)',
            hoverBorderColor: 'rgba(52, 195, 143, 0.9)',
            data: [37,23,30,32,25,35,45],
            barPercentage: 0.4

        },
    ],
    options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)'
                    },
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)'
                    }
                }
            ]
        }
    }
  };

  pieChart: ChartType = {
    labels: ['1', '2'],
    datasets: [
        {
            data: [1, 2],
            backgroundColor: ['#34c38f', '#DC3545'],
            hoverBackgroundColor: ['#34c38f', '#DC3545'],
            hoverBorderColor: '#fff',
        }
    ],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        }
    }
  };
  

  ngOnInit(): void {
    this.validasi();
    this.data_hariini();
    this.data_bulanini();
    this.data_item();
    this.best_seller();
    this.pie_chart();
    this.bar_chart();
    this._fetchData();
  }

  validasi(){
    if(this.data_get == null){
      this.router.navigate(['/account/t_login']);
    }else{
      console.log(this.data_get);
    }
  }


  private _fetchData() {
    this.lineAreaChart = lineAreaChart;
  }

  data_hariini(){
    this.landaService
      .DataPost('/dashboard/bulan_ini', {
        
      })
      .subscribe((res: any) => {
        this.bulan_ini = res.data.user[0]['bulan_ini'];
      });
  }

  data_bulanini(){
    this.landaService
      .DataPost('/dashboard/hari_ini', {
        
      })
      .subscribe((res: any) => {
        console.log(res.data.user[0]['total_hari']);
        this.hari_ini = res.data.user[0]['total_hari'];
      });
  }

  data_item(){
    this.landaService
      .DataPost('/dashboard/item_terjual', {
        
      })
      .subscribe((res: any) => {
        this.terjual = res.data.user[0]['total_terjual'];
      });
  }

  best_seller(){
    this.landaService
      .DataPost('/dashboard/best_seller', {
        
      })
      .subscribe((res: any) => {
        this.best = res.data.user;
      });
  }

  private pie_chart(){
    this.landaService
      .DataPost('/dashboard/pie_chart', {
        
      })
      .subscribe((res: any) => {
        this.pieChart = {
          labels: [res.data.user[0]['nama_kategori'], res.data.user[1]['nama_kategori']],
          datasets: [
              {
                  data: [res.data.user[0]['jumlah'], res.data.user[1]['jumlah']],
                  backgroundColor: ['#34c38f', '#DC3545'],
                  hoverBackgroundColor: ['#34c38f', '#DC3545'],
                  hoverBorderColor: '#fff',
              }
          ],
          options: {
              maintainAspectRatio: false,
              legend: {
                  position: 'top',
              }
          }
        };
      });
  }

  private bar_chart(){
    this.landaService
      .DataPost('/dashboard/bar_chart', {
        
      })
      .subscribe((res: any) => {
          let woy = res.data.user;
          const copyitems = [];
          const dataitems = [];

          woy.forEach(element => {
            copyitems.push(element['hari'])
          })

          woy.forEach(element => {
            dataitems.push(element['jumlah'])
          })

          console.log(copyitems);
          
          this.lineBarChart = {
            labels: copyitems,
            datasets: [
                {
                    label: 'Produk Terjual',
                    backgroundColor: 'rgba(52, 195, 143, 0.8)',
                    borderColor: 'rgba(52, 195, 143, 0.8)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(52, 195, 143, 0.9)',
                    hoverBorderColor: 'rgba(52, 195, 143, 0.9)',
                    data: dataitems,
                    barPercentage: 0.4
        
                },
            ],
            options: {
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: 'rgba(166, 176, 207, 0.1)'
                            },
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: 'rgba(166, 176, 207, 0.1)'
                            }
                        }
                    ]
                }
            }
          };
      });
  }

}
