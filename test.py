# from hashlib import new
# import userLogin
# import projects
# import inspect
# import pytest_check as check


# def test_userLogin():
#     # Method covers test cases 1, 2
#     # Add new user name to the database
#     newUserName = "test1"
#     X = userLogin.addUserToDatabase(newUserName, "password")
#     # Check if new user name is added successfully to the database
#     check.equal(X, True)
#     # Add existing user name to the database
#     existingUserName = "test1"
#     X = userLogin.addUserToDatabase(existingUserName, "password")
#     # Check if existing user name exists in database
#     check.equal(X, False)
#     # Send password to the database
#     password = "password"
#     X = userLogin.checkPassword(newUserName, password)
#     # check if correct password is decrypted correctly
#     check.equal(X, True)

#     newUserName = "test1"
#     password = "wrongPassword"
#     X = userLogin.checkPassword(newUserName, password)
#     check.equal(X, False)






# def test_createProject():
#     #projects.createProject("Userid", "projectName", "hw1id", "hw2id", hw1amount, hw2amount)
#     newProject = "Project1"
#     newUserName = "User1"
#     userLogin.addUserToDatabase(newUserName, "password")
#     projects.createProject(newUserName, newProject, 1, 2, 1, 1)
#     check.equal(X, True)

#     X = projects.createProject(newUserName, newProject, 1, 2, 1, 1)
#     check.equal(X, False)


# def test_checkoutHardware():
#     # Method covers test cases 7, 8, 10
#     projName = "Project1"
#     newUserName = "User1"
#     userLogin.addUserToDatabase(newUserName, "password")
#     hardwareNum = 1
#     hardwareAmount = 1

#     projects.createProject(newUserName, projName, 1, 2,
#                            hardwareAmount, hardwareAmount)

#     X = projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     check.equal(X, True)

#     X = projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     check.equal(X, False)

#     hardwareNum = 2
#     X = projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     check.equal(X, True)

#     X = projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     check.equal(X, False)


# def test_quantitiesChanged():
#     # Method covers test cases 9
#     projName = "Project1"
#     newUserName = "User1"
#     userLogin.addUserToDatabase(newUserName, "password")
#     hardwareNum = 1
#     hardwareAmount = 1
#     projects.createProject(newUserName, projName, 1, 2,
#                            hardwareAmount, hardwareAmount)

#     X = projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     amount = projects.getHarwareAmt(projName, hardwareNum)
#     check.equal(0, amount)


# def test_checkinOneUnit():
#     # Method covers test case 11, 12, 19
#     projName = "Project1"
#     newUserName = "User1"
#     userLogin.addUserToDatabase(newUserName, "password")
#     hardwareNum = 1
#     hardwareAmount = 1
#     projects.createProject(newUserName, projName, 1, 2,
#                            hardwareAmount, hardwareAmount)

#     X = projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     amount = projects.getHarwareAmt(projName, hardwareNum)
#     check.equal(0, amount)

#     projects.checkinHardware(newUserName, projName,
#                              hardwareNum, hardwareAmount)
#     amount = projects.getHarwareAmt(projName, hardwareNum)
#     check.equal(1, amount)


# def test_joinProject():
#     # Method covers test case 17
#     projName = "Project1"
#     newUserName = "User1"
#     userLogin.addUserToDatabase(newUserName, "password")
#     userLogin.addUserToDatabase("User2", "password")
#     userLogin.addUserToDatabase("User3", "password")

#     projects.createProject(newUserName, projName, 1, 2, 1, 1)
#     projects.addAuthUser(projName, "User2")

#     X = projects.joinProject(projName, "User2")
#     check.equal(True, X)

#     X = projects.joinProject(projName, "User3")
#     check.equal(False, X)


# def test_checkin_hardwareTwo():
#     # Method covers test case 18, 19
#     projName = "Project1"
#     newUserName = "User1"
#     userLogin.addUserToDatabase(newUserName, "password")
#     userLogin.addUserToDatabase("User2", "password")
#     hardwareNum = 1
#     hardwareAmount = 1

#     projects.createProject(newUserName, projName, 1, 2, 1, 1)
#     projects.addAuthUser(projName, "User2")

#     projects.checkoutHardware(
#         newUserName, projName, hardwareNum, hardwareAmount)
#     amount = projects.getHarwareAmt(projName, hardwareNum)
#     check.equal(0, amount)

#     X = projects.checkinHardware("User2", projName,
#                              hardwareNum, hardwareAmount)
#     amount = projects.getHarwareAmt(projName, hardwareNum)
#     check.equal(0, amount) #Tests that amount didn't change from illegal checkin
#     check.equal(X, False)   


