import BaseHTTPServer  
import urlparse
import os  
import unittest
from cucu import CucuVM
class WebRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):  
    def do_POST(self):
        #print(self.client_address)
        code = self.rfile.read(int(self.headers['content-length']))[2:]
        code = code.replace('+',' ')
        code = code.replace('%0A','\r\n')
        code = code.replace('%3B',';')
        code = code.replace('%2B','+')
        code = code.replace('%3D','=')
        code = code.replace('%7B','{')
        code = code.replace('%7D','}')
        print code
        c = CucuVM(code)
        parsed_path = urlparse.urlparse(self.path)  
        message_parts = [  
                'CLIENT VALUES:',  
                'client_address=%s (%s)' % (self.client_address,  
                                            self.address_string()),  
                'command=%s' % self.command,  
                'path=%s' % self.path,  
                'real path=%s' % parsed_path.path,  
                'query=%s' % parsed_path.query,  
                'request_version=%s' % self.request_version,  
                '',  
                'SERVER VALUES:',  
                'server_version=%s' % self.server_version,  
                'sys_version=%s' % self.sys_version,  
                'protocol_version=%s' % self.protocol_version,  
                '',  
                'HEADERS RECEIVED:',  
                ]  
        for name, value in sorted(self.headers.items()):  
            message_parts.append('%s=%s' % (name, value.rstrip()))  
        message_parts.append('')  
        message = '\r\n'.join(message_parts)  
        self.send_response(200)  
        self.end_headers()  
        self.wfile.write(c.code)
    def do_GET(self):
        parsed_path = urlparse.urlparse(self.path)
        print(self.path);
        pa = self.path;
    	self.send_response(200)  
        self.end_headers()
        #print pa;
        #print pa[0:2]
        #print pa[0:2] == "/ex"
        if(pa[0:17] == "/examples/scandir"):
            print("!!!!!!!!!!!!!!!!!");
            info = os.getcwd();
            arr = os.listdir(info+"\examples");
            #for i in arr:
             #   arr = arr + "|1\r\n";
            text = '["21-addition.txt|2.1 c = a + b\\r\\n","31-time-sharing-2-processes.txt|3.1 Time-sharing Between Two Processes\\r\\n","51-insertion-sort.txt|5.1 Insertion Sort\\r\\n","52-binary-search.txt|5.2 Binary Search\\r\\n","61-call-by-value.txt|6.1 Passing Parameters by Value\\r\\n","62-call-by-reference.txt|6.2 Passing Parameters by Reference\\r\\n"]';
            self.wfile.write(text);
            
              
        else:
            print(">>>>>>>>>>>>>>>>>");     
            input = open(self.path[1:],"r");
            self.wfile.write(input.read());
            input.close()
  
server = BaseHTTPServer.HTTPServer(('127.0.0.1',8080), WebRequestHandler)  
server.serve_forever() 