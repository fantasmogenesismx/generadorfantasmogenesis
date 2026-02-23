#!/usr/bin/env python3
"""
Servidor HTTP simple para el Generador de Fantasmas
Sirve la versión optimizada en el puerto 8080
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Agregar headers CORS para desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def do_GET(self):
        # Redirigir raíz a index-optimized.html
        if self.path == '/' or self.path == '':
            self.path = '/index-optimized.html'
        return super().do_GET()

def main():
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Servidor iniciado en http://localhost:{PORT}")
        print(f"📁 Sirviendo archivos desde: {DIRECTORY}")
        print(f"🎨 Versión optimizada: http://localhost:{PORT}/index-optimized.html")
        print(f"📄 Versión original: http://localhost:{PORT}/index.html")
        print("\n✨ Presiona Ctrl+C para detener el servidor\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Servidor detenido")
            sys.exit(0)

if __name__ == "__main__":
    main()
