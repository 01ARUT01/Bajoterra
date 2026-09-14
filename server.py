from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os


class BajoTerraHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)


if __name__ == "__main__":
    port = 8000
    print(f"Servidor de Bajo Terra en http://localhost:{port}")
    server = ThreadingHTTPServer(("127.0.0.1", port), BajoTerraHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()
