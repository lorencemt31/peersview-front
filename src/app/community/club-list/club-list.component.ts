import {
  Component,
  OnInit
} from '@angular/core';
import {
  CommunityService
} from '../../../services/services';
import {
  CreateClubPageComponent
} from '../../shared/create-club-page/create-club-page.component';
import {
  MatDialog
} from '@angular/material';

@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss']
})
export class ClubListComponent implements OnInit {
  constructor (
    private communityService: CommunityService,
    private dialog: MatDialog
  ) {}

  protected cslist: any[] = [];

  public ngOnInit (): void {
    this.communityService.getsocietyclubs()
    .subscribe((response: any) => {
      this.cslist = response.campusStudentGroups;
    }, error => {
      console.log(error);
    });
  }

  public followclub (clubid: Number): void {
    this.communityService.followclub(clubid)
    .subscribe((response: any) => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  protected createClubPage (): void {
    this.dialog.open(CreateClubPageComponent);
  }
}
