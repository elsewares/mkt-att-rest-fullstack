from flask import Flask, request
from flask_restful import Resource, Api
from flask_pymongo import PyMongo

app = Flask(__name__)
api = Api(app)
mongo = PyMongo(app)

@app.route('/', methods=['GET'])
def get():
    return { 'status': 'Alive and kicking.'}


@app.route('/users/', methods=['GET'])
def get():
    users = mongo.db.users.find({'active': True})
    return users


# SCHEMA: user = {username: <string>}
@app.route('/user/<string:username>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def dispatch(username):
    if request.method == 'GET':
        return mongo.db.users.find_one_or_404({'username': username})
    elif request.method == 'POST':
        if not mongo.db.users.find_one({'username': username}): #check for an existing username.
            return mongo.db.repos.update({'username': username, $push: { 'name': request.data.repo_name }})
        else:
            return make_request('Repo name already taken.', 400)
    elif request.method == 'PUT':
        return mongo.db.users.update_one({'username': username}, request.data)
    elif request.method == 'DELETE':
        return mongo.db.users.delete_one({'username': username})


# SCHEMA: repo = {username: <string>, name: <string>}
@app.route('/repos/<string:username>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def dispatch(username):
    if request.method == 'GET':
        return mongo.db.repos.find_one_or_404({'username': username})
    elif request.method == 'POST':
        #check to make sure that the repo name is unique.
        if not mongo.db.repos.find_one({'username': username, 'name': { $in: [request.data.repo_name]}}):
            return mongo.db.repos.update({'username': username, $push: { 'name': request.data.repo_name }})
        else:
            return make_request('Repo name already taken.', 400)
    elif request.method == 'PUT':
        return mongo.db.repos.update_one({'username': username}, request.data)
    elif request.method == 'DELETE':
        return mongo.db.repos.delete_one({'username': username})

if __name__ == '__main__':
    app.run(debug=True)
