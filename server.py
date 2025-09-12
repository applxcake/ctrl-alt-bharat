import http.server
import socketserver
import os

PORT = 8000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_GET(self):
        # Serve the file with the correct MIME type for .patt files
        if self.path.endswith('.patt'):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            with open('.' + self.path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"Serving at port {PORT}")
        print(f"Open http://localhost:{PORT} in your browser")
        httpd.serve_forever()
