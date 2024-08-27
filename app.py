import os
import sqlite3
from py.check import check_tg
import webbrowser
from flask import Flask, request, jsonify

def initial():
   conn = sqlite3.connect('history.db')
   c = conn.cursor()

   # 创建名为 history 的表
   c.execute('''CREATE TABLE IF NOT EXISTS history
             (phone TEXT, status TEXT)''')
   conn.commit()
   conn.close()


def add_history(data):
   conn = sqlite3.connect('history.db')
   c = conn.cursor()
   c.executemany('INSERT INTO history VALUES (?, ?)', data)
   conn.commit()
   conn.close()

app = Flask(__name__)

@app.route("/")
def index():
   return app.send_static_file("index.html")

@app.route("/checkPhone", methods=['POST'])
def check_phone():
   res_text = '已注册'
   phone = request.form.get('phone')
   api_id = request.form.get('api_id')
   api_hash = request.form.get('api_hash')
   proxy = request.form.get('proxy')
   res = check_tg(phone, api_id, api_hash)
   if res != 0:
      res_text = '未注册'
   data = [(str(phone), res_text)]
   add_history(data)
   return jsonify({'code': 0, 'status': res})


@app.route("/upload", methods=['POST'])
def upload():
   if 'file' not in request.files:
        return jsonify({'code': 1})

   file = request.files['file']

   if file.filename == '':
      return jsonify({'code': 1})

   file.save(os.path.join('upload', 'phones.txt'))
   return jsonify({'code': 0})

@app.route("/showHistory")
def show_history():
   conn = sqlite3.connect('history.db')
   c = conn.cursor()

   c.execute('SELECT * FROM history')
   rows = c.fetchall()

   history = []
   for row in rows:
      history.append({'phone': row[0], 'status': row[1]})

   conn.close()

   return jsonify({'code': 0, 'ret': history})


if __name__ == '__main__':
   initial()
   webbrowser.open("http://127.0.0.1:5678")
   app.run(port=5678)