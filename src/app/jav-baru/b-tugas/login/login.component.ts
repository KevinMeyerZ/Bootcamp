import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }

  inputType = 'password';
  button_pass = 'icon fa fa-eye-slash';
  requiredForm: FormGroup = new FormGroup({});
  error = '';

  ngOnInit(): void {
    this.requiredForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  change_pass(){
    if(this.inputType == 'password'){
      this.inputType = 'text';
      this.button_pass = 'icon fa fa-eye';
    }else{
      this.inputType = 'password';
      this.button_pass = 'icon fa fa-eye-slash';
    }
  }

  get f(){
    return this.requiredForm.controls;
  }

  async submit_login() {
    this.landaService
    .DataPost('/auth/setSessions', {
        email: this.f.email.value,
        password: this.f.password.value,
        sumber: 1,
    })
    .subscribe((res: any) => {
        if (res.status_code == 200) {
            this.authenticationService
                .setDetailUser(res.data.user)

                .then(() => {

                    this.router.navigate(['/jav_baru/dashboard']);
                })
                .catch((error) => {
                    this.error =
                        'Terjadi kesalahan pada server';
                });
        } else {
          this.landaService.alertError('Gagal Login !!', res.errors[0]);
        }
    });
  }

}
