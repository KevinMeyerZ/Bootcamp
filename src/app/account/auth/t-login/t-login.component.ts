import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';
@Component({
  selector: 'app-t-login',
  templateUrl: './t-login.component.html',
  styleUrls: ['./t-login.component.scss']
})
export class TLoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
  ) { }
  username = '';
  password = '';
  requiredForm: FormGroup = new FormGroup({});
  error = '';

  ngOnInit(): void {
    this.requiredForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
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
                /**
                 * Simpan detail user ke session storage
                 */
                if (res.status_code == 200) {
                    this.authenticationService
                        .setDetailUser(res.data.user)

                        .then(() => {

                            this.router.navigate(['/account/dashboard']);
                        })
                        .catch((error) => {
                            this.error =
                                'Terjadi kesalahan pada server';
                        });
                } else {
                    this.error = res.errors[0];
                }
            });
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

   deleteChild() { 
    const e = document.getElementById("app");
    
    //e.firstElementChild can be used. 
    let child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    } 
  } 

  onAddStudent(): void {
    if(!!this.username && !!this.password){
      if(this.validateEmail(this.username)){
        if(this.password.length > 5){
          window.location.href="http://localhost:4200/account/dashboard";
        }else{
          alert('Password minimal 6 karakter!');
        }
      }else{
        alert('Format Harus Email!');
      }
    }else{
      alert('Username dan Password harus diisi!');
    }
  }

  onUpdateStudent(event: Event): void {
    this.username = (event.target as HTMLInputElement).value;
  }

  onUpdateStudent2(event: Event): void {
    this.password = (event.target as HTMLInputElement).value;
  }
}
