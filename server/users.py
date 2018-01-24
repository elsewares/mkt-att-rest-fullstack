from flask import Flask
from flask_restful import Resource, Api
from flask_pymongo import PyMongo

default_user = {'username': ''}

class User():
    def get(self):
        user = mongo