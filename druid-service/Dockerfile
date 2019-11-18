FROM centos

RUN yum install -y \
       java-1.8.0-openjdk \
       java-1.8.0-openjdk-devel

ENV JAVA_HOME /etc/alternatives/jre

RUN yum install -y perl

WORKDIR /druid

RUN yum update -y
RUN yum install -y wget
RUN yum install -y curl

RUN wget https://www-us.apache.org/dist/incubator/druid/0.16.0-incubating/apache-druid-0.16.0-incubating-bin.tar.gz
RUN tar -xzf apache-druid-0.16.0-incubating-bin.tar.gz
RUN cd 

WORKDIR /druid/apache-druid-0.16.0-incubating
RUN curl https://archive.apache.org/dist/zookeeper/zookeeper-3.4.14/zookeeper-3.4.14.tar.gz -o zookeeper-3.4.14.tar.gz
RUN tar -xzf zookeeper-3.4.14.tar.gz
RUN mv zookeeper-3.4.14 zk

COPY ./broker-runtime.properties /druid/apache-druid-0.16.0-incubating/conf/druid/single-server/nano-quickstart/broker/runtime.properties

EXPOSE 8888

CMD ["/druid/apache-druid-0.16.0-incubating/bin/start-nano-quickstart"]
