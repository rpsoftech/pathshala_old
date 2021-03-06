import { Component, OnInit } from '@angular/core';
import { BasicFunctionsService } from '../services/basic-functions.service';
import { GlobalVariables } from '../variables';
import { StateService } from '@uirouter/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  password = '';
  userId = '';
  waiting = false;
  constructor(
    private basic: BasicFunctionsService,
    private state: StateService
  ) {}
  ngOnInit(): void {}
  login(): void {
    this.waiting = true;
    this.basic
      .login(this.userId, 'post', this.password)
      .then(() => {
        this.basic.clearhistoryGotoLink();
      })
      .catch(() => {
        GlobalVariables.swal.fire('Error', 'Something Went Wrong', 'error');
      })
      .finally(() => {
        this.waiting = false;
      });
  }
}
// [ladda]="progress"
