import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AsyncPipe } from '@angular/common';
import * as _ from "lodash";
import { CourseService, AuthenticationService, OnboardingService } from "../../../services/services";

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss']
})
export class ThreeComponent implements OnInit {
  interests: any[] = [];
  subinterests: any[] = [];
  term = '';
  searchResult: any = [];
  maxSelectedInterestsCount = 5;
  selectedInterests: any[] = [];
  maxSelectedSubInterestsCount = 4;
  suggestedInterest: any[] = [];
  isDisabled: any[] = [];

  constructor(private _courseService: CourseService,
    private _authenticationService: AuthenticationService,
    private _onboardingService: OnboardingService,
    private router: Router) {
  }

  ngOnInit() {
    this._courseService.getInterest().subscribe((response: any) => {
      const a = _.map(response.interestCategory, (value: any, key) => {
        this.interests.push({ "id": value.id, "value": value.name });
        const parsedValues: any[] = [];
        this.subinterests = _.union(this.subinterests, parsedValues);
      });

      this.interests = _.orderBy(this.interests, ["value"], ["asc"]);
      this.subinterests = _.orderBy(this.subinterests, ["interest_value", "value"], ["asc", "asc"]);
      this.subinterests = _.pull(this.subinterests, { "value": "" });
    });

  }

  toggleInterest(interest: any) {
    interest.isselected = !interest.isselected;
    this.selectedInterests = this.interests.filter(function(item) { return item.isselected; });
    this.selectedInterests.forEach((item, i) => {
      if (this.selectedInterests.length > 0) {
        const catId = item.id;
        this._courseService.getSubInterest(catId).subscribe((response: any) => {
          this.selectedInterests[i]['subinterests'] = response.interests;

          this.subinterests.forEach((item) => {
            if (item.interestid === interest.id) {
              item.parentisselected = interest.isselected;
              if (!interest.isselected) {
                item.isselected = false;
                item.isdisabled = false;
              }
            }
          });
        });
      }
    });
  }

  toggleSubInterest(subinterest, selectedIndex) {
    const sI = _.findIndex(this.selectedInterests[selectedIndex]['subinterests'], subinterest);
    let interest = this.interests.filter(interest => {
      return interest.id == this.selectedInterests[selectedIndex].id;
    })[0];

    if (!interest.isselected && this.selectedInterests.length >= this.maxSelectedInterestsCount) {
      return false;
    }

    if (!interest.isselected) {
      this.toggleInterest(interest);
    }

    this.selectedInterests[selectedIndex]['subinterests'][sI].isselected = !this.selectedInterests[selectedIndex]['subinterests'][sI].isselected;
    this.selectedInterests[selectedIndex]['subinterests'].forEach(
      function(subinterest) {
        subinterest.isdisabled = this.getSelectedSubinterestsCountInGroup(subinterest) >= this.maxSelectedSubInterestsCount && !subinterest.isselected;
      }.bind(this)
    );
  }

  submitInterests() {
    let finalInterestsHandler = [];
    for (let fI = 0; fI < this.selectedInterests.length; fI++) {
      const finalInterests = _.filter(this.selectedInterests[fI]['subinterests'], (item) => {
        return item.isselected === true;
      }).map((item) => {
        return item['id'];
      });

      finalInterestsHandler.push(finalInterests);
    }

    finalInterestsHandler = [].concat.apply([], finalInterestsHandler)
    let finalInterests = finalInterestsHandler;

    if (finalInterests.length < 5) {
      alert("At Least Five Sub Interests are required");
    } else {
      this._authenticationService.updateInterests(finalInterests).subscribe((response) => {
        this.router.navigate(["/home"]);
      }, (error) => {
        console.log(error);
      });
    }
  }

  getInterestClass(interest) {
    return 'list-' + interest.value.toLowerCase().replace(/\s+/g, "-").replace(/[^0-9a-zA-Z\-]/g, "");
  }

  search() {
    let searchResult = {};

    if (!this.term) {
      this.searchResult = [];
      return false;
    }
    this.interests
      .filter(interest => {
        return interest.value && ~interest.value.toLowerCase().indexOf(this.term.toLowerCase());
      })
      .forEach(interest => {
        searchResult[interest.id] = interest;
        searchResult[interest.id].subinterests = [];
      });

    this.subinterests
      .filter(subinterest => {
        return subinterest.value && ~subinterest.value.toLowerCase().indexOf(this.term.toLowerCase());
      })
      .forEach(subinterest => {
        let interest = this.interests.filter((interest) => { return subinterest.interestid == interest.id })[0];

        if (!searchResult[interest.id]) {
          searchResult[interest.id] = interest;
          searchResult[interest.id].subinterests = [subinterest];
        } else {
          searchResult[interest.id].subinterests.push(subinterest);
        }
      });

    this.searchResult = _.values(searchResult)
      .sort((prev, next) => {
        if (!prev['subinterests'].length && !next['subinterests'].length) {
          return 0;
        }

        if (!prev['subinterests'].length && next['subinterests'].length) {
          return -1;
        }

        if (prev['subinterests'].length && !next['subinterests'].length) {
          return 1;
        }

        return next['subinterests'].length - prev['subinterests'].length
      });
  }

  saveSubinterest(event, interestId) {
    if (!event.target.value) { return false; }

    let indexPosition = 0;
    this.subinterests.forEach((subinterest, index) => {
      indexPosition = interestId == subinterest.interestid ? index : indexPosition;
    });

    this.subinterests[indexPosition].last_in_group = false;

    let interest = this.interests.filter(interest => {
      return interest.id == interestId;
    })[0];

    let newSubinterest = {
      id: 0,
      interest_value: interest.value,
      interestid: interest.id,
      isselected: false,
      last_in_group: true,
      parent_title: interest.value,
      value: event.target.value,
      isdisabled: this.getSelectedSubinterestsCountInGroup(this.subinterests[indexPosition]) >= this.maxSelectedSubInterestsCount,
      parentisselected: true
    }

    this.subinterests.splice(indexPosition + 1, 0, newSubinterest);

    event.target.value = '';
  }

  getSelectedSubinterestsCountInGroup(subinterest) {
    let subinterestsCount = {};
    this.selectedInterests.forEach(interest => {
      subinterestsCount[interest.id] = this.subinterests.filter(subinterest => {
        return subinterest.isselected && interest.id == subinterest.interestid;
      }
      ).length;
    }
    );
    return subinterestsCount[subinterest.interestid];
  }

  submitSuggested(event, interestCategoryID, selectedIndex) {
    if (event.keyCode === 13 || event.type === 'click') {
      if (this.suggestedInterest[selectedIndex]) {
        this.isDisabled[selectedIndex] = true;
        let suggestedInterest = this.suggestedInterest[selectedIndex];
        let selectedSubInterest = this.selectedInterests[selectedIndex].subinterests;

        if (!this.alreadySuggested(selectedSubInterest, suggestedInterest, selectedIndex)) {
          this._onboardingService.saveSuggestedInterest(interestCategoryID, this.suggestedInterest[selectedIndex]).subscribe((response) => {

            // addind suggested field to determined and show delete function
            response['interest']['suggested'] = true;
            selectedSubInterest.push(response['interest']);

            this.suggestedInterest[selectedIndex] = null;
            this.isDisabled[selectedIndex] = false;
          });
        } else {
          this.suggestedInterest[selectedIndex] = null;
          this.isDisabled[selectedIndex] = false;
        }
      }
    }
  }

  alreadySuggested(selectedSubInterestHolder, suggestedInterest, selectedIndex) {
    let interestAlreadySuggested = false;
    for (let i = 0; i < selectedSubInterestHolder.length; i++) {
      let selectedSubInterest = selectedSubInterestHolder[i].name || selectedSubInterestHolder[i].value;
      if (selectedSubInterest.toLowerCase() === suggestedInterest.toLowerCase()) {
        interestAlreadySuggested = true;
        break;
      }
    }

    return interestAlreadySuggested;
  }

  deleteSuggested(interestId, selectedInterestIndex, selSubInterestIndex) {
    this._onboardingService.deleteSuggestedInterest(interestId).subscribe((response) => {
      this.selectedInterests[selectedInterestIndex].subinterests.splice(selSubInterestIndex, 1);
    })
  }
}
