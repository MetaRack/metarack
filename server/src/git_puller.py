import time
from build import checkout, minify

if __name__ == "__main__":
    try:
        while True:
            if checkout():
                minify()
        time.sleep(int(os.getenv('GIT_PULL_INTERVAL')))
    except KeyboardInterrupt:
        print('exit')