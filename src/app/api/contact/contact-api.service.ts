import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { BindingChangeRequest, ContactResponse } from './contact-ints';

@Injectable({ providedIn: 'root' })
export class ContactApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async findNew(str: string) {
    let req = { str };
    let res = await this.restApiSvc.getAsync<ContactResponse[]>('contact/find-new', req);
    return res;
  }

  public async getAll() {
    let res = await this.restApiSvc.getAsync<ContactResponse[]>('contact/contacts');
    return res;
  }

  public async findSaved(str: string) {
    let req = { str };
    let res = await this.restApiSvc.getAsync<ContactResponse[]>('contact/find-saved', req);
    return res;
  }

  public async newNative(req: BindingChangeRequest) {
    let res = await this.restApiSvc.postAsync<boolean>('contact/new-native', req);
    return res;
  }

  public async removeNative(req: BindingChangeRequest) {
    let res = await this.restApiSvc.deleteAsync<boolean>('contact/remove-native', req);
    return res;
  }

}
