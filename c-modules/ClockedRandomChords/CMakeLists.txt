cmake_minimum_required(VERSION 2.8)

project(ClockedRandomChords)

include_directories("../common")

file(GLOB_RECURSE CORE_HDR ./src/*.h)
file(GLOB_RECURSE CORE_SRC ./src/*.cpp)

add_definitions("-std=c++11")
add_executable(ClockedRandomChords ${CORE_SRC} ${CORE_HDR})

set(CMAKE_CXX_FLAGS "-O3")

set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set_target_properties(ClockedRandomChords PROPERTIES LINK_FLAGS "-O3 -s WASM=1 -s STANDALONE_WASM -Wl,--no-entry -s EXPORTED_FUNCTIONS='[_constructor, _process]' -sALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=cwrap,ccall")