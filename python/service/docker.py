# import subprocess
import random
import string
from config1 import dkcfg
from model.model import session,Post

import docker

#为实例生成随机端口
def _get_port(fn,*args,**kwargs):
    def _wrapper(self,*args,**kwargs):
        base_ports = tuple(x for x in range(*dkcfg.ports))  # [8000-9000)
        ports = session.query(Post).values(Post.port)
        self.fin_port = random.choice(list(set(base_ports).difference(set(ports))))
        return fn(self,*args,**kwargs)
    return _wrapper

class Docker:

    def __enter__(self,*args,**kwargs):
        self.client = docker.DockerClient(base_url=dkcfg.DOCKER_BASE_URL)
        return self

    def __exit__(self,*args,**kwargs):
        self.client.close()

    def build(self,username):
        try:
            self.images = self.client.images
            #im = self.images.build(path='/home/build/{}/target'.format(username), tag='{}{}:{}'.format(username,''.join(random.sample(string.ascii_letters + string.digits, 8)),versions))
            tags = '{}_{}:{}'.format(username,''.join(random.sample(string.ascii_lowercase + string.digits, 5)),'latest')
            im = self.images.build(path=dkcfg.DF_PATH, tag=tags) #docker  build  -t  只能小写字母+数字
            self.im_id = im[0].short_id[7:]
        except Exception as e:
            print(e)
            raise e

    @_get_port
    def create_docker(self,username, project_name):
        try:
            self.container_name = username + '_' + project_name + '_' + str(''.join(random.sample(string.ascii_letters + string.digits, 5)))
            self.container = self.client.containers.create(image=self.im_id, name=self.container_name, mem_limit='1g',\
                                                      ports={'8080/tcp': self.fin_port},mem_swappiness=0, detach=True)
        except Exception as e:
            self.client.containers.get(self.container.id).remove()
            print(e)
            raise e

    def stop(self,ctr_id):
        try:
            sts = self.client.containers.get(ctr_id)
            if sts.status == 'running':
                sts.stop()
            if sts.status == 'exited' or sts.status == 'created':
                pass
        except Exception as e:
            print('stop container error:',e)
            raise e

    def start(self,ctr_id):
        try:
            sts = self.client.containers.get(ctr_id) #得到对应的container对象
            if sts.status == 'running':
                pass
            if sts.status == 'exited' or sts.status == 'created':
                sts.start()

        except Exception as e:
            print('start container error:',e)
            raise e

    def delete(self,ctr_id):
        try:
            sts = self.client.containers.get(ctr_id)
            if sts.status == 'running':
                sts.stop()
                sts.remove()
            if sts.status == 'exited' or sts.status == 'created':
                sts.remove()
        except Exception as e:
            print('start container error:',e)
            raise e

    def ck_kill(self): #kill 是杀掉处于running状态下的container
        try:
            sts = self.client.containers.get(ctr_id)
            sts.kill(9)
        except Exception as e:
            print('kill container error:',e)
            raise e
