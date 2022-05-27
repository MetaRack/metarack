import os
import time
import shutil
import subprocess

def clone(user='ferluht', url='github.com/ferluht/', repo='metarack', token=''):
    repo_url = os.path.join(url, repo)
    if os.path.exists(repo) and os.path.isdir(repo):
        shutil.rmtree(repo)
    process = subprocess.Popen(["git", "clone", f"https://{user}:{token}@{repo_url}"], stdout=subprocess.PIPE)
    output = process.communicate()[0]

def checkout():
    process = subprocess.Popen(["git", "pull", "--rebase"], stdout=subprocess.PIPE)
    output = process.communicate()[0]
    if (output.decode() == 'Already up to date.\n'):
        return False
    return True

if __name__ == "__main__":
    with open('/github-token', 'r') as file:
        token = file.read().rstrip()

    clone(user='ferluht', url='github.com/ferluht', repo='metarack', token=token)
    os.chdir('metarack')

    from metarack.build import minify

    try:
        while True:
            if checkout():
                minify(out_root='server/website/demo')
        time.sleep(int(os.getenv('GIT_PULL_INTERVAL')))
    except KeyboardInterrupt:
        print('exit')