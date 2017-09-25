import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RsiApiService {

  constructor(private http: HttpClient) { }

  public getDossierOf(handle: string): Observable<IRSIDossierSummary> {
    return this.http.get("https://robertsspaceindustries.com/citizens/"+handle, { responseType: 'text', observe: "response" }).map((data) => {
      if (data.status == 404) throw "No citizen dossier for this handle";
      if (data.status == 200) {

        const helper = document.createElement("html");

        helper.innerHTML = data.body;

        const citiRecord = helper.getElementsByClassName("entry citizen-record")[0];
        const citiRecordLeft = helper.getElementsByClassName("profile left-col")[0];
        const citiRecordInfo = citiRecordLeft.getElementsByClassName("info")[0];

        const citizenRecord = citiRecord.getElementsByClassName("value")[0].innerHTML;
        const citiAvatar = "https://robertsspaceindustries.com" + citiRecordLeft.getElementsByClassName("thumb")[0].getElementsByTagName("img")[0].getAttribute('src');
        const citiHandle = citiRecordInfo.getElementsByClassName("value")[1].innerHTML;
        const citiMonicker = citiRecordInfo.getElementsByClassName("value")[0].innerHTML;


        return {handle: citiHandle, avatar: citiAvatar, id: citizenRecord, monicker: citiMonicker};
      }
    });
  }

}

/**
 * Dossier summary from RSI
 */
export interface IRSIDossierSummary {
  handle: string,
  id: string,
  avatar: string,
  monicker: string,
}