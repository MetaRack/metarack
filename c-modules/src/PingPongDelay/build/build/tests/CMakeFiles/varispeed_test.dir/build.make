# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.20

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/Cellar/cmake/3.20.3/bin/cmake

# The command to remove a file.
RM = /usr/local/Cellar/cmake/3.20.3/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build

# Include any dependencies generated for this target.
include build/tests/CMakeFiles/varispeed_test.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include build/tests/CMakeFiles/varispeed_test.dir/compiler_depend.make

# Include the progress variables for this target.
include build/tests/CMakeFiles/varispeed_test.dir/progress.make

# Include the compile flags for this target's objects.
include build/tests/CMakeFiles/varispeed_test.dir/flags.make

build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o: build/tests/CMakeFiles/varispeed_test.dir/flags.make
build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o: build/tests/CMakeFiles/varispeed_test.dir/includes_C.rsp
build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o: /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/varispeed_test.c
build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o: build/tests/CMakeFiles/varispeed_test.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building C object build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -MD -MT build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o -MF CMakeFiles/varispeed_test.dir/varispeed_test.c.o.d -o CMakeFiles/varispeed_test.dir/varispeed_test.c.o -c /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/varispeed_test.c

build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/varispeed_test.dir/varispeed_test.c.i"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/varispeed_test.c > CMakeFiles/varispeed_test.dir/varispeed_test.c.i

build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/varispeed_test.dir/varispeed_test.c.s"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/varispeed_test.c -o CMakeFiles/varispeed_test.dir/varispeed_test.c.s

build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o: build/tests/CMakeFiles/varispeed_test.dir/flags.make
build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o: build/tests/CMakeFiles/varispeed_test.dir/includes_C.rsp
build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o: /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/calc_snr.c
build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o: build/tests/CMakeFiles/varispeed_test.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building C object build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -MD -MT build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o -MF CMakeFiles/varispeed_test.dir/calc_snr.c.o.d -o CMakeFiles/varispeed_test.dir/calc_snr.c.o -c /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/calc_snr.c

build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/varispeed_test.dir/calc_snr.c.i"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/calc_snr.c > CMakeFiles/varispeed_test.dir/calc_snr.c.i

build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/varispeed_test.dir/calc_snr.c.s"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/calc_snr.c -o CMakeFiles/varispeed_test.dir/calc_snr.c.s

build/tests/CMakeFiles/varispeed_test.dir/util.c.o: build/tests/CMakeFiles/varispeed_test.dir/flags.make
build/tests/CMakeFiles/varispeed_test.dir/util.c.o: build/tests/CMakeFiles/varispeed_test.dir/includes_C.rsp
build/tests/CMakeFiles/varispeed_test.dir/util.c.o: /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/util.c
build/tests/CMakeFiles/varispeed_test.dir/util.c.o: build/tests/CMakeFiles/varispeed_test.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building C object build/tests/CMakeFiles/varispeed_test.dir/util.c.o"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -MD -MT build/tests/CMakeFiles/varispeed_test.dir/util.c.o -MF CMakeFiles/varispeed_test.dir/util.c.o.d -o CMakeFiles/varispeed_test.dir/util.c.o -c /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/util.c

build/tests/CMakeFiles/varispeed_test.dir/util.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/varispeed_test.dir/util.c.i"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/util.c > CMakeFiles/varispeed_test.dir/util.c.i

build/tests/CMakeFiles/varispeed_test.dir/util.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/varispeed_test.dir/util.c.s"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && /Users/ferluht/Dev/metarack/metarack/c-modules/emsdk/upstream/emscripten/emcc $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests/util.c -o CMakeFiles/varispeed_test.dir/util.c.s

# Object files for target varispeed_test
varispeed_test_OBJECTS = \
"CMakeFiles/varispeed_test.dir/varispeed_test.c.o" \
"CMakeFiles/varispeed_test.dir/calc_snr.c.o" \
"CMakeFiles/varispeed_test.dir/util.c.o"

# External object files for target varispeed_test
varispeed_test_EXTERNAL_OBJECTS =

build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/varispeed_test.c.o
build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/calc_snr.c.o
build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/util.c.o
build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/build.make
build/tests/varispeed_test.js: build/src/libsamplerate.a
build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/linklibs.rsp
build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/objects1.rsp
build/tests/varispeed_test.js: build/tests/CMakeFiles/varispeed_test.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Linking C executable varispeed_test.js"
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/varispeed_test.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
build/tests/CMakeFiles/varispeed_test.dir/build: build/tests/varispeed_test.js
.PHONY : build/tests/CMakeFiles/varispeed_test.dir/build

build/tests/CMakeFiles/varispeed_test.dir/clean:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests && $(CMAKE_COMMAND) -P CMakeFiles/varispeed_test.dir/cmake_clean.cmake
.PHONY : build/tests/CMakeFiles/varispeed_test.dir/clean

build/tests/CMakeFiles/varispeed_test.dir/depend:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate/tests /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/tests/CMakeFiles/varispeed_test.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : build/tests/CMakeFiles/varispeed_test.dir/depend

