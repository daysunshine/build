USERNAME = "root"
PASSWORD = "12345678"
IP = "192.168.5.254"
PORT = "3308"
DATABASE = "test"
PARAMS = "charset=utf8mb4"

URL = "mysql+pymysql://{}:{}@{}:{}/{}?{}".format(USERNAME, PASSWORD, IP, PORT, DATABASE, PARAMS)

DATABASE_DEBUG = False