import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import "rxjs/add/operator/map"
import { Observable } from '../../../node_modules/rxjs/Observable';
import "rxjs/add/observable/of"

@Injectable()
export class EliteApi {

  private baseUrl = 'https://elite-schedule-app-i2-20e9c.firebaseio.com/';
  private currentTourney: any = {};
  private tourneyData = {};

  constructor(public http: Http) {
    console.log('Hello EliteApiProvider Provider');
  }

  getTournaments(){
    return new Promise(resolve => {
        this.http.get(`${this.baseUrl}/tournaments.json`)
            .subscribe(res => resolve(res.json()));
    });
}

  getTournamentData(tourneyId, forceRefresh: boolean = false) : Observable<any> {
    if (!forceRefresh && this.tourneyData[tourneyId]) {
        this.currentTourney = this.tourneyData[tourneyId];
        console.log('**no need to make HTTP call, just return the data'); 
        return Observable.of(this.currentTourney);
    }

    // don't have data yet
    console.log('**about to make HTTP call');
    return this.http.get(`${this.baseUrl}/tournaments-data/${tourneyId}.json`)
        .map(response => {
            this.tourneyData[tourneyId] = response.json();
            this.currentTourney = this.tourneyData[tourneyId];
            return this.currentTourney;
        });
  }

  refreshCurrentTourney(){
    return this.getTournamentData(this.currentTourney.tournament.id, true);
  }
/* 
  getTournamentData(tourneyId) : Observable<any>{
    return this.http.get(`${this.baseUrl}/tournaments-data/${tourneyId}.json`)
      .map(response => {
        this.currentTourney = response.json();
        return this.currentTourney;
      })
  }
 */
  getCurrentTourney(){
    return this.currentTourney;
  }
}
