import webbrowser
from flask import Flask, render_template
app = Flask(__name__)
 
@app.route("/")
def index():
   return app.send_static_file("index.html")
 
if __name__ == '__main__':
   webbrowser.open("http://127.0.0.1:5678")
   app.run(port=5678)