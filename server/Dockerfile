FROM python:3.9

RUN apt-get update
RUN apt-get install -y nodejs npm
RUN npm install -y terser -g

COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir --upgrade -r /requirements.txt