from pymongo import MongoClient


class MongoConnection:

    def init():
        client = MongoClient('localhost', 27017)
        db = client['beh-api']
        return db

