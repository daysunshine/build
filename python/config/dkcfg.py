# commond = '/usr/bin/docker run -it -d --rm  --name {} {} '.format()

IMAGE_ID = "5a069ba3df4d" #docker中的tomcat的镜像ID  从harbor中进行拉取

LOCAL_HOST = '192.168.5.252'

DOCKER_BASE_URL = 'tcp://192.168.5.252:2375'


DF_PATH = 'D:/test'


ports = (8000,9000) # start,end
