import subprocess
import time
import os

def checkout():
    process = subprocess.Popen(["git", "pull"], stdout=subprocess.PIPE)
    output = process.communicate()[0]
    if (output.decode() == 'Already up to date.\n'):
        return False
    return True

def get_all_js_files(root):
    files = []
    for f in os.listdir(root):
        f = os.path.join(root, f)
        if os.path.isdir(f):
            files += get_all_js_files(f)
        if os.path.isfile(f) and f[-3:] == '.js':
            files.append(f)
    return files

def merge_files(files, out):
    with open(out, 'w') as outfile:
        for fname in files:
            if 'p5' in fname:
                continue
            with open(fname) as infile:
                outfile.write(f'\n\n //{fname} \n\n')
                for line in infile:
                    outfile.write(line)

def minify():
    try:
        os.remove('./metarack.js')
    except OSError:
        pass

    try:
        os.remove('./website/metarack.min.js')
    except OSError:
        pass

    files = get_all_js_files('./')
    merge_files(files, './metarack.js')
    process = subprocess.Popen(["terser", "--compress", "--mangle", "--", "./metarack.js"], stdout=subprocess.PIPE)
    output = process.communicate()[0]
    with open('./website/metarack.min.js', 'w') as outfile:
        outfile.write(output.decode())
    print(f"minified, size {os.path.getsize('./website/metarack.min.js') / 1024:.2f}kb")

try:
    while True:
        if checkout():
            minify()
        time.sleep(5)
except KeyboardInterrupt:
    print('interrupted!')
