from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import os
import datetime
import shortuuid

app = Flask(__name__)
# cors = CORS(app, resources={r"/*": {"origins": "*"}})
limiter = Limiter(app, key_func=get_remote_address)

# basedir = os.path.abspath(os.path.dirname(__file__))
basedir = '/var/data/neptune'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "neptune.sqlite")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["APPLICATION_ROOT"] = "/neptune"
db = SQLAlchemy(app)


class NeptuneComposition(db.Model):
    uuid = db.Column(db.String, primary_key="True", default=lambda: str(shortuuid.uuid()))
    data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<NeptuneComposition {self.created_at}>"


@app.route("/neptune/status", methods=["GET"])
def status():
    return 'OK', 200


# Save new composition
@app.route("/neptune/compositions", methods=["POST"])
@limiter.limit("10 per minute")
@cross_origin()
def post():
    try:
        json = request.get_json()
        composition = NeptuneComposition(data=json)
        db.session.add(composition)
        db.session.commit()
        app.logger.info("Created new composition with success")
        print(f"Created a composition with uuid {composition.uuid}")
        return jsonify({
            "uuid": composition.uuid
        }), 201
    except Exception as e:
        app.logger.error("Error saving composition to sqlite database: {}".format(e))
        return '', 500


# Retrieve specific composition
@app.route("/neptune/compositions/<string:uuid>", methods=["GET"])
@limiter.exempt
@cross_origin()
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
    app.run(debug=False, port=5000, host="0.0.0.0")
