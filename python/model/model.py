from sqlalchemy import Column, Integer, BigInteger, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base #生成一个基类
from sqlalchemy.dialects.mysql import TINYINT
from . import config

from sqlalchemy import create_engine

#model
#创建一个基类
Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer,primary_key=True,nullable=False, autoincrement=True)
    name = Column(String(48),nullable=False,unique=True)
    password = Column(String(128),nullable=False)
    spwd = Column(String(255),nullable=False)

    def __repr__(self):
        return "<User id={}, name={},pwd={}>".format(self.id,self.name,self.password)

class Post(Base):
    __tablename__ = 'post'
    id = Column(Integer,primary_key=True,nullable=False,autoincrement=True)
    svn_url = Column(String(128),nullable=False)
    project_name = Column(String(10),nullable=False)
    container_name = Column(String(50),nullable=False)
    container_id = Column(String(20),nullable=False)
    author_id = Column(Integer,ForeignKey('user.id'),nullable=False)
    state = Column(TINYINT, nullable=False, default=0, comment="0 stop;1 start")
    port = Column(String(4), nullable=False, comment="端口范围8000-9000")
#     # hits = Column(BigInteger,nullable=True,default=0)
#
#     author = relationship('User') #与对应的类产生关系
#     # content = relationship('Content', uselist=False)  #一对一的关系，得将uselist=False不需要这个uselist
#
    def __repr__(self):
        return "<Post id={}, project_name={}, container_id={}, author_id={}>".format(self.id,self.project_name,self.container_id,self.author_id)

class Url(Base):
    __tablename__ = "url"
    id = Column(Integer,primary_key=True,nullable=False,autoincrement=True)
    aliasname = Column(String(20),nullable=False)
    name = Column(String(20),nullable=False)
    uid = Column(String(8),nullable=False)
    path = Column(String(128),nullable=False)

    def __repr__(self):
        return "<Url id={}, path={}>".format(self.id,self.path)

class R_User_Url(Base):
    __tablename__ = "r_user_url"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = Column(Integer,nullable=False)
    url_id = Column(Integer, nullable=False)

    def __repr__(self):
        return "<R_User_Url id={}, user_id={},url_id={}>".format(self.id,self.user_id,self.url_id)

class T_sys_name(Base):
    __tablename__ = 'T_sys_name'
    id = Column(Integer,primary_key=True,nullable=False, autoincrement=True)
    sys_name = Column(String(20),nullable=False)
    level = Column(Integer,comment='等保二、三级')
    online = Column(Integer,nullable=False,comment='运行为1，为运行为0')
    add = Column(String(60),nullable=False)

class R_relation(Base):
    __tablename__ = 'R_relation'
    id = Column(Integer,primary_key=True,nullable=False, autoincrement=True)
    sys_id = Column(Integer,ForeignKey('T_sys_name.id'),nullable=False)
    out_id = Column(String(60), nullable=False)
    inner_id = Column(String(60), nullable=False)
    db_id = Column(String(60), nullable=False)
    db_relation = Column(String(200), nullable=False)

    def __repr__(self):
        return "<R_relation id={}, sys_id={},out_id={}, inner_id={}, db_id={} db_relation={}>".format(self.id,self.sys_id,self.out_id,self.inner_id,self.db_id,self.db_relation)

class T_databases(Base):
    __tablename__ = 'T_databases'
    id = Column(Integer,primary_key=True,nullable=False, autoincrement=True)
    hostname = Column(String(20),nullable=False,comment='主机名')
    role = Column(String(60),nullable=False)
    ip = Column(String(16),nullable=False)
    location = Column(String(2),nullable=False,comment='政务外网或专网（ZW or ZZ）')
    service_name = Column(String(10), nullable=False,comment='服务名')
    user = Column(String(200), nullable=False)
    middleware = Column(String(200),nullable=False,comment='中间件')
    describe = Column(Text)

class T_inner_net(Base):
    __tablename__ = 'T_inner_net'
    id = Column(Integer,primary_key=True,nullable=False, autoincrement=True)
    hostname = Column(String(20),nullable=False,comment='主机名')
    role = Column(String(60),nullable=False)
    ip = Column(String(16),nullable=False)
    middleware = Column(String(200),nullable=False,comment='中间件')
    describe = Column(Text)

class T_out_net(Base):
    __tablename__ = 'T_out_net'
    id = Column(Integer,primary_key=True,nullable=False, autoincrement=True)
    hostname = Column(String(20),nullable=False,comment='主机名')
    role = Column(String(60),nullable=False)
    ip = Column(String(16),nullable=False)
    middleware = Column(String(200),nullable=False,comment='中间件')
    describe = Column(Text)

t_V_sys_msg = Table(
    'V_sys_msg', metadata,
    Column('sys_name', String(20)),
    Column('inner_id', String(60)),
    Column('out_id', String(60)),
    Column('db_id', String(60)),
    Column('db_relation', String(200))
)


# 引擎
# pool_pre_ping=True
# pool_recycle=3600
engine = create_engine(config.URL,pool_pre_ping=True,pool_recycle=1800,echo=config.DATABASE_DEBUG)

#创建删除表

def create_all():
    Base.metadata.create_all(bind=engine)

def drop_all():
    Base.metadata.drop_all(bind=engine)

#创建session
Session = sessionmaker(bind=engine) #返回一个类,autocommit=True
session=Session()  #把Session的类进行实例化
