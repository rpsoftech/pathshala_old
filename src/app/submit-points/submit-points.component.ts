import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/core';
import { GlobalVariables } from '../variables';
import { BasicFunctionsService } from '../services/basic-functions.service';
import { SubmitDialogComponent } from './submit-dialogpopup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-submit-points',
  templateUrl: './submit-points.component.html',
  styleUrls: ['./submit-points.component.scss'],
})
export class SubmitPointsComponent implements OnInit {
  constructor(
    private state: StateService,
    private basic: BasicFunctionsService,
    public dialog: MatDialog
  ) {}
  selected: string | boolean = false;
  types = [
    { name: 'Gatha', id: 1 },
    { name: 'Daily', id: 2 },
    { name: 'Weekly', id: 3 },
  ];
  swal = GlobalVariables.swal;
  ngOnInit(): void {}

  submitbuttonClicked() {
    if (this.selected !== false) {
      this.swal.fire(
        'Warning',
        'Please Select Point Type' + this.selected,
        'warning'
      );
      const dialogRef = this.dialog.open(SubmitDialogComponent, {
        // width: '250px',
        data: { selected: this.selected },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        // this.animal = result;
        console.log(result);
      });
    } else {
      this.swal.fire('Warning', 'Please Select Point Type', 'warning');
    }
  }
}
