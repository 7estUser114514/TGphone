import os
import webbrowser
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route("/")
def index():
   return app.send_static_file("index.html")

@app.route("/upload", methods=['POST'])
def upload():
   if 'file' not in request.files:
        return jsonify({'code': 1})

   file = request.files['file']

   if file.filename == '':
      return jsonify({'code': 1})

   file.save(os.path.join('upload', 'phones.txt'))
   return jsonify({'code': 0})
 
if __name__ == '__main__':
   webbrowser.open("http://127.0.0.1:5678")
   app.run(port=5678)