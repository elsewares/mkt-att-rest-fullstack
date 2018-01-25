from flask import Flask, request, jsonify, abort
import mongo_connection
from bson.json_util import dumps

app = Flask(__name__)
mongodb = mongo_connection.MongoConnection.init()


def json_it(object):
    return dumps(object) # because who wants 'DUMPS' all over their API?


@app.route('/users/')
def index():
    return json_it(mongodb.users.find())


@app.route('/user/<string:username>/', methods=['GET', 'POST', 'DELETE'])
def user_index(username):
    if not username:
        return json_it(mongodb.users.find())

    if request.method == 'GET':
        return json_it(mongodb.users.find_one({'username': username}))

    if request.method == 'POST':
        if not mongodb.users.find_one({'username': username}):  # Check for an existing username.
            new_user = mongodb.users.insert_one({'username': username, 'active': True})
            if new_user.inserted_id:
                return json_it(mongodb.users.find_one({'_id': new_user.inserted_id}))

        else:
            return abort(400, 'EXISTING_USER_NAME')  # Return an error if the name already exists.

    if request.method == 'DELETE':
        gone_user = mongodb.users.delete_one({'username': username})
        return json_it(gone_user.deleted_count == 1)


@app.route('/repositories/',  methods=['GET', 'POST', 'DELETE'])
def repo_index():
    if request.method == 'GET':
        return json_it(mongodb.user_repos.find_one({'username': request.args['username']}))

    if request.method == 'POST':
        if not mongodb.user_repos.find_one({'username': request.args['username']}):
            added_repo = mongodb.user_repos.insert_one({'username': request.args['username'],
                                                        'repositories': [request.args['repository']]})
            if added_repo.inserted_id:
                return json_it(mongodb.user_repos.find_one({'username': request.args['username']}))

        if not mongodb.user_repos.find_one({'username': request.args['username'], 'repositories': {'$in': [request.args['repository']]}}):
            updated_repo = mongodb.user_repos.update_one({'username': request.args['username']},
                                                         {'$push': {'repositories': request.args['repository']}})
            if updated_repo:
                return json_it(mongodb.user_repos.find_one({'username': request.args['username']}))
        else:
            return abort(400, 'EXISTING_REPO_NAME')

    if request.method == 'DELETE':
        gone_repo = mongodb.user_repos.update_one({'username': request.args['username']},
                                                  {'$pull': {'repositories': request.args['repository']}})
        if gone_repo.modified_count == 1:
            return json_it(mongodb.user_repos.find_one({'username': request.args['username']}))


if __name__ == '__main__':
    app.run(debug=True)
