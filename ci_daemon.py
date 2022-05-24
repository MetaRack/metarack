import subprocess
import time
import os
import shutil

def checkout():
    process = subprocess.Popen(["git", "pull"], stdout=subprocess.PIPE)
    output = process.communicate()[0]
    if (output.decode() == 'Already up to date.\n'):
        return False
    return True

def get_all_files(root, frmt='.js'):
    files = []
    for f in os.listdir(root):
        f = os.path.join(root, f)
        if os.path.isdir(f):
            files += get_all_files(f, frmt)
        if os.path.isfile(f) and f[-len(frmt):] == frmt:
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

    js_files = get_all_files('./', '.js')
    wasm_files = get_all_files('./bin', '.wasm')
    for f in wasm_files:
        shutil.copy(f, './website')
    merge_files(js_files, './metarack.js')
    process = subprocess.Popen(["terser", "--compress", "--mangle", "--", "./metarack.js"], stdout=subprocess.PIPE)
    output = process.communicate()[0]
    with open('./website/metarack.min.js', 'w') as outfile:
        outfile.write(output.decode())
    print(f"minified, size {os.path.getsize('./website/metarack.min.js') / 1024:.2f}kb")

minify()

try:
    while True:
        if checkout():
            minify()
        time.sleep(5)
except KeyboardInterrupt:
    print('exit')
