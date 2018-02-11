import { Component, OnInit } from '@angular/core';
import { UserService, AccountSettingService } from '../../../services/services';
import { MatDialog } from '@angular/material';
import { EditInterestModalComponent } from '../edit-interest-modal/edit-interest-modal.component';
import { EditAccomplishmentsModalComponent } from '../edit-accomplishments-modal/edit-accomplishments-modal.component';
import { AboutMeModalComponent } from '../../shared/about-me-modal/about-me-modal.component';
import { ShowImageComponent } from '../../shared/show-image/show-image.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor (
    private accountSettingService: AccountSettingService,
    public dialog: MatDialog
  ) {
    this.items = [1, 2, 3, 4, 5, 6, 7, 8];
    this.properties = {
      items: 1,
      loop: true,
      dots: false,
      nav: true,
      onChange: function (): void {}
    };
  }

  public items: any;
  public properties: any;
  private user: any;
  private credits = 0;
  private stars = 0;
  private followers = [];
  private following = [];

  public ngOnInit (): void {
    this.accountSettingService.getusercredits()
      .subscribe((response: any) => {
        this.credits = response.userCredits.totalCredits;
        if (this.credits > 400) {
          this.stars = 5;
        } else if (this.credits > 300) {
          this.stars = 4;
        } else if (this.credits > 200) {
          this.stars = 3;
        } else if (this.credits > 100) {
          this.stars = 2;
        } else if (this.credits > 0) {
          this.stars = 1;
        }
      }, error => {
        console.log(error);
      });

    this.accountSettingService.getuserprofile()
      .subscribe((response: any) => {
        this.user = response.user;
      }, error => {
        console.log(error);
      });
  }

  protected openInterest (): void {
    this.dialog.open(EditInterestModalComponent);
  }

  protected openAccomplishments (): void {
    this.dialog.open(EditAccomplishmentsModalComponent, {
      data: this.user,
      id: 'EditAccomplishmentsModalComponent'
    })
      .afterClosed()
      .subscribe(accomplishments => {
        if (!accomplishments) { return; }
        this.user.accomplishments = accomplishments;
      });
  }

  protected openAboutMeModal (): void {
    this.dialog.open(AboutMeModalComponent, {
      id: 'AboutMeModalComponent'
    })
      .afterClosed()
      .subscribe(aboutMe => {
        if (!aboutMe) { return; }
        this.user.aboutMe = aboutMe;
      });
  }

  protected openAvatar (): void {
    this.dialog.open(ShowImageComponent, {
      data: {
        src: '/assets/images/john.jpg'
      },
    });
  }
}
