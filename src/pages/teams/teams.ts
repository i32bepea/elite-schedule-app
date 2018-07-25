import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TeamHomePage } from '../team-home/team-home';
import { EliteApi } from '../../providers/elite-api/elite-api';

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {

  public teams = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private eliteApi: EliteApi,
    private loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    let selectedTourney = this.navParams.data;
    let loader = this.loadingController.create({
      content : "Obteniendo equipos..."
    });

    loader.present().then( ()=> {
      this.eliteApi.getTournamentData(selectedTourney.id).subscribe(data => {
        this.teams = data.teams;
        loader.dismiss();
      });      
    });

  }

  itemTapped($event, team){
    this.navCtrl.push(TeamHomePage, team);
  }
}
