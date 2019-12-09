from flask import Flask,abort
from flask import  g, jsonify, request,Response
import bcrypt
from model.model import User, session
# from webob import exc
#import redis,datetime,math,re
# from flask_session import Session

from itsdangerous import TimedJSONWebSignatureSerializer as Serializer #数字签名类似的方法去实现加密的token
from itsdangerous import BadSignature, SignatureExpired
from flask_httpauth import HTTPBasicAuth

from service.ssh_connect import SSH
import logging

FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
#logging.basicConfig(level=logging.INFO, filename='ping.log', filemode='a', format=FORMAT)
logging.basicConfig(level=logging.INFO, filename='build.log', filemode='a', format=FORMAT)

app = Flask(__name__)
auth = HTTPBasicAuth() #认证实例化

#配置会话中的session信息存放在Redis中
SECRET_KEY = 'secret'
EXPIRE = 60*60
REPO_ADDRESS = '10.60.32.182'
# app.config['SESSION_TYPE'] = 'redis'
# app.config['SESSION_REDIS'] = redis.Redis(host='192.168.5.252', port='6379', password='test123')
# app.config['SESSION_KEY_PREFIX'] = 'flask' #定义前缀



#生成token
def gen_token(user_id):
    serializer = Serializer(secret_key=SECRET_KEY, expires_in=EXPIRE)
    token = serializer.dumps({"user_id": user_id}).decode()
    return token

@app.route('/api/user/reg', methods=['POST'])
def reg():
    payload = request.json
    name = payload.get('name')
    if session.query(User).filter(User.name == name).first() is not None:
        abort(409)
        abort(Response("{} is exist!".format(name)))
    try:
        user = User()
        user.name = payload.get('name')
        user.password = bcrypt.hashpw(payload['password'].encode(), bcrypt.gensalt()) #对密码进行加密，存放到数据库当中
        # user.spwd = base64.b64encode(payload['password'].encode())
    except Exception as e:
        print('reg error:',e)
        # exc.HTTPBadRequest()
    session.add(user)
    try:
        session.commit()
        return jsonify(id=user.id, name=user.name, token=gen_token(user.id))
    except:
        session.rollback()
        abort(500)
        abort(Response('reg failed'))

#登录login 提交email和密码进行登录, 用json的方式传输用户名和密码是可以传输中文的，用其他方式可能会有些问题，json要用双引号""
@app.route('/api/user/login', methods=['POST'])
def login():

    payload = request.json
    #账户email验证
    name = payload.get('name')
    user = session.query(User).filter(User.name == name).first()
    session.close()
    #密码验证
    try:
        if user and bcrypt.checkpw(payload['password'].encode(), user.password.encode()): #将登录的密码与数据库中的密码进行比较并进行相应的动作
            return jsonify(id=user.id, name=user.name, token=gen_token(user.id))
        else:
            abort(401)
    except Exception as e:
        logging.error('certification failed',e)

#发布文章
@app.route('/api/post/build', methods=["POST"])
@auth.login_required   #在进行提交文章时进行认证，必须登录后才能提交文章
def build():
    payload = request.json
    address=payload.get('address',None)
    buildname=payload.get('buildname',None)
    # print(payload)
    ssh = SSH()
    build_msg = depoly_msg = messages = ""
    #构建tgms and findreport
    try:
        ssh.conn(REPO_ADDRESS, 'repo', '******')
        if buildname == 'tgms':
            for gl in ssh.line_buffered(ssh.Execmd('bash /home/repo/deploy.sh')):
                print(gl)
                messages += '{}'.format(gl)
        if buildname == 'findreport' or buildname == 'fr':
            for gl in ssh.line_buffered(ssh.Execmd('bash /home/repo/fr_deploy.sh')):
                print(gl)
                messages += '{}'.format(gl)
        if buildname == None:
            abort(404)
            logging.info(Response(r'coun\'t found buildname!!!'))
        ssh.close()
    except Exception as e:
        logging.error('Building error',e)
        build_msg = 'Build {} Failed'.format(buildname)
        abort(Response("{}".format(messages),status=500))
    build_msg = 'Build {} Succeed'.format(buildname)
    #部署tgms and findreport
    if address == '10.10.10.10' and buildname == 'findreport':
        address = '10.10.10.11'
        buildname = 'fr'
    logging.info('****** {} {}'.format(address, buildname))
    try:
        if buildname == 'tgms':
            ssh.conn(address,buildname,'******')
            for bl in ssh.line_buffered(ssh.Execmd('bash /home/tgms/bin/deploy.sh')):
                print(bl)
        if buildname == 'findreport' or buildname == 'fr':
            ssh.conn(address, buildname, '******')
            logging.info('========{} {}'.format(address, buildname))
            for bl in ssh.line_buffered(ssh.Execmd('bash /home/{}/repo/deploy.sh'.format(buildname))):
                print(bl)
        ssh.close()
    except Exception as e:
        logging.error('Deploying error', e)
        depoly_msg = 'Deployment {} Failed'.format(buildname)
        abort(500)
    depoly_msg = 'Deployment {} Succeed'.format(buildname)

    return jsonify(message={'build_msg':build_msg,'depoly_msg':depoly_msg})

@app.route('/api/post/testurl', methods=["POST"])
@auth.login_required
def fortest():
    payload = request.json
    testurl = payload.get("testurl",None)
    if testurl:
        try:
            response = requests.get(testurl)
            status = response.status_code
        except Exception as e:
            print(e)
            abort(Response('failed', status=status))
    else:
        abort(Response('None', status=400))
    return Response('success', status=status)


#获取主机中已创建的container列表
@app.route('/api/docker/list',methods=["GET"])
@auth.login_required
def dk_list():
    user_id = g.user.id
    clist = session.query(Post).filter(Post.author_id == user_id).all()
    # print('clist------',clist)
    return jsonify(posts=[
        {'project_name': l.project_name,
         'svn_url': l.svn_url,
         # 'container_name':l.container_name,
         'ctr_name': l.container_name,
         'ctr_id': l.container_id,
         # 'status':[l.state]
         'ctr_port':l.port,
         'status': l.state
         } for l in clist])

# 处理docker container 启动、停止、删除   docker start
@app.route('/api/post/images',methods=["POST"])
@auth.login_required
def images():
    payload = request.args
    id = g.user.id
    action = payload.get('action')
    container_id = payload.get('ctrid')
    with Docker() as dk:
        if action == 'start':
            dk.start(container_id)
        elif action == 'stop':
            dk.stop(container_id)
        elif action == 'delete':
            dk.delete(container_id)

    #数据库操作未同步更新
    user = session.query(User).filter(User.id == id).first()

#获取对应用户svn的仓库地址
@app.route('/api/paths',methods=["GET"])
@auth.login_required
def get_path():
    user_id = g.user.id
    paths = session.query(User.id,Url.name, Url.uid,Url.path).join(R_User_Url, R_User_Url.user_id == User.id).\
        join(Url,R_User_Url.url_id == Url.id).filter(User.id == user_id).all()

    return jsonify(path=[
        {'pro_name':name,
         'p_uid':uid,
         'spath':url
         } for _,name,uid,url in paths])

@app.route('/api/docker/build',methods=["POST"])
@auth.login_required
def code2build():
    payload = request.json
    user_id = g.user.id
    puid = payload.get('p_uid',0)
    try:
        user = session.query(User.name, User.spwd, Url.path ,Url.aliasname).join(R_User_Url, R_User_Url.user_id == User.id).\
            join(Url,R_User_Url.url_id == Url.id).filter(User.id == user_id).filter(Url.uid == puid).first()
    except Exception as e:
        abort(Response(e,status=400))
    # print('---user----',user)
    if user :
        username = user[0]
        spwd = dencryption(user[1])
        path = user[2]
        proname = user[3] #Url.aliasname 非汉字
        # logging.info('********',username,path,proname)
        ssh = SSH()
        try:
            ssh.conn(DK_ADDRESS, 'build', '******') #连接build进行打包
            for ss in ssh.line_buffered(ssh.Execmd('bash /home/build/code2build.sh {} {} {}'.format(path, username, spwd))):
                print(ss)
        except Exception as e:
            logging.error(e)
            abort(Response('connect error',status=500))
        # docker 构建 镜像
        try:
            with Docker() as dk:
                dk.build(username)
                dk.create_docker(username,proname)
                container_id = dk.container.id[:12]
                container_name = dk.container.name
                container_port = dk.fin_port
        except Exception as e:
            logging.error(e)
            abort(Response(e,status=500))

        post = Post()
        try:
            post.svn_url = path #url path
            post.project_name = proname  #Url.aliasname
            post.author_id = g.user.id
            post.container_name = container_name
            post.container_id = container_id
            post.port = container_port
        except Exception as e:
            logging.error(e)

        session.add(post)

        try:
            session.commit()
        except Exception as e:
            session.rollback()
            with Docker() as dk:
                dk.delete(container_id)
            abort(Response(e,status=500))
        return Response(status=200)
        # web_url = '{}:{}'.format(dkcfg.LOCAL_HOST, container_port)
    else:
        abort(Response('not found!',status=400))
    
    

#认证函数
@auth.verify_password
def check_authorization(token,pwd):
    # print('token----',token)
    token = token.replace("\"", "")
    user_info = check_auth_token(token)
    if not user_info:
        return False   #验证未通过返回False
    else:
        g.user = user_info
        # print('1212',type(g.user), g.user.id)
        return True #验证通过返回True

def check_auth_token(token):
    serializer = Serializer(secret_key=SECRET_KEY)
    try:
        s = serializer.loads(token)
    except BadSignature:
        # raise exc.HTTPUnauthorized('token is invalid')
        abort(401)
        abort(Response('token is invalid'))
    except SignatureExpired:
        # raise exc.HTTPUnauthorized('token is expire')
        abort(401)
        abort(Response('token is expire'))
    user = session.query(User).get(s['user_id'])
    session.close()
    return user


#server
if __name__ == '__main__':
    app.run(debug=False)








