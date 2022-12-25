from flask import Flask, jsonify, request , render_template ,send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import random 
import os

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://kaikai5:kaikai5@cluster0.vwwknbu.mongodb.net/?retryWrites=true&w=majority")
db = client["mydatabase"]
users_collection = db["users"]

now_user = {}


def list_to_json(x):
    for i in range(len(x)):
        x[i]["_id"]=str(x[i]["_id"])

def one_to_json(x):
    x["_id"]=str(x["_id"])

def verify(email,token):
    if now_user.get(email, None) == token and token is not None:
        return "true"
    else :
        return "false"

@app.route('/token_verify', methods=['POST'])
def token_verify():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    return jsonify({"message": verify(email,token)})

@app.route('/have_user', methods=['POST'])
def have_user():
    data = request.get_json()
    email = data.get('email', None)
    user = users_collection.find_one({"email" : email})
    if user is None:
        response = jsonify({"message": "false"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        #return jsonify({"message": "false"})
    #one_to_json(user)
    response = jsonify({"message": "true"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    #return jsonify({"message": "true"})


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)
    user = users_collection.find_one({"email" : email})
    if user is None:
        new_user = {
            "email": email,
            "password": password
        }
        try:
            users_collection.insert_one(new_user)
            #login successful
            rd=str(random.random())
            now_user[email]=str(email)+rd
            print(now_user)
            return jsonify({"message": "successful" , "token":now_user[email]})
        except:
            return jsonify({"message": "error"})
    return jsonify({"message": "error"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)
    user = users_collection.find_one({"email" : email})
    if user is None:
        return jsonify({"message": "not user"})
    one_to_json(user)
    if password == user["password"] :
        print(now_user.get("test"))
        #判斷有無重複登入(no time to do)[background can use,but logic have bug]
        #if(now_user.get(email) is None):
        #    #login successful
        #    rd=str(random.random())
        #    now_user[email]=str(email)+rd
        #    print(now_user)
        #    return jsonify({"message": "successful" , "token":now_user[email]})
        #else:
        #    return jsonify({"message": "error"})
        rd=str(random.random())
        now_user[email]=str(email)+rd
        print(now_user)
        return jsonify({"message": "successful" , "token":now_user[email]})
    else :
        return jsonify({"message": "error"})
    
@app.route('/loginout', methods=['POST'])
def sign():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    if (now_user.get(email) == token) and (token is not None) :
        del now_user[email]
        return jsonify({"message": "successful"})
    return jsonify({"message": "error"})
    

@app.route('/have_lab', methods=['POST'])
def have_lab():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    name = data.get('name', None)
    if verify(email,token) == "true":
        now_collection = db[email]
        lab = now_collection.find_one({"name" : name})
        if lab is None:
            return jsonify({"message": "false"})
        else:
            return jsonify({"message": "true"}) 
    else :
        return jsonify({"message": "error"}) 

@app.route('/create_lab', methods=['POST'])
def create_lab():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    if verify(email,token) == "true":
        try:
            del data["email"]
            del data["token"]
            now_collection = db[email]
            now_collection.insert_one(data)
            return jsonify({"message": "true"}) 
        except:
            return jsonify({"message": "false"}) 
    else :
        return jsonify({"message": "false"})

@app.route('/lab_name', methods=['POST'])
def lab_name():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    if verify(email,token) == "true":
        now_collection = db[email]
        lab = list(now_collection.find({}))
        list_to_json(lab)
        return jsonify(lab) 
    else :
        return jsonify({"message": "error"}) 

@app.route('/get_lab', methods=['POST'])
def get_lab():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    name = data.get('name', None)
    if verify(email,token) == "true":
        now_collection = db[email]
        lab = now_collection.find_one({"name" : name})
        one_to_json(lab)
        return jsonify(lab) 
    else :
        return jsonify({"message": "error"}) 

@app.route('/fix_lab', methods=['POST'])
def fix():
    data = request.get_json()
    email = data.get('email', None)
    token = data.get('token', None)
    print(data)
    if verify(email,token) == "true":
        try:
            del data["email"]
            del data["token"]
            now_collection = db[email]
            now_collection.delete_one({"name": str(data["name"])})
            now_collection.insert_one(data)
            return jsonify({"message": "true"}) 
        except:
            return jsonify({"message": "false"}) 
    else :
        return jsonify({"message": "false"})


@app.route("/")
def web_index():
    return render_template("index.html")

@app.route("/sign")
def web_sign():
    return render_template("sign.html")

@app.route("/home")
def web_home():
    return render_template("home.html")

@app.route("/create_set")
def web_create_set():
    return render_template("create_set.html")

@app.route("/modify_set")
def web_modify_set():
    return render_template("modify_set.html")

@app.route("/set_index")
def web_set_index():
    return render_template("set_index.html")

@app.route("/flash_card")
def web_flash_card():
    return render_template("flash_card.html")

@app.route("/learn")
def web_learn():
    return render_template("learn.html")

@app.route("/quiz")
def web_quiz():
    return render_template("quiz.html")

@app.route("/match")
def web_match():
    return render_template("match.html")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico', mimetype='ststic/favicon.ico')

if __name__ == '__main__':
    #from waitress import serve
    #serve(app, host="0.0.0.0", port=8080)
    app.config['TEMPLATES_AUTO_RELOAD'] = True      
    app.jinja_env.auto_reload = True 
    app.run(host="0.0.0.0", port=8080)