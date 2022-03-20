import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  requiredForm: FormGroup = new FormGroup({});
  error = '';
  successmsg = false;
  data_get = this.authenticationService.currentUser();
  data_tampil;
  $jk = '';

  ngOnInit(): void {
    this.validasi();
    this.requiredForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      nama: ['', [Validators.required]],
      password: ['', [Validators.required]],
      c_password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      no_telp: ['', [Validators.required]],
      alamat: ['', [Validators.required]],
      jenis_kelamin: ['', [Validators.required]],
      password_lama: ['', [Validators.required]]
    });
    this.data();
  }

  get f(){
    return this.requiredForm.controls;
  }
  
  validasi(){
    if(this.data_get == null){
      this.router.navigate(['/account/t_login']);
    }else{
      console.log(this.data_get);
    }
  }

  data(){
    this.landaService
      .DataPost('/auth/data_user', {
        id: this.data_get.id
      })
      .subscribe((res: any) => {
        this.data_tampil = res.data.user[0];
        console.log(this.data_tampil);
        if(this.data_tampil.jenis_kelamin == 1){
          this.$jk = 'Laki-Laki';
        }else{
          this.$jk = 'Perempuan';
        }
        this.f.username.setValue(this.data_tampil.id);
        this.f.nama.setValue(this.data_tampil.nama);
        this.f.email.setValue(this.data_tampil.email);
        this.f.no_telp.setValue(this.data_tampil.telepon);
        this.f.alamat.setValue(this.data_tampil.alamat);
        this.f.jenis_kelamin.setValue(this.$jk);
      });
  }

  async submit(){
    this.landaService
            .DataPost('/auth/update_profile', {
              id: this.f.username.value,
              nama: this.f.nama.value,
              password_baru: this.f.password.value,
              c_password_baru: this.f.c_password.value,
              email: this.f.email.value,
              no_telp: this.f.no_telp.value,
              alamat: this.f.alamat.value,
              jenis_kelamin: this.f.jenis_kelamin.value,
              password_lama: this.f.password_lama.value
            })
            .subscribe((res: any) => {
                /**
                 * Simpan detail user ke session storage
                 */
                if (res.data.user == null) {
                  this.landaService.alertError('Gagal Update !!', res.errors);
                } else {   
                  this.landaService.alertSuccess('Berhasil', 'Data User Telah Terupdate');
                  this.router.navigate(['/account/update-profil']);
                }
            });
  }

}
