## Module build


### Install EMSDK
```cd emsdk```
```git pull```
```./emsdk install latest```
```./emsdk activate latest```

### Activate environment
```source ./emsdk_env.sh```

### Build module
```cd <module_dir>```
```mkdir build```
```cd build```
```emcmake cmake ..```
```make```