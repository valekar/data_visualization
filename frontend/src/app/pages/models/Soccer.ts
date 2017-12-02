export class Team {
    id: number;
    team_api_id: number;
    team_fifa_api_id: number;
    team_long_name: string;
    team_short_name: string;
}

export class TeamData {
    data: Array<Team>;
}

export class Match {
    team_name: string;
    total_matches: string;
    season: string;
    home: number;
    away: number;
    total_home_team_goals: number;
    total_away_team_goals: number;
    win: number;
    loss: number;
    draw: number;
}

export class MatchData {
    data: Array<Match>
}

export class TeamAttributes {
    team_api_id: number;
    date: string;
    buildUpPlaySpeed: number;
    buildUpPlayPassing: number;
    chanceCreationPassing: number;
    chanceCreationCrossing: number;
    chanceCreationShooting: number;
    defencePressure: number;
    defenceAggression: number;
    defenceTeamWidth: number;
}

export class TeamAttributesData{
    data:Array<TeamAttributes>;
}


//geodata
export class GeoData{
    data:Array<Geo>;
}

export class Geo{
    features:Array<Feature>;
    type:string;
}

export class Feature{
    geometry:Geometry;
    properties:any;
}

export class Geometry{
    type:string;
    coordinates:any;
}

export class CountryMatchesData{
    data:Array<CountryMatches>;
}

export class CountryMatches{
    id:number;
    name:string;
    country_id:number;
    league_name:string;
    total_matches:number;
}