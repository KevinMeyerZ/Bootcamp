import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Input() nama:string;
  @Input() img:string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    public landaService: LandaService
  ) { }

  data_profil;
  nama_p;
  foto_p;
  akses;

  menu;
  customer;
  promo;
  diskon;
  voucher;
  penjualan_menu;
  penjualan_customer;
  user;
  hak_akses;
  penjualan;

  data_get = this.authService.currentUser();

  ngOnInit(): void {
    if(this.data_get == null){
      this.router.navigate(['/jav_baru/login']);
    }
    this.profil();
  }

  profil(){
    this.landaService
      .DataGet('/m_user_java/list_user', {
        id : this.data_get['id'],
      })
      .subscribe((res: any) => {
        this.akses = res.data.akses;
        //auth
        if(this.akses['auth'] != null && this.akses['auth'] != ''){
          this.user = this.akses['auth']['user'];
          this.hak_akses = this.akses['auth']['hak_akses'];
        }
        if(this.akses['setting'] != null && this.akses['setting'] != ''){
            ///setting
          this.menu = this.akses['setting']['menu'];
          this.customer = this.akses['setting']['customer'];
          this.promo = this.akses['setting']['promo'];
          this.diskon = this.akses['setting']['diskon'];
          this.voucher = this.akses['setting']['voucher'];
        }
        if(this.akses['laporan'] != null && this.akses['laporan'] != ''){
          ///laporan
          this.penjualan_menu = this.akses['laporan']['penjualan_menu'];
          this.penjualan_customer = this.akses['laporan']['penjualan_customer'];
          this.penjualan = this.akses['laporan']['penjualan'];
        }

        this.data_profil = res.data.list;
        this.nama_p = this.data_profil[0]['email'];
        this.foto_p = "http://localhost/training-angular-9/api/"+this.data_profil[0]['foto'];
      });
  }

  logout(): void {
    this.authService
      .logout()
      .then((res: any) => {
          this.router.navigate(['/jav_baru/login']);
      })
      .catch((error) => {});
  }

}
