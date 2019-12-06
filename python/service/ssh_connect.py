import paramiko

class SSH(object):
	# private_key = paramiko.RSAKey.from_private_key_file('D:/id_rsa252.txt')
	def conn(self,host, user, passwd,port='22'):
		self.ssh = paramiko.SSHClient()
		self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
		try:
			self.ssh.connect(host,port,user,passwd)
		except Exception as e:
			print ('Exception:', e)

	def Execmd(self,exe_cmd):
		stdin, stdout, stderr = self.ssh.exec_command(exe_cmd)#, get_pty = True
		return stdout

	def close(self):
		self.ssh.close()

	def line_buffered(self,f):
		line_buf = ""
		status = 'success'
		while not f.channel.exit_status_ready():
			line_buf += f.read(1).decode()
			if line_buf.endswith('\n'):
				yield line_buf
				line_buf = ''

	def uploadfile(self,hostname, username, password,port='10911'):
		self.upload = paramiko.Transport((hostname, port))
		self.upload.connect(username=username, password=password)
		sftp = paramiko.SFTPClient.from_transport(self.upload)
		# 这里的os.path.join 只是个人需要 可以直接sftp.put(local_file_path, remote_file_path)
		sftp.put(os.path.join('/home/update', 'a.txt'), os.path.join('/home/update', 'a.txt'))
		self.upload.close()