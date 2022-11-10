from flask import Flask, jsonify, request
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
from flask.helpers import send_from_directory

import certifi
ca = certifi.where()

app = Flask(__name__, static_folder='461l-ltp/build', static_url_path='/')
CORS(app)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


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
    # print(decryptedPassword)
    if decryptedPassword != password:
        return password + ' is not the correct password'
    return signIn['username']

    
# This function queries the projectId and quantity from the URL and returns the
# project id and quantity to the front end. The front end displays a pop-up message
# which says “<qty> hardware checked in”
@app.route('/checkIn/<projectid>/<hwset>/<qty>/<userID>', methods=['GET','POST'])   #change this to 'PUT' and need to add {method: 'PUT'} to the fetch in hwset.js
def checkIn_hardware(projectid, hwset, qty, userID):

    hwSet = int(hwset)
    pj = projects.find_one({'projectID': projectid})
    currQty = pj['HWSet'][hwSet-1]
    qty = int(qty)
    maxQty = pj['HWSet'][2]

    user = users.find_one({'uid': userID})
    pjs = user['projects']
    if len(pjs) == 0:
        return "Must join project in order to checkin hardware"
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
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 - setsCheckedIn,userPjQty2]}})
        else:
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 - setsCheckedIn]}})
        #more are being checked in than space is avaliable
    else:
        newQty = currQty + qty
        setsCheckedIn = qty
        #projects.update_one({'projectID': projectid},{'$set': {'HWSet.'+str(hwSet-1): newQty}})
        if(hwSet == 1):
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 - setsCheckedIn,userPjQty2]}})
        else:
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 - setsCheckedIn]}})
        #normal

    allPjs = projects.find({})
    for proj in allPjs:
        # print("here once")
        projects.update_one({'projectID': proj["projectID"]},{'$set': {'HWSet.'+str(hwSet-1): newQty}})

    returnData = {
        "projectid": projectid,
        "hwset": hwset,
        "qty": newQty,
        "setsCheckedIn": setsCheckedIn}

    # print(returnData)
    return jsonify(returnData)


# This function queries the projectId and quantity from the URL and returns the
# project id and quantity to the front end. The front end displays a pop-up message
# which says “<qty> hardware checked out”
@app.route('/checkOut/<projectid>/<hwset>/<qty>/<userID>', methods=['GET','POST'])
def checkOut_hardware(projectid, hwset, qty, userID):
    hwSet = int(hwset)
    pj = projects.find_one({'projectID': projectid})
    currQty = pj['HWSet'][hwSet-1]
    qty = int(qty)
    # maxQty = int(maxQty)

    user = users.find_one({'uid': userID})
    pjs = user['projects']
    if len(pjs) == 0:
        return "Must join project in order to checkout hardware"
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
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 + setsCheckedOut,userPjQty2]}})
        else:
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 + setsCheckedOut]}})
    else:
        #this is when the user tries to check out more sets than what is avaliable
        newQty = 0
        setsCheckedOut = currQty
        if(hwSet == 1):
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 + setsCheckedOut,userPjQty2]}})
        else:
            users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [userPjQty1 ,userPjQty2 + setsCheckedOut]}})
        #throw a flag that a different amount was checked in than requested

    allPjs = projects.find({})
    for proj in allPjs:
        # print("here once")
        projects.update_one({'projectID': proj["projectID"]},{'$set': {'HWSet.'+str(hwSet-1): newQty}})


    returnData = {
        "projectid": projectid,
        "hwset": hwset,
        "qty": newQty,
        "setsCheckedOut": setsCheckedOut}

    return jsonify(returnData)


# This function queries the projectId from the URL and returns the project id to the
# front end. The front end displays a pop-up message which says “Joined <projectId>”
@app.route('/joinProject/<projectid>/<userID>', methods=['GET','POST'])
def joinProject(projectid, userID):
    user = users.find_one({'uid': userID})
    if len(user['projects']) == 1:
        return "Cannot join more than one project at a time"
    userList = projects.find_one({'projectID': projectid})['users']
    if userList == 'all' or userID in userList:
        users.update_one({'uid': userID},{'$set': {'projects.' + str(projectid): [0,0]}})
        return "Joined "+projectid
        # projects.update_one({'projectID': projectid},{'$push': {'users' :  userID}})
    # return "Joined " + projectid
    return "Cannot join "+projectid

# This function queries the projectId from the URL and returns the project id to the
# front end. The front end displays a pop-up message which says “Left <projectId>”
@app.route('/leaveProject/<projectid>/<userID>', methods=['GET','POST'])
def leaveProject(projectid, userID):
    user = users.find_one({'uid': userID})
    pjs = user['projects']
    thisPj = pjs[projectid]
    currQty1 = thisPj[0]
    currQty2 = thisPj[1]
    # print(currQty1)
    # print(currQty2)
    if (currQty1 == 0) & (currQty2 == 0):
        users.update_one({'uid': userID},{'$unset': {'projects.' + str(projectid) : ""}})
        # projects.update_one({'projectID': projectid},{'$pull': {'users' :  userID}})
        error = False
    else:
        #cannot leave a project if there is still checked out hardware
        error = True
    
    returnData = {
        "projectid": projectid,
        "error" : error
    }
    if error == False:
        return projectid
    else:
        return ""
    # return jsonify(returnData)
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
    request_data = request.get_json()
    # print(request_data.keys())
    # print(request_data['userList'])
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
        "creator": userid,
        "users": request_data['userList'],
        "description": request_data['description']
    }
    projects.insert_one(newProj)

    return "Created project " + projectid


@app.route('/getUsersProjects', methods=['GET'])
def getProjectsUsersHaveJoined():
    usersProjects = list(users.find({}, {'uid':1, 'projects':1}))
    # print(usersProjects)
    for i in usersProjects:
        del i['_id']
    return (usersProjects)


# TODO: finish this method
@app.route('/addUserToProject/<projectID>/<userID>', methods=['GET','POST'])
def addUsersToProject(projectID, userID):
    request_data = request.get_json()
    # request data should be an object with a field called userList which is an array of strings
    # accessed same way as in the createProject method

    # if the userid is the same as the project's creator, add all users to db
        # if there is a duplicate user, skip adding it
        # return "users added" or something
    # otherwise return userid+" does not have permission to add" or something
    if projectID == "DoNotDelete":
        return "Invalid Project ID"
    proj = projects.find_one({'projectID': projectID})
    if not proj:
            return projectID + " does not exist"
    if userID is proj['creator']:
        for i in request_data['userList']:
            if not (i in proj['users']):
                projects.update_one({'projectID': projectID},{'$push': {'users' :  i}})
        return "Users added"
    else: 
        return userID + " does not have permission to add users to this project"

    
if __name__ == "__main__":
    app.run()
