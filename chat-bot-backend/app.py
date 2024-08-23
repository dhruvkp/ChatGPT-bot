import json

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import cross_origin, CORS
from flask_restful import Api, Resource, reqparse
from utility import collect_messages

app = Flask(__name__, static_url_path='', static_folder='../frontend/build')
CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

system_context = '''
    You are a helpful assistant for customers of a used cars buying and selling company. You help users \
    with their questions and requests about the cars they want to sell or buy to the company. You will \
    help with any car related question that users have including but not limited to car value estimation, \
    car buying or selling process, documentation and regulatory requirements. Additionally, you also help \
    users with questions about contacting or locating company offices.
'''

class ChatHandler(Resource):
    def __init__(self, **kwargs):
        self.context = [{"role": "system",
                        "content": system_context}]

    def get(self):
        response = jsonify(context=self.context)
        response.headers.add("Access-Control-Allow-Origin", "*")
        
        return response

    # @cross_origin()
    def post(self):
        rqs = request.json
        prompt = rqs.get('prompt')
        context = rqs.get('context')

        response = jsonify(collect_messages(prompt, context))
        return response


api.add_resource(ChatHandler, '/')

if __name__ == '__main__':
    app.run(debug=True)