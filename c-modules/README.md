## Module build


### Install EMSDK

```cd emsdk```

```git pull```

```./emsdk install latest```

```./emsdk activate latest```

### Activate environment

```source ./emsdk_env.sh```

### Build modules

```mkdir build```

```cd build```

```emcmake cmake ..```

```make```

Wasm files should appear in ./bin
