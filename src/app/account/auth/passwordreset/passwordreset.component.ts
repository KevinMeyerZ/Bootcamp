import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  email ='';

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService) { }

    requiredForm: FormGroup = new FormGroup({});
    successmsg = false;

  ngOnInit() {

    this.requiredForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  get f(){
    return this.requiredForm.controls;
  }

  async submit(){
    this.landaService
            .DataPost('/auth/forgot', {
              email: this.f.email.value
            })
            .subscribe((res: any) => {
              console.log(res.data.user);
                /**
                 * Simpan detail user ke session storage
                 */
                if (res.data.user == null) {
                  this.landaService.alertError('Gagal reset password !!', res.errors);
                } else {   
                  this.landaService.alertSuccess('Berhasil', 'Password user telah di reset !! ');
                  this.router.navigate(['/account/t_login']);
                }
            });

  }
}
