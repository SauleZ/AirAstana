import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import icClear from '@iconify/icons-ic/clear';
import {Sort} from '../../../../app/shared/models/filter/sort';
import {CommunicationService} from '../../../services/communication/communication.service';

@Component({
  selector: 'vex-sorting-mobile',
  templateUrl: './sorting-mobile.component.html',
  styleUrls: ['./sorting-mobile.component.scss']
})
export class SortingMobileComponent implements OnInit {
  icClear = icClear;
  sort: Sort;

  constructor(
      private communicationService: CommunicationService,
      private dialog: MatDialogRef<SortingMobileComponent>
  ) {
    if (localStorage.getItem('sort')) {
      this.sort = JSON.parse(localStorage.getItem('sort'));
    } else {
      this.sort = new Sort();
      this.sort.sortBy = 'duration';
      this.sort.orderBy = 'desc';
    }
  }

  ngOnInit(): void {
  }

    closeClick() {
      this.dialog.close();
    }

  sortSelected(sortBy: string) {
    this.sort.sortBy = sortBy;
    localStorage.setItem('sort', JSON.stringify(this.sort));
    this.communicationService.sortChange(this.sort);
    this.dialog.close();
  }

}
