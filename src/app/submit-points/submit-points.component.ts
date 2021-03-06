import { Component, OnInit } from '@angular/core';
import { StateService } from '@uirouter/core';
import { GlobalVariables } from '../variables';
import {
  BasicFunctionsService,
  PointsDetailsInterface,
} from '../services/basic-functions.service';
import { SubmitDialogComponent } from './submit-dialogpopup.component';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: class-name
interface pointsDetails {
  [key: string]: PointsDetailsInterface;
}
@Component({
  selector: 'app-submit-points',
  templateUrl: './submit-points.component.html',
  styleUrls: ['./submit-points.component.scss'],
})
export class SubmitPointsComponent implements OnInit {
  pointsDetails: pointsDetails = {};
  isLoading: boolean;
  types = [
    { name: 'Gatha', id: 1 },
    { name: 'Daily Task', id: 4 },
    { name: 'Weekly Task', id: 3 },
  ];
  swal = GlobalVariables.swal;
  constructor(private basic: BasicFunctionsService, public dialog: MatDialog) {
    this.isLoading = true;
    basic.PointsDetails.forEach((i) => {
      this.pointsDetails[i.id] = i;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {}

  submitbuttonClicked(id) {
    const dialogRef = this.dialog.open(SubmitDialogComponent, {
      direction: 'ltr',
      position: {
        // top: '10px',
        // right: '10px',
        // left: '10px',
        // bottom: '10px',
      },
      maxWidth: '75vh',
      height: '90%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: { selected: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
      console.log(result);
    });
  }
}
