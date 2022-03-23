import { Injectable } from '@angular/core';
import { EntitiesInitService } from '../data/entities-init.service';
import { ConfigService } from './config.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class MainInitService {
  constructor(
    private entsInitSvc: EntitiesInitService,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) { }

  public initialized = false;

  public async initAsync() {
    await this.entsInitSvc.initAsync();

    this.userSvc.init();
    this.configSvc.init();

    this.initialized = true;
  }
}
