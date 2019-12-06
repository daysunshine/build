USERNAME = "search"
PASSWORD = "686831"
IP = "192.168.5.254"
PORT = "3308"
DATABASE = "system4search"
PARAMS = "charset=utf8mb4"

URL = "mysql+pymysql://{}:{}@{}:{}/{}?{}".format(USERNAME, PASSWORD, IP, PORT, DATABASE, PARAMS)

DATABASE_DEBUG = False