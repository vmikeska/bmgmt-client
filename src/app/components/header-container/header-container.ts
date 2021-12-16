import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageIdEnum } from 'src/app/pages/page-id';
import { faBuilding, faCalendarAlt, faHome, faAddressBook, faUserAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DashboardPageComponent } from 'src/app/pages/dashboard-page/dashboard-page';
import { WorkLoadComponent } from 'src/app/pages/work-load-page/work-load-page';
import { ProjectsPageComponent } from 'src/app/pages/projects-page/projects-page';
import { ContactsPageComponent } from 'src/app/pages/contacts-page/contacts-page';
import { CurrentInstance } from 'src/app/services/current-instance';
import { ProjectDetailPageComponent } from 'src/app/pages/project-detail-page/project-detail-page';
import { UserUpdatePageComponent } from 'src/app/pages/user-update-page/user-update-page';
import { UserDetailPageComponent } from 'src/app/pages/user-detail-page/user-detail-page';

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

  public get title() {
    if (this.customTitle) {
      return this.customTitle;
    }

    return this.nativeTitle;
  }

  public nativeTitle = '';

  ngOnInit() {
    console.log('ttttttttttt');
    console.log(this.menuItems);
    console.log(CurrentInstance.instance.constructor.name);
    
    if (this.currentMenuItem) {
      this.nativeTitle = this.currentMenuItem.label;
    }

    this.activeMenuItem = this.currentMenuItem;
  }

  public activeMenuItem: MenuItem;
  // public activeSubMenuItem: MenuSubItem;

  public itemClicked(item: MenuItem) {
    item.callback();

    // this.setActiveMenuItem();
  }

  public menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      ico: faHome,
      type: DashboardPageComponent,
      callback: () => {
        let url = PageIdEnum.Dashboard;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Workload',
      ico: faCalendarAlt,
      type: WorkLoadComponent,
      callback: () => {
        let url = PageIdEnum.Workload;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Projects',
      ico: faBuilding,
      type: ProjectsPageComponent,
      subItems: [
        {
          type: ProjectDetailPageComponent,
          backCallback: () => {
            let url = PageIdEnum.Projects;
            this.router.navigate([url]);
          }
        }
      ],
      callback: () => {
        let url = PageIdEnum.Projects;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Contacts',
      ico: faAddressBook,
      type: ContactsPageComponent,
      subItems: [],
      callback: () => {
        let url = PageIdEnum.Contacts;
        this.router.navigate([url]);
      }
    },
    {
      label: 'Profile',
      ico: faUserAlt,
      type: UserDetailPageComponent,
      subItems: [],
      callback: () => {
        let url = PageIdEnum.UserDetail;
        this.router.navigate([url]);
      }
    }
  ];

  // public setActiveMenuItem() {

  //   for (let mainItem of this.menuItems) {

  //     if (mainItem.subItems) {
  //       for (let subItem of mainItem.subItems) {
  //         let subMatch = this.compareTypes(subItem.type)
  //         if (subMatch) {
  //           this.activeMenuItem = mainItem;
  //           this.activeSubMenuItem = subItem;
  //           return;
  //         }
  //       }
  //     }

  //     let mainMatch = this.compareTypes(mainItem.type);
  //     if (mainMatch) {
  //       this.activeMenuItem = mainItem;
  //       return;
  //     }

  //   }
  // }

  private compareTypes(type: any) {
    let defName = type.name;
    let instName = CurrentInstance.instance.constructor.name;
    let isActive = defName === instName;
    return isActive;
  }

  public get currentMenuItem() {
    let item = this.menuItems.find(i => i.type.name === CurrentInstance.instance.constructor.name);
    return item
  }

}

export interface MenuItem {
  label: string;
  ico: IconDefinition;
  type: any;
  subItems?: MenuSubItem[];
  callback: () => void;
}

export interface MenuSubItem {
  type: any;
  backCallback: () => void;
}
