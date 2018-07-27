import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import {
  EliteApi
} from '../../providers/elite-api/elite-api';

import moment from 'moment';
import * as _ from 'lodash';
import { GamePage } from '../game/game';
import { UserSettings } from '../../providers/user-settings/user-settings';


@Component({
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html',
})
export class TeamDetailPage {

  public allGames: any[];
  public dateFilter = "";
  public isFollowing = false;
  public games: any[];
  public team: any;
  public teamStanding: any = {};
  private tourneyData: any;
  public useDateFilter = false;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private userSettings: UserSettings,
    private eliteApi: EliteApi) {
  
      this.initialize();
    }
  
  initialize(){
    this.team = this.navParams.data;
    this.tourneyData = this.eliteApi.getCurrentTourney();

    this.games = _.chain(this.tourneyData.games)
                  .filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
                  .map(g => {
                      let isTeam1 = (g.team1Id === this.team.id);
                      let opponentName = isTeam1 ? g.team2 : g.team1;
                      let scoreDisplay = this.getScoreDisplay(isTeam1, g.team1Score, g.team2Score);
                      return {
                          gameId: g.id,
                          opponent: opponentName,
                          time: Date.parse(g.time),
                          location: g.location,
                          locationUrl: g.locationUrl,
                          scoreDisplay: scoreDisplay,
                          homeAway: (isTeam1 ? "vs." : "at")
                      };
                  })
                  .value();
    
    this.allGames = this.games;          
    this.teamStanding = _.find(this.tourneyData.standings, { 'teamId': this.team.id });  

  }  

  ionViewDidLoad(){
    this.userSettings.isFavoriteTeam(this.team.id.toString()).then(value => this.isFollowing = value);
  }

  dateChanged() {
    if(this.useDateFilter && this.dateFilter != ""){
      this.games = _.filter(this.allGames, g => moment(g.time).isSame(this.dateFilter, 'day'));
    }
    else{
      this.games = this.allGames;
    }
  }

  getScoreDisplay(isTeam1, team1Score, team2Score) {
    if (team1Score && team2Score) {
      var teamScore = (isTeam1 ? team1Score : team2Score);
      var opponentScore = (isTeam1 ? team2Score : team1Score);
      var winIndicator = teamScore > opponentScore ? "W: " : "L: ";
      return winIndicator + teamScore + "-" + opponentScore;
    } else {
      return "";
    }
  }

  gameClicked($event, game){
    let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
    this.navCtrl.push(GamePage, sourceGame);
  }

  getScoreWorL(game) {
    return game.scoreDisplay ? game.scoreDisplay[0] : '';
  }

  getScoreDisplayBadgeClass(game) {
    return game.scoreDisplay.indexOf("W:") === 0 ? 'primary' : 'danger';
  }

  toggleFollow(){
    if(this.isFollowing){
      let confirm = this.alertController.create({
        title: '¿Dejar de seguir?',
        message: '¿Esta seguro de que quiere dejar de seguir a este equipo?',
        buttons: [
         {
            text: 'Si',
            handler: () => {
              this.isFollowing = false;
              this.userSettings.unfavoriteTeam(this.team);

              let toast = this.toastController.create({
              message: 'Has dejado de seguir a este equipo.',
              duration: 1500,
              position: 'top'
            });
            toast.present();
           }
         },
         { text: 'No' }
        ]
      });
      confirm.present();
    }
    else{
      this.isFollowing = true;

      this.userSettings.favoriteTeam(this.team, this.tourneyData.tournament.id, this.tourneyData.tournament.name);

      let toast = this.toastController.create({
        message: 'Ahora sigues a este equipo.',
        duration: 1500,
        position: 'top'
      });
      toast.present();
    }
  }

  refreshAll(refresher){
    this.eliteApi.refreshCurrentTourney().subscribe(() => {
      refresher.complete();
      this.initialize();
      this.ionViewDidLoad();
    });
  }

}