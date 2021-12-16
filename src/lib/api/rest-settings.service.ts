import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RestSettingsService {
    constructor() { }

    public withCredentials = true;

}
