import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageIdEnum } from 'src/app/pages/page-id';
import { faBuilding, faCalendarAlt, faHome, faAddressBook, faUserAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header-container',
  templateUrl: 'header-container.html'
})

export class HeaderContainerComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }

  @Input()
  public customTitle = '';

  @Input()
  public showTitle = true;

  @Input()
  public activeId: string;

  public get title() {
    if (this.customTitle) {
      return this.customTitle;
    }

    return this.nativeTitle;
  }

  public nativeTitle = '';

  ngOnInit() {
    this.activeMenuItem = this.menuItems.find(i => i.id === this.activeId);

    if (this.activeMenuItem) {
      this.nativeTitle = this.activeMenuItem.label;
    }
  }

  public activeMenuItem: MenuItem;


  public itemClicked(item: MenuItem) {
    item.callback();
  }

  public menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      ico: faHome,
      id: PageIdEnum.Dashboard,
      callback: () => {
        let url = PageIdEnum.Dashboard;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Workload',
      ico: faCalendarAlt,
      id: PageIdEnum.Workload,
      callback: () => {
        let url = PageIdEnum.Workload;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Contacts',
      ico: faAddressBook,
      id: PageIdEnum.Contacts,
      callback: () => {
        let url = PageIdEnum.Contacts;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Profile',
      ico: faUserAlt,
      id: PageIdEnum.UserDetail,
      callback: () => {
        let url = PageIdEnum.UserDetail;
        this.router.navigate([url]);
      }
    }
  ];

}

export interface MenuItem {
  label: string;
  ico: IconDefinition;
  id: string;
  callback: () => void;
}
