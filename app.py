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
from encryption import customEncrypt

import certifi
ca = certifi.where()


app = Flask(__name__, static_folder='./build', static_url_path='/')

# app = Flask(__name__)

# Members API route
@app.route('/')
def index():
    return app.send_static_file('index.html')  
# jbG1kDkSwwyZVssJ


client = MongoClient('mongodb+srv://gwills:jbG1kDkSwwyZVssJ@cluster0.kdtylku.mongodb.net/test?retryWrites=true&w=majority', tlsCAFile = ca)
userDB = client['userInfo']
users = userDB['random']
projectDB = client['projects']
projects = projectDB['data']

@app.route("/new/<username>/<password>/<uid>",methods=['GET','POST'])    #need to add {method: 'POST'} to the fetch in signup.js
def newUser(username, password, uid):
    if users.find_one({'uid': uid}):
        return username + " is already a user"
    encryptedPassword = customEncrypt(password, 7, 1)
    # decrypt = customEncrypt(encryptedPassword, 7, -1)
    userData = {
        'username' : username,
        'password' : encryptedPassword,
        'uid' : uid,
        'projects' : {}
    }
    users.insert_one(userData)
    return 'done'
    

@app.route("/confirm/<uid>/<password>", methods=['GET'])
def confirm(uid, password):
    signIn = users.find_one({'uid' : uid})
    if not signIn:
        return uid + " is not a user for the website"
    decryptedPassword = customEncrypt(signIn['password'], 7, -1)
    print(decryptedPassword)
    if decryptedPassword != password:
        return password + ' is not the correct password'
    return uid + " is a user for the website"

    
# This function queries the projectId and quantity from the URL and returns the
# project id and quantity to the front end. The front end displays a pop-up message
# which says “<qty> hardware checked in”
@app.route('/checkIn/<projectid>/<hwset>/<qty>/<maxQty>', methods=['GET','POST'])   #change this to 'PUT' and need to add {method: 'PUT'} to the fetch in hwset.js
def checkIn_hardware(projectid, hwset, qty, maxQty):

    hwSet = int(hwset)
    pj = projects.find_one({'projectID': projectid})
    currQty = pj['HWSet'][hwSet-1]
    qty = int(qty)
    maxQty = int(maxQty)

    user = users.find_one({'username': 'user1'})
    pjs = user['projects']
    thisPj = pjs[projectid]
    userPjQty1 = thisPj[0]
    userPjQty2 = thisPj[1]

    if(hwSet == 1):
        if qty > userPjQty1:
            qty = userPjQty1
    else:
        if qty > userPjQty2:
            qty = userPjQty2
    
    if currQty == maxQty:
        #already full
        newQty = maxQty
        setsCheckedIn = 0
        #none can be checked in
    elif (currQty + qty) > maxQty:
        #don't update
        newQty = maxQty
        #projects.update_one({'projectID': projectid},{'$set': {'HWSet.'+str(hwSet-1): maxQty}})
        setsCheckedIn = maxQty - currQty
        if(hwSet == 1):
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 - setsCheckedIn,userPjQty2]}})
        else:
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 - setsCheckedIn]}})
        #more are being checked in than space is avaliable
    else:
        newQty = currQty + qty
        setsCheckedIn = qty
        #projects.update_one({'projectID': projectid},{'$set': {'HWSet.'+str(hwSet-1): newQty}})
        if(hwSet == 1):
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 - setsCheckedIn,userPjQty2]}})
        else:
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 - setsCheckedIn]}})
        #normal

    allPjs = projects.find({})
    for proj in allPjs:
        print("here once")
        projects.update_one({'projectID': proj["projectID"]},{'$set': {'HWSet.'+str(hwSet-1): newQty}})

    returnData = {
        "projectid": projectid,
        "hwset": hwset,
        "qty": newQty,
        "maxQty" : maxQty,
        "setsCheckedIn": setsCheckedIn}

    print(returnData)
    return jsonify(returnData)


# This function queries the projectId and quantity from the URL and returns the
# project id and quantity to the front end. The front end displays a pop-up message
# which says “<qty> hardware checked out”
@app.route('/checkOut/<projectid>/<hwset>/<qty>/<maxQty>', methods=['GET','POST'])
def checkOut_hardware(projectid, hwset, qty, maxQty):
    hwSet = int(hwset)
    pj = projects.find_one({'projectID': projectid})
    currQty = pj['HWSet'][hwSet-1]
    qty = int(qty)
    maxQty = int(maxQty)

    user = users.find_one({'username': 'user1'})
    pjs = user['projects']
    thisPj = pjs[projectid]
    userPjQty1 = thisPj[0]
    userPjQty2 = thisPj[1]
    
    if currQty == 0:
        #there are zero sets when the user tries to check out sets
        newQty = 0
        setsCheckedOut = 0
        #send an error that no units are avaliable
    elif currQty - qty >= 0:
        #there is adequate sets that are trying to be checked out
        newQty = currQty - qty
        setsCheckedOut = qty
        if(hwSet == 1):
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 + setsCheckedOut,userPjQty2]}})
        else:
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 + setsCheckedOut]}})
    else:
        #this is when the user tries to check out more sets than what is avaliable
        newQty = 0
        setsCheckedOut = currQty
        if(hwSet == 1):
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 + setsCheckedOut,userPjQty2]}})
        else:
            users.update_one({'username': 'user1'},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 + setsCheckedOut]}})
        #throw a flag that a different amount was checked in than requested

    allPjs = projects.find({})
    for proj in allPjs:
        print("here once")
        projects.update_one({'projectID': proj["projectID"]},{'$set': {'HWSet.'+str(hwSet-1): newQty}})


    returnData = {
        "projectid": projectid,
        "hwset": hwset,
        "qty": newQty,
        "maxQty": maxQty,
        "setsCheckedOut": setsCheckedOut}

    return jsonify(returnData)


# This function queries the projectId from the URL and returns the project id to the
# front end. The front end displays a pop-up message which says “Joined <projectId>”
@app.route('/joinProject/<projectid>/<userID>', methods=['GET','POST'])
def joinProject(projectid, userID):
    users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [0,0]}})
    projects.update_one({'projectID': projectid},{'$push': {'users' :  userID}})
    # return "Joined " + projectid
    return projectid

# This function queries the projectId from the URL and returns the project id to the
# front end. The front end displays a pop-up message which says “Left <projectId>”
@app.route('/leaveProject/<projectid>/<userID>', methods=['GET','POST'])
def leaveProject(projectid, userID):
    user = users.find_one({'uid': userID})
    pjs = user['projects']
    thisPj = pjs[projectid]
    currQty1 = thisPj[0]
    currQty2 = thisPj[1]
    if (currQty1 == 0) & (currQty2 == 0):
        users.update_one({'uid': userID},{'$unset': {'projects.' + str(projectid) : ""}})
        projects.update_one({'projectID': projectid},{'$pull': {'users' :  userID}})
        error = False
    else:
        #cannot leave a project if there is still checked out hardware
        error = True
    
    returnData = {
        "projectid": projectid,
        "error" : error
    }
    return jsonify(returnData)
    #return projectid

@app.route('/allprojects', methods=['GET'])
def getAllProjects():
    allpjs = list(projects.find({}))
    for i in allpjs:
        del i['_id']

    return jsonify(allpjs)


# this method creates a new project based on input project id and user id passed into the url
# redundant projects cannot be created
@app.route('/createProject/<projectid>/<userid>', methods=['GET','POST'])
def createProject(projectid, userid):
    # DoNotDelete is our default project that has initialized hardware set amounts
    # this project should always exist in the database so new projects can use it as reference to pull initial data
    if projectid == 'DoNotDelete':
        return "Invalid project id"
    if projects.find_one({'projectID': projectid}):
        return projectid + " already exists"
    pj = projects.find_one({'projectID': 'DoNotDelete'})
    newProj = {
        "projectID": projectid,
        "HWSet": [pj['HWSet'][0], pj['HWSet'][1], pj['HWSet'][2], pj['HWSet'][3]],
        "users": [userid]
    }
    projects.insert_one(newProj)

    return "Created project " + projectid

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# do we need an api to delete projects?

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
    # app.run(debug=True)
