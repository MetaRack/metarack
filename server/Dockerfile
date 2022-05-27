FROM nikolaik/python-nodejs:python3.10-nodejs16

RUN npm install -y terser -g

COPY ./requirements.txt /requirements.txt
RUN pip install --no-cache-dir --upgrade -r /requirements.txt