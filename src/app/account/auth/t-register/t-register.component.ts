import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';


@Component({
  selector: 'app-t-register',
  templateUrl: './t-register.component.html',
  styleUrls: ['./t-register.component.scss']
})
export class TRegisterComponent implements OnInit {

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

  ngOnInit(): void {
    this.requiredForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      nama: ['', [Validators.required]],
      password: ['', [Validators.required]],
      c_password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      no_telp: ['', [Validators.required]],
      alamat: ['', [Validators.required]],
      jenis_kelamin: ['', [Validators.required]]
    });
  }

  get f(){
    return this.requiredForm.controls;
  }

  async submit(){
    this.landaService
            .DataPost('/auth/register', {
              username: this.f.username.value,
              nama: this.f.nama.value,
              password: this.f.password.value,
              c_password: this.f.c_password.value,
              email: this.f.email.value,
              telepon: this.f.no_telp.value,
              alamat: this.f.alamat.value,
              jenis_kelamin: this.f.jenis_kelamin.value
            })
            .subscribe((res: any) => {
              console.log(res.data.user);
                /**
                 * Simpan detail user ke session storage
                 */
                if (res.data.user == null) {
                  this.landaService.alertError('Gagal Register !!', res.errors);
                } else {   
                  this.landaService.alertSuccess('Berhasil', 'Data User Telah Tersimpan');
                  this.router.navigate(['/account/t_login']);
                }
            });
  }

}
