import { Injectable } from "@angular/core";
import { ApiValueService } from "src/lib/api/api-value-service";
import { InfoConfigResponse } from "./account-ints";

@Injectable({ providedIn: 'root' })
export class ConfigLoaderService extends ApiValueService<InfoConfigResponse> {
  protected get url() {
    return 'account/info';
  }
}
