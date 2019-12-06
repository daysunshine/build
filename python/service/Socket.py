# import socketserver
# import socket
#
# class MyHandler(socketserver.BaseRequestHandler):
#
#     def handle(self):
#         while True:
#             data = self.request.recv(1024)
#             if len(data) == 0:break
#             print(data.decode())
#             # self.request.send('recv'.encode())
#
#         self.request.close()
#
#
#
# #注册启动
# server = socketserver.ThreadingTCPServer(("127.0.0.1",9999),MyHandler)
# # server = socketserver.StreamRequestHandler(("127.0.0.1",9999),MyHandler)
# server.serve_forever()
#
# 关闭
# # server.shutdown()
# # server.server_close()
#
#
# # Sock = socket.socket()
# # ip = '127.0.0.1'
# # port = 9999
# # addr = (ip,port)
# # Sock.bind(addr)
# # Sock.listen()
# #
# # conn,addrinfo = Sock.accept()
# #
# # print(conn)
# # while True:
# #     data = conn.recv(1024)
# #     if data.decode() == 'quit':
# #         break
# #     print(data.decode())
# #
# #     msg = 'ack {}'.format(data.decode())
# #     conn.send(msg.encode())
# #
# # conn.close()
# # Sock.close()

#
# def handellog(data):
#     print(data.get('ctr_id'))

























