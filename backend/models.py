from config import db

class Account(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    platform = db.Column(db.String(80), unique = False, nullable = False)
    account = db.Column(db.String(100), unique = True, nullable = False)
    password = db.Column(db.String(80), unique = False, nullable = False)

    def to_json(self):
        return {
            "id": self.id,
            "platform": self.platform,
            "account": self.account,
            "password": self.password
        }