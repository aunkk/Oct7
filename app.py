from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='assets', static_url_path='/assets')


@app.route('/')
def index():
    return send_from_directory(app.root_path, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    if '.' in filename:
        return send_from_directory(app.static_folder, filename)
    return send_from_directory(app.root_path, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
