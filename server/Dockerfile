FROM python:3.9

RUN apt update
RUN apt install -y nodejs npm
RUN npm install -y terser -g

COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir --upgrade -r /requirements.txt