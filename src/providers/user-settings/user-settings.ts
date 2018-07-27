import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserSettings {

  constructor(private storage : Storage) {
    console.log('Hello UserSettingsProvider Provider');
  }

  favoriteTeam(team, tournamentId, torunamentName){
    let item = {
      team: team,
      tournamentId : tournamentId,
      torunamentName : torunamentName
    };

    this.storage.set(team.id.toString(), JSON.stringify(item));
  }

  unfavoriteTeam(team) {
    this.storage.remove(team.id.toString());
  }

  isFavoriteTeam(teamId: string){
    return this.storage.get(teamId).then(value => value ? true  : false)
  }

  getAllFavorites(){
    let results = [];
    this.storage.forEach(data => {
      results.push(JSON.parse(data))
    });
    return results;
  }

}
