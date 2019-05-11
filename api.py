from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

import os
import uuid
import datetime

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "dev.sqlite")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class NeptuneComposition(db.Model):
    uuid = db.Column(db.String, primary_key="True", default=lambda: str(uuid.uuid4()))
    data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<NeptuneComposition {self.created_at}>"


# Save new composition
@app.route("/compositions", methods=["POST"])
def post():
    data = request.form['data']
    try:
        db.session.add(NeptuneComposition(data=data))
        db.session.commit()
        app.logger.info("Created new composition with success")
        return '', 201
    except Exception as e:
        app.logger.error("Error saving composition to sqlite database: {}".format(e))
        return '', 500


# Retrieve specific composition
@app.route("/compositions/<string:uuid>", methods=["GET"])
def get(uuid):
    try:
        composition = NeptuneComposition.query.filter_by(uuid=uuid).first()
        if composition is None:
            return '', 404
        else:
            return jsonify({
                "uuid": composition.uuid,
                "created_at": composition.created_at,
                "data": composition.data
            })
    except Exception as e:
        app.logger.error("Error retrieving composition from database: {}".format(e))
        return '', 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
