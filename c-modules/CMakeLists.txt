cmake_minimum_required(VERSION 2.8)
project(c-modules)

set(LIBSAMPLERATE_TESTS OFF)
set(LIBSAMPLERATE_EXAMPLES OFF)
set(LIBSAMPLERATE_INSTALL OFF)

add_subdirectory(3rdparty/libsamplerate)

add_subdirectory(src/ClockedRandomChords)
add_subdirectory(src/Delay)
#add_subdirectory(src/PingPongDelay)
add_subdirectory(src/Plateau)