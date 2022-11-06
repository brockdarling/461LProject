If you made changes to the project and want to update the heroku website:


after FRONTEND changes:
    1) do 'npm run build' in react directory ("461l-ltp")


    2) if changes were made while localhost testing:
            - make sure '/build' is commented out in '.gitignore' file
            - try to add/commit/push to 'main' branch ONLY the build folder and the files you changed/added

        if changes were made directly in heroku-working files instead:
            - you can add/commit/push everything to 'main' branch (if that's easier)


    3) changes should automatically deploy to heroku (https://lookintopass461lproject.herokuapp.com/) after 'main' branch is updated
        it might take 1-2 minutes for you to see the changes



after BACKEND changes:

    (working within a vitualenv helps out for step 2)

    1) if changes were made while localhost testing:
            - update heroku folder with file changes
            - comment out 'app = Flask(__name__)'
            - make sure these lines are in app.py for heroku deploy to work:

             *   from flask.helpers import send_from_directory
             *
             *   app = Flask(__name__, static_folder='461l-ltp/build', static_url_path='/')
             *   CORS(app)
             *
             *   @app.route('/')
             *   def serve():
             *       return send_from_directory(app.static_folder, 'index.html')
             *
             *   if __name__ == "__main__":
             *       app.run()

        if changes were made directly in heroku-working files instead:
            - move onto step 2


    2) if new imports/dependencies were added to app.py or any .py file:
            - run 'pip freeze > requirements.txt'
            - 'requirements.txt' should now look something like 'reqTemplate.txt' but with your added modules

            - if you were not working within a venv and installed dependencies in your local files for app.py to work,
               you might populate 'requirements.txt' with a whole bunch of new modules, which might cause heroku deploy to NOT work.
               So make sure 'requirements.txt' doesn't look drastically different than 'reqTemplate.txt'

    3) if changes were made while localhost testing:
            - try to add/commit/push to 'main' branch ONLY the files you changed/added
        
        if changes were made directly in heroku-working files instead:
            - you can add/commit/push everything to 'main' branch (if that's easier)

    
    4) changes should automatically deploy to heroku (https://lookintopass461lproject.herokuapp.com/) after 'main' branch is updated
        it might take 1-2 minutes for you to see the changes

