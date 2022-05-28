import os
import shutil
import subprocess

def get_all_files(root='./', frmt='.js'):
    files = []
    for f in os.listdir(root):
        f = os.path.join(root, f)
        if os.path.isdir(f):
            files += get_all_files(f, frmt)
        if os.path.isfile(f) and f[-len(frmt):] == frmt:
            files.append(f)
    return files

def merge_files(files=[], out='merged'):
    with open(out, 'w') as outfile:
        for fname in files:
            if 'p5' in fname:
                continue
            with open(fname) as infile:
                outfile.write(f'\n\n //{fname} \n\n')
                for line in infile:
                    outfile.write(line)

def minify(prefix='./', out_root='./'):
    js_files  = get_all_files(root=os.path.join(prefix, 'core'), frmt='.js')
    js_files += get_all_files(root=os.path.join(prefix, 'primitives'), frmt='.js')
    js_files += get_all_files(root=os.path.join(prefix, 'modules'), frmt='.js')
    js_files += get_all_files(root=os.path.join(prefix, 'bin'), frmt='.js')
    js_files.append(os.path.join(prefix, 'index.js'))

    wasm_files = get_all_files(root=os.path.join(prefix, 'bin'), frmt='.wasm')

    wasm_bin_path = os.path.join(out_root, 'bin')
    if not os.path.exists(wasm_bin_path):
        os.makedirs(wasm_bin_path)
    for f in wasm_files:
        shutil.copy(f, wasm_bin_path)
    merge_files(files=js_files, out='./metarack.js')
    process = subprocess.Popen(["terser", "--compress", "--mangle", "--keep-classnames", "--", "./metarack.js"], stdout=subprocess.PIPE)
    output = process.communicate()[0]
    fname = os.path.join(out_root, 'metarack.min.js')
    with open(fname, 'w') as outfile:
        outfile.write(output.decode())
    os.remove('./metarack.js')
    print(f"minified, size {os.path.getsize(fname) / 1024:.2f}kb")

if __name__ == '__main__':
    minify(out_root='./server/website/demo')