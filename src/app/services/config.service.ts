import { Injectable } from "@angular/core";
import { UserSettingsEntity } from "src/app/data/entities/entities";
import { UserSettingsEntityOperations } from "src/app/data/entity-operations";
import { UserService } from "src/app/services/user.service";

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(
    private userSettingEntSvc: UserSettingsEntityOperations,
    private userSvc: UserService

    ) {

  }

  public init() {

    let hasSetting = !!this.setting;
    if (!hasSetting) {
      let e: UserSettingsEntity = {
        dayWorkingHours: 8,
        dayHoursTreshold: 8,
        user_id: this.userSvc.id
      };
      this.userSettingEntSvc.create(e);
    }
  }

  public get setting() {
    if (this.userSettingEntSvc.list.length) {
      return this.userSettingEntSvc.list[0];
    }

    return null;
  }



  public get dayWorkingHours() {
    return this.setting.dayWorkingHours;
  }




}
