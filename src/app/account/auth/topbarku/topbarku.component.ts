import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';
@Component({
  selector: 'app-topbarku',
  templateUrl: './topbarku.component.html',
  styleUrls: ['./topbarku.component.scss']
})
export class TopbarkuComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    public landaService: LandaService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService
            .logout()
            .then((res: any) => {
                this.router.navigate(['/account/t_login']);
            })
            .catch((error) => {});
  }

}
