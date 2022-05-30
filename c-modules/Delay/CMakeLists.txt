cmake_minimum_required(VERSION 2.8)

project(Delay)

set(BUILD_TESTING OFF)
set(LIBSAMPLERATE_EXAMPLES OFF)
set(LIBSAMPLERATE_INSTALL OFF)
add_subdirectory("../3rdparty/libsamplerate" build)

include_directories("../common")
include_directories("../3rdparty")

file(GLOB_RECURSE CORE_HDR ./src/*.h)
file(GLOB_RECURSE CORE_SRC ./src/*.cpp)

add_definitions("-std=c++11")
add_executable(Delay ${CORE_SRC} ${CORE_HDR})
target_link_libraries(Delay samplerate)

set(CMAKE_CXX_FLAGS "-O3")

set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set_target_properties(Delay PROPERTIES LINK_FLAGS "-O3 -s WASM=1 -s STANDALONE_WASM -Wl,--no-entry -s EXPORTED_FUNCTIONS='[_constructor, _process]' -sALLOW_MEMORY_GROWTH=1 -s EXPORTED_RUNTIME_METHODS=cwrap,ccall")