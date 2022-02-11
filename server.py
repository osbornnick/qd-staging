import argparse
import cgi
import hashlib
import http.server
import json
import os
import random
import socket
import string
import ssl
import sys
import time
import urllib.parse


HOST_NAME = ''
DEFAULT_PORT = 3004

VALID_FILE_PATHS = ['/mturk_start.html', '/qd-tsp.html', '/qd-tsp.js']
LOG_PATH = '/log'


class Handler(http.server.BaseHTTPRequestHandler):
    CTYPE_PLAIN = 'text/plain'
    CTYPE_HTML = 'text/html'
    CTYPE_JS = 'text/javascript'
    CTYPE_CSS = 'text/css'
    CTYPE_PNG = 'image/png'
    CTYPE_JPEG = 'image/jpeg'

    GEN_ID = '{{GEN_ID}}'

    _block_random = []

    def _send_response(self, code, result, data):
        self.send_response(code)
        self.send_header('Content-type', Handler.CTYPE_PLAIN)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if data != None:
            result = {'result': True, 'data': data}
            self.wfile.write(json.dumps(result))

    def _send_success(self, data):
        self._send_response(200, True, data)

    def _send_error(self, code, data):
        self._send_response(code, False, data)

    def _send_data(self, data, binary):
        if not binary:
            data = data.encode('utf-8')

        # Python 3, until 3.6, may not write all the data to wfile in one call
        toWrite = len(data)
        writtenSoFar = 0
        while writtenSoFar < toWrite:
            writtenSoFar += self.wfile.write(data[writtenSoFar:])

    def _send_file_data(self, filename):
        if filename.endswith('.html'):
            ctype = Handler.CTYPE_HTML
            binary = False
        elif filename.endswith('.js'):
            ctype = Handler.CTYPE_JS
            binary = False
        elif filename.endswith('.css'):
            ctype = Handler.CTYPE_CSS
            binary = False
        elif filename.endswith('.png'):
            ctype = Handler.CTYPE_PNG
            binary = True
        elif filename.endswith('.jpg'):
            ctype = Handler.CTYPE_JPEG
            binary = True
        else:
            ctype = Handler.CTYPE_PLAIN
            binary = False

        if not os.path.exists(filename):
            self.send_response(404)
            self.send_header('Content-type', ctype)
            self.end_headers()

        else:
            data = self._file_contents(filename, binary)

            if data.find(Handler.GEN_ID):
                gen_id = self._make_id()
                data = data.replace(Handler.GEN_ID, gen_id)

            self.send_response(200)
            self.send_header('Content-type', ctype)
            self.end_headers()

            self._send_data(data, binary)

    def _file_contents(self, filename, binary):
        if binary:
            flags = 'rb'
        else:
            flags = 'rt'

        with open(filename, flags, encoding="utf8") as dfile:
            return dfile.read()

    def _check_keys(self, args, keys_req, keys_opt=[]):
        for key in keys_req:
            if not args.has_key(key):
                return 'Missing required key ' + key + '.'
        for key in args.iterkeys():
            if key not in keys_req and key not in keys_opt:
                return 'Unknown key ' + key + '.'
        return None

    def _make_id(self):
        text = ''.join(random.SystemRandom().choice(
            string.ascii_uppercase) for _ in range(9))

        if len(Handler._block_random) == 0:
            Handler._block_random = ['0', '1']
            random.SystemRandom().shuffle(Handler._block_random)
        text += Handler._block_random[0]
        Handler._block_random = Handler._block_random[1:]

        return text

    def _process_request(self, path, rvars):
        if path in VALID_FILE_PATHS:
            self._send_file_data(path[1:])

        elif path == LOG_PATH:
            if 'data' in rvars:
                data = json.loads(rvars['data'])
                data['_server_time'] = time.time()
                with open('log.txt', 'at') as lfile:
                    lfile.write(json.dumps(data) + '\n')

            self._send_success(None)

        else:
            self._send_error(404, None)

    def _extractvars(self, vars):
        newvars = {}
        for key, val in vars.items():
            usekey = key
            if type(usekey) != type(''):
                usekey = usekey.decode('utf-8')

            useval = val[0]
            if type(useval) != type(''):
                useval = useval.decode('utf-8')

            newvars[usekey] = useval

        return newvars

    def do_HEAD(self):
        parse = urllib.parse.urlparse(self.path)
        path = parse.path

        if path in VALID_FILE_PATHS + [LOG_PATH]:
            return self._send_success(None)
        else:
            return self._send_error(404, None)

    def do_GET(self):
        parse = urllib.parse.urlparse(self.path)
        path = parse.path

        # process GET arguments
        getvars = urllib.parse.parse_qs(parse.query)

        self._process_request(path, self._extractvars(getvars))

    def do_POST(self):
        parse = urllib.parse.urlparse(self.path)
        path = parse.path

        # process POST data into dict
        postvars = {}
        if 'content-type' in self.headers:
            content_type_header = self.headers['content-type']
            ctype, pdict = cgi.parse_header(content_type_header)
            if ctype == 'multipart/form-data':
                postvars = cgi.parse_multipart(self.rfile, pdict)
            elif ctype == 'application/x-www-form-urlencoded':
                if 'content-length' in self.headers:
                    length = int(self.headers['content-length'])
                else:
                    length = 0
                postvars = urllib.parse.parse_qs(
                    self.rfile.read(length), keep_blank_values=1)

        self._process_request(path, self._extractvars(postvars))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run server.')
    parser.add_argument('--port', type=int, help='Port to use. (default %d).' %
                        DEFAULT_PORT, default=DEFAULT_PORT)
    protocol_group = parser.add_mutually_exclusive_group(required=True)
    protocol_group.add_argument(
        '--http', action='store_true', help='Run with http.')
    protocol_group.add_argument('--https', type=str, nargs=2, metavar=('CRT', 'KEY'),
                                help='Run with https; specify path to crt file and key file.', default=None)
    args = parser.parse_args()

    socket.setdefaulttimeout(5.0)

    class HTTPServer(http.server.HTTPServer):
        _rnd = ''.join(random.choice(string.ascii_lowercase)
                       for i in range(10))

        def get_request(self):
            req = http.server.HTTPServer.get_request(self)
            # overwrites IP of address (but with hash for session)
            return req[0], (hashlib.sha1((HTTPServer._rnd + req[1][0]).encode('utf-8')).hexdigest(), req[1][1])

    httpd = HTTPServer((HOST_NAME, args.port), Handler)

    if args.https:
        protocol = 'https'

        certfile, keyfile = args.https
        httpd.socket = ssl.wrap_socket(httpd.socket,
                                       server_side=True,
                                       certfile=certfile,
                                       keyfile=keyfile,
                                       ssl_version=ssl.PROTOCOL_TLS)
    else:
        protocol = 'http'

    print('%s://localhost:%d' % (protocol, args.port))

    httpd.serve_forever()
    httpd.server_close()
