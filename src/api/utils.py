from flask import jsonify

class APIException(Exception):
    status_code = 400
    def __init__(self, message, status_code=None, payload=None):
        super().__init__(message)
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload or {}

    def to_dict(self):
        data = dict(self.payload)
        data["message"] = str(self)
        return data
