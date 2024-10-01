from flask import request, jsonify
from config import app, db
from models import Account
from cryptography.fernet import Fernet

'''
def write_key():
    key = Fernet.generate_key()
    with open("key.key","wb") as key_file:
        key_file.write(key)'''

def load_key():
    return open("key.key", "rb").read()

key = load_key()
f = Fernet(key)

@app.route("/accounts", methods = ["GET"])
def get_Accounts():
    accounts = Account.query.all()
    json_accounts = list(map(lambda x: x.to_json(), accounts))
    for accs in json_accounts:
        accs["password"] = f.decrypt(accs["password"].encode()).decode()
    return jsonify({"accounts": json_accounts})

@app.route("/save_account", methods = ["POST"])
def save_account():
    platform = request.json.get("platform")
    account = request.json.get("account")
    password = request.json.get("password")
    encrypted_password = f.encrypt(password.encode()).decode()

    if not platform or not account or not password:
        return jsonify({"message": "You must specify a platform, account, and password"}), 400

    new_account = Account(platform = platform, account = account, password = encrypted_password)
    try:
        db.session.add(new_account)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    return jsonify({"message": "User created"}), 201

@app.route("/update_account/<int:acc_id>", methods = ["PATCH"])
def update_account(acc_id):
    account = Account.query.get(acc_id)

    if not account:
        return jsonify({"message": "User not found"}), 404

    account.platform = request.json.get("platform", account.platform)
    account.account = request.json.get("account", account.account)
    account.password = request.json.get("password", account.password)

    db.session.commit()

    return jsonify({"message": "User updated."}), 200

@app.route("/delete_account/<int:acc_id>", methods = ["DELETE"])
def delete_account(acc_id):
    account = Account.query.get(acc_id)

    if not account:
        return jsonify({"message": "User not found"}), 404
    
    db.session.delete(account)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(debug = True)