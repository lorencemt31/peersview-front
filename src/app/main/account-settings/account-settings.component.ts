import {
  Component,
  OnInit,
  NgModule
} from '@angular/core';
import {
  AccountSettingService,
  CourseService,
  UserService
} from '../../../services/services';
import {
  UserModel,
  UserResponse,
  CourseResponse,
  Course,
  AccountSetting
} from '../../../models/models';
import {
  DateAdapter,
  NativeDateAdapter,
  MatDatepickerModule
} from '@angular/material';
import * as $ from 'jquery';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  constructor (
    private _accountsettingservice: AccountSettingService,
    private _userservice: UserService,
    private dateAdapter: DateAdapter<NativeDateAdapter>,
    private _courseservice: CourseService
  ) {
    this.dateAdapter.setLocale('en-EN');
  }

  public active: string = 'general';
  public isNewCardOpen = false;
  protected languages: any[] = [];
  protected passwordchange = {};
  protected pagemodel = {};
  protected user = new UserModel();
  protected courses: Course[] = [];

  public ngOnInit (): void {
    this.getUserProfile();
    this.getCourses();
    let self = this;
    this._accountsettingservice.getAccountSetting()
    .subscribe((response: any) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });

    this.languages = this._courseservice.getlanguages();

    $('.tabChange').click(function (e): void {
      const that = $(this);
      const panel = that.data('tab-name');
      self.active = panel;
      $('.tab-pane').removeClass('active');
      $('#' + panel).addClass('active');
      that.addClass('active');
    });
  }

  protected openEdit (e): void {
    $(e.target).hide();
    $(e.target).closest('li').find('.setting-value').hide();
    $(e.target).closest('li').find('.edit-field').fadeIn();
    $('#general-action').fadeIn();
  }

  protected cancelEdit (): void {
    $('.setting-value').show();
    $('.edit-field').hide();
    $('#general-action').hide();
    $('.setting-edit').fadeIn();
  }

  protected onSavePassword (): void {
    console.log(this.passwordchange);
    this._accountsettingservice.updatepassword(this.passwordchange)
    .subscribe((response: any) => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  protected onUpdatesecurityPrivacy (): void {
    const model = {
      protectPost: this.user.protectPost,
      profilePrivacy: this.user.profilePrivacy,
      userPrivacyId: this.user.userPrivacyId
    };

    this._accountsettingservice.updateSecurityaPrivacy(model)
    .subscribe(resp => {
      console.log(resp);
    }, error => {
      console.log(error);
    });
  }

  protected unblockuser (user: any): void {
    console.log(user);
    let userindex = this.pagemodel['blocked'].indexOf(user);
    console.log(userindex);
    this.pagemodel['blocked'].splice(userindex, 1);
    this._accountsettingservice.unblockuser(user.blocked_by, { 'unblock_id': user.blocked })
    .subscribe((response: any) => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  protected updateuser (): void {
    this._accountsettingservice.updateuser(this.pagemodel)
    .subscribe((response: any) => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  private getUserProfile (): void {
    this._accountsettingservice.getUserProfile()
    .subscribe((response: UserResponse) => {
      this.user = response.user;
      console.log(this.user);
    });
  }

  private getCourses (): void {
    this._courseservice.getCourses()
    .subscribe((response: CourseResponse) => {
      this.courses = response.courses;
    });
  }
}
