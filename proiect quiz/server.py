from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

class MyServer(SimpleHTTPRequestHandler):
    # Această funcție permite browserului să trimită date (rezolvă CORS)
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    # Funcția pentru a CITI date (GET) - ex: verificăm dacă userul există
    def do_GET(self):
        if self.path == '/users.json':
            self._set_headers()
            with open('users.json', 'r') as f:
                self.wfile.write(f.read().encode())
        else:
            # Pentru orice alt fișier (html, css, poze), se comportă ca serverul standard
            super().do_GET()

    # Funcția pentru a SALVA date (POST) - ex: Register
    def do_POST(self):
        if self.path == '/register':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_user = json.loads(post_data)

            # Citim utilizatorii existenți
            users = []
            if os.path.exists('users.json'):
                with open('users.json', 'r') as f:
                    try:
                        users = json.load(f)
                    except json.JSONDecodeError:
                        users = []

            users.append(new_user)
            with open('users.json', 'w') as f:
                json.dump(users, f, indent=4)

            self._set_headers()
            self.wfile.write(json.dumps({"message": "User salvat!", "success": True}).encode())


port = 8000
server_address = ('', port)
httpd = HTTPServer(server_address, MyServer)
print(f"Serverul Python rulează la http://localhost:{port}")
httpd.serve_forever()