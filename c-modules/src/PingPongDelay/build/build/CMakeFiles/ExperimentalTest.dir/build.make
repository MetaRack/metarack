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

# Utility rule file for ExperimentalTest.

# Include any custom commands dependencies for this target.
include build/CMakeFiles/ExperimentalTest.dir/compiler_depend.make

# Include the progress variables for this target.
include build/CMakeFiles/ExperimentalTest.dir/progress.make

build/CMakeFiles/ExperimentalTest:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build && /usr/local/Cellar/cmake/3.20.3/bin/ctest -D ExperimentalTest

ExperimentalTest: build/CMakeFiles/ExperimentalTest
ExperimentalTest: build/CMakeFiles/ExperimentalTest.dir/build.make
.PHONY : ExperimentalTest

# Rule to build all files generated by this target.
build/CMakeFiles/ExperimentalTest.dir/build: ExperimentalTest
.PHONY : build/CMakeFiles/ExperimentalTest.dir/build

build/CMakeFiles/ExperimentalTest.dir/clean:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build && $(CMAKE_COMMAND) -P CMakeFiles/ExperimentalTest.dir/cmake_clean.cmake
.PHONY : build/CMakeFiles/ExperimentalTest.dir/clean

build/CMakeFiles/ExperimentalTest.dir/depend:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build /Users/ferluht/Dev/metarack/metarack/c-modules/PingPongDelay/build/build/CMakeFiles/ExperimentalTest.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : build/CMakeFiles/ExperimentalTest.dir/depend

