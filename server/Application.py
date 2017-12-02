import json
from flask import Flask, request
from flask_restful import Resource, Api
from sqlalchemy import create_engine
import os

db = os.path.join(os.path.dirname(__file__), 'soccer.db')

from MyQueries import MATCH_STAT_QUERY, GET_ALL_TEAMS_QUERY, GET_TEAM_ATTRIBUTE,GET_COUNTRY_MATCHES
from flask_cors import CORS
e = create_engine('sqlite:///{}'.format(db))

app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route('/')
def index():
	return 'Yo, it\'s working!'



class MatchMeta(Resource):
    def get(self, id):
        # Connect to databse
        conn = e.connect()
        # Perform query and return JSON data
        query = MATCH_STAT_QUERY
        query = conn.execute(query + str(id))
        return {'data': [dict(zip(tuple(query.keys()), i)) for i in query.cursor.fetchall()]}


class TeamsMeta(Resource):
    def get(self):
        conn = e.connect()
        # Perform query and return JSON data
        query = GET_ALL_TEAMS_QUERY
        query = conn.execute(query)
        return {'data': [dict(zip(tuple(query.keys()), i)) for i in query.cursor.fetchall()]}


class TeamAttributeMeta(Resource):
    def get(self, id, year):
        # Connect to database
        conn = e.connect()
        # Perform query and return JSON data
        query = GET_TEAM_ATTRIBUTE
        query = conn.execute(query + str(id) + ' AND date like \'%' + str(year) + '%\'')
        # self.fetchall =
        return {'data': [dict(zip(tuple(query.keys()), i)) for i in query.cursor.fetchall()]}


class GeoJSONMeta(Resource):
    def get(self):
        filename = 'europe.geo.json'
        with open(filename) as blog_file:
            data = json.load(blog_file)
        #print(data)
        return {'data':[data]}

class CountryMatchesMeta(Resource):
    def get(self):
        conn = e.connect()
        # Perform query and return JSON data
        query = GET_COUNTRY_MATCHES
        query = conn.execute(query)
        # self.fetchall =
        return {'data': [dict(zip(tuple(query.keys()), i)) for i in query.cursor.fetchall()]}


api.add_resource(MatchMeta, '/api/matches/<int:id>')
api.add_resource(TeamsMeta, '/api/teams/')
api.add_resource(TeamAttributeMeta, '/api/teams/attribute/<int:id>/<int:year>')
api.add_resource(GeoJSONMeta, '/api/geo/json/')
api.add_resource(CountryMatchesMeta, '/api/countries/matches/')

if __name__ == '__main__':
    app.run()
