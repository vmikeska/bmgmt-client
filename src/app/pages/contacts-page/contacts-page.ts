import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { faUser, faEnvelope, faMobile, faPlus, faMinus, faStar, faInfoCircle, faPhone } from '@fortawesome/free-solid-svg-icons';
import { ContactApiService } from 'src/app/api/contact/contact-api.service';
import { BindingChangeRequest, ContactResponse } from 'src/app/api/contact/contact-ints';
import { UserSkillsApiService } from 'src/app/api/tags/user-skills-api.service';
import { ItemOption } from 'src/app/ints/common-ints';
import { PageIdEnum } from '../page-id';

@Component({
  selector: 'app-contacts-page',
  templateUrl: 'contacts-page.html',
  styleUrls: ['contacts-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ContactsPageComponent implements OnInit {
  constructor(
    private router: Router,
    private contactApiSvc: ContactApiService,
    private userSkillsApiSvc: UserSkillsApiService
  ) { }

  ngOnInit() {
    this.loadAllContactsAsync();
  }

  faUser = faUser;
  faMobile = faMobile;
  faEnvelope = faEnvelope;
  faPlus = faPlus;
  faMinus = faMinus;
  faStar = faStar;
  faInfoCircle = faInfoCircle;
  faPhone = faPhone;

  public activeId = PageIdEnum.Contacts;

  public searchType = ContactsSerachTypeEnum.MyContacts;

  public serachStr = '';

  public get hasEmptyString() {
    return !this.serachStr;
  }

  public get showHasNoResults() {
    return !this.hasEmptyString && this.items.length === 0;
  }

  public get showItems() {
    return this.items.length > 0;
  }


  public detailClick(item: ContactItemVM) {
    item.isOpened = !item.isOpened;
  }

  public searchChange() {
    this.loadNewSearch();
  }

  public async loadNewSearch() {

    if (!this.serachStr) {
      await this.loadAllContactsAsync();
      return;
    }

    if (this.searchType === ContactsSerachTypeEnum.MyContacts) {
      await this.loadSearchResultsSavedContactAsync();
    }

    if (this.searchType === ContactsSerachTypeEnum.New) {
      await this.loadSearchResultsNewContactAsync();
    }

  }

  public typeChange() {
    this.items = [];
    this.loadNewSearch();
  }

  private redirectToContactDetail(id: string) {
    let url = `${PageIdEnum.ContactDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  private mapFromResToVM(res: ContactResponse) {

    // var tags: TagItemVM[] = [];

    var vm: ContactItemVM = {
      id: res.id,
      fullName: res.name,
      actions: [],
      detailActions: [],
      // tags,
      isOpened: false
    };
    return vm;
  }

  public userTagsLoadCallback = async (entityId: string) => {
    let items = await this.userSkillsApiSvc.getSaved(entityId);
    return items;
  }

  private mapSavedContacts(item: ContactItemVM) {
    item.actions = [
      {
        ico: faStar,
        callback: (item: ContactItemVM) => {
          alert('add to favorites');
        }
      }
    ];

    item.detailActions = [
      {
        ico: faPhone,
        callback: (item: ContactItemVM) => {
          alert('Now a phone call would begin');
        }
      },
      {
        ico: faEnvelope,
        callback: (item: ContactItemVM) => {
          alert('Now an email would be opened');
        }
      },
      {
        ico: faInfoCircle,
        callback: (item: ContactItemVM) => {
          this.redirectToContactDetail('asdf');
        }
      },

    ];
  }

  private async loadAllContactsAsync() {
    let res = await this.contactApiSvc.getAll();

    this.items = res.map((i) => {
      let item = this.mapFromResToVM(i);
      this.mapSavedContacts(item);
      return item;
    });
  }

  private async loadSearchResultsSavedContactAsync() {
    let res = await this.contactApiSvc.findSaved(this.serachStr);

    this.items = res.map((i) => {
      let item = this.mapFromResToVM(i);
      this.mapSavedContacts(item);
      return item;
    });
  }

  private async loadSearchResultsNewContactAsync() {
    let res = await this.contactApiSvc.findNew(this.serachStr);

    this.items = res.map((i) => {

      let item = this.mapFromResToVM(i);
      item.actions = this.getNewContactActions(i.alreadyAdded, i.id);

      item.detailActions = [
        {
          ico: faInfoCircle,
          callback: (item: ContactItemVM) => {
            this.redirectToContactDetail('asdf');
          }
        },

      ];

      return item;
    });
  }

  private getNewContactActions(alreadyAdded: boolean, contactId: string) {
    var acts: ActionItemVM[] = [
      {
        ico: alreadyAdded ? faMinus : faPlus,
        callback: async () => {
          let req: BindingChangeRequest = { contactId };

          if (alreadyAdded) {
            await this.contactApiSvc.removeNative(req);
          } else {
            await this.contactApiSvc.newNative(req);
          }

          await this.loadSearchResultsNewContactAsync();
        }
      }
    ];

    return acts;
  }

  public items: ContactItemVM[] = [];

  public searchTypes: ItemOption[] = [
    {
      label: 'My contacts',
      value: ContactsSerachTypeEnum.MyContacts
    },
    {
      label: 'New contacts',
      value: ContactsSerachTypeEnum.New
    }
  ];

}

export interface ContactItemVM {
  id: string;
  fullName: string;
  // tags: TagItemVM[];
  actions: ActionItemVM[];
  detailActions: ActionItemVM[];
  isOpened: boolean;
}

export interface TagItemVM {
  name: string;
}

export interface ActionItemVM {
  ico: any;
  callback: (item: ContactItemVM) => void;
}

export enum ContactsSerachTypeEnum { MyContacts, New }
