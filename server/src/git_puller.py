import time
from build import checkout, minify

if __name__ == "__main__":
    with open('private/github-token', 'r') as file:
        token = file.read().rstrip()
    try:
        while True:
            if checkout(token):
                minify()
        time.sleep(int(os.getenv('GIT_PULL_INTERVAL')))
    except KeyboardInterrupt:
        print('exit')