MATCH_STAT_QUERY = """select t.team_long_name as team_name,
count(m.id) as total_matches,
m.season,
m.home_team_api_id as home,
m.away_team_api_id as away,
SUM(m.home_team_goal) as total_home_team_goals,
SUM(m.away_team_goal) as total_away_team_goals,
SUM(CASE 
	WHEN (m.home_team_api_id = team_api_id and m.home_team_goal > m.away_team_goal and m.home_team_goal <> m.away_team_goal) OR 
		 (m.away_team_api_id = team_api_id and m.away_team_goal > m.home_team_goal and m.home_team_goal <> m.away_team_goal)
	THEN 1
	ELSE 0
	END) as win,
SUM(CASE 
	WHEN (m.home_team_api_id = team_api_id and m.home_team_goal < m.away_team_goal and m.home_team_goal <> m.away_team_goal) OR 
		 (m.away_team_api_id = team_api_id and m.away_team_goal < m.home_team_goal and m.home_team_goal <> m.away_team_goal)
	THEN 1
	ELSE 0
	END) as loss,
SUM(CASE WHEN m.home_team_goal = m.away_team_goal THEN 1 ELSE 0 END) as draw
from match m inner join team t
on t.team_api_id = m.home_team_api_id OR t.team_api_id = m.away_team_api_id
group by m.season,t.team_api_id
having t.team_api_id = """

GET_ALL_TEAMS_QUERY = """select id,team_api_id,team_fifa_api_id,
team_long_name , team_short_name from Team order by team_long_name asc"""


GET_TEAM_ATTRIBUTE ="""select 
 team_api_id , 
 strftime('%Y',date) as date, 
 buildUpPlaySpeed ,  
 buildUpPlayPassing , 
 chanceCreationPassing ,  
 chanceCreationCrossing ,  
 chanceCreationShooting ,   
 defencePressure , 
 defenceAggression , 
 defenceTeamWidth   
from Team_Attributes where team_api_id ="""

GET_COUNTRY_MATCHES  = """
select c.id ,c.name,l.country_id,l.name as league_name ,m.country_id, count(m.id) as total_matches from country c 
inner join League l on l.country_id = c.id
inner join Match m on m.country_id = c.id
group by c.name 
order by count(m.id) asc
"""