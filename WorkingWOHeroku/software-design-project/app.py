from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse
from sqlalchemy import event
from werkzeug.security import check_password_hash, generate_password_hash
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask import request
import os
from pymongo import MongoClient


# app = Flask(__name__, static_folder='./build', static_url_path='/')



app = Flask(__name__)

# if __name__ == "__main__":
#     app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))


# Members API route
# @app.route('/')
# def index():
#     return app.send_static_file('index.html')  
# jbG1kDkSwwyZVssJ


client = MongoClient('mongodb+srv://gwills:jbG1kDkSwwyZVssJ@cluster0.kdtylku.mongodb.net/test?retryWrites=true&w=majority')
userDB = client['userInfo']
users = userDB['random']
projectDB = client['projects']
projects = projectDB['data']

@app.route("/new/<username>/<password>/<uid>", methods=["GET"])
def newUser(username, password, uid):
    
    if users.find_one({'username': username}):
        return username + " is already a user"
    userData = {
        'username' : username,
        'password' : password,
        'uid' : uid,
        'projects' : {}
    }
    users.insert_one(userData)
    return 'done'
    

@app.route("/confirm/<username>/<password>", methods=["GET"])
def confirm(username, password):
    signIn = users.find_one({'username' : username})
    if not signIn:
        return username + " is not a user for the website"
    if signIn['password'] != password:
        return password + ' is not the correct password'
    return username + " is a user for the website"


@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member4"]}

    
# This function queries the projectId and quantity from the URL and returns the
# project id and quantity to the front end. The front end displays a pop-up message
# which says “<qty> hardware checked in”
@app.route('/checkIn/<projectid>/<hwset>/<qty>', methods=['GET'])
def checkIn_hardware(projectid, hwset, qty):
    qty = int(qty)
    pj = projects.find_one({'projectID': projectid})
    currQty = pj["HWSet"][hwset-1]
    print(currQty)
    projects.update({'projectID': projectid},{'$set': {'HWSet.' + str(hwset-1) + '.content': qty}})
    return{
        "projectid": projectid,
        "hwset": hwset,
        "qty": qty
        }

# This function queries the projectId and quantity from the URL and returns the
# project id and quantity to the front end. The front end displays a pop-up message
# which says “<qty> hardware checked out”
@app.route('/checkOut/<projectid>/<hwset>/<qty>', methods=['POST'])
def checkOut_hardware(projectid, hwset, qty):
    qty = int(qty)
    pj = projects.find_one({'projectID': projectid})
    currQty = pj["HWSet"][hwset-1]
    print(currQty)
    projects.update({'projectID': projectid},{'$set': {'HWSet.' + str(hwset-1) + '.content': currQty - qty}})
    return{
        "projectid": projectid,
        "hwset": hwset,
        "qty": qty}

# This function queries the projectId from the URL and returns the project id to the
# front end. The front end displays a pop-up message which says “Joined <projectId>”
@app.route('/joinProject/<projectid>', methods=['GET'])
def joinProject(projectid):
    # return "Joined " + projectid
    return projectid

# This function queries the projectId from the URL and returns the project id to the
# front end. The front end displays a pop-up message which says “Left <projectId>”
@app.route('/leaveProject/<projectid>', methods=['GET'])
def leaveProject(projectid):
    return projectid


if __name__ == "__main__":
    app.run(debug=True)
