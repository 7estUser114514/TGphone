import sqlite3
import webbrowser
import pandas as pd
from py.check import check_tg
from flask import Flask, request, jsonify, send_file


def initial():
   conn = sqlite3.connect('history.db')
   c = conn.cursor()

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
   ret_text = '已注册'
   phone = request.form.get('phone')
   api_id = request.form.get('api_id')
   api_hash = request.form.get('api_hash')
   proxy = request.form.get('proxy')
   ret = check_tg(phone, api_id, api_hash)
   if ret != 0:
      ret_text = '未注册'
   data = [(str(phone), ret_text)]
   add_history(data)
   return jsonify({'code': 0, 'ret': {'phone': phone, 'status': ret}})


@app.route("/upload", methods=['POST'])
def upload():
   if 'file' not in request.files:
        return jsonify({'code': 1})
   api_id = request.form.get('api_id')
   api_hash = request.form.get('api_hash')
   proxy = request.form.get('proxy')

   file = request.files['file']

   lines = [ line.decode('utf-8').strip("\n").strip("\r") for line in file.stream.readlines()]
   data = []
   ret = []
   for line in lines:
      status = check_tg(line, api_id, api_hash)
      status_text = "已注册"
      if status != 0:
         status_text = '未注册'
      data.append((line, status_text))
      ret.append({'phone': line, 'status': status_text})
   add_history(data)

   return jsonify({'code': 0, 'ret': ret})


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


@app.route("/clearHistory")
def clear_history():
   conn = sqlite3.connect('history.db')
   cursor = conn.cursor()

   cursor.execute('DELETE FROM history')

   conn.commit()
   conn.close()
   return jsonify({'code': 0})


@app.route("/saveHistory")
def save_history():
   return send_file("history.db", as_attachment=True)

@app.route("/downloadExcel")
def download_excel():
   conn = sqlite3.connect('history.db')

   query = "SELECT * FROM history"
   df = pd.read_sql_query(query, conn)

   df.to_excel('history.xlsx', index=False)

   conn.close()
   return send_file("history.xlsx", as_attachment=True)


if __name__ == '__main__':
   initial()
   webbrowser.open("http://127.0.0.1:5678")
   app.run(port=5678)