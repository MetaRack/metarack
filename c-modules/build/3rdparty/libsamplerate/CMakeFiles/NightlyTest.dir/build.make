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
CMAKE_SOURCE_DIR = /Users/ferluht/Dev/metarack/metarack/c-modules

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/ferluht/Dev/metarack/metarack/c-modules/build

# Utility rule file for NightlyTest.

# Include any custom commands dependencies for this target.
include 3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/compiler_depend.make

# Include the progress variables for this target.
include 3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/progress.make

3rdparty/libsamplerate/CMakeFiles/NightlyTest:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/build/3rdparty/libsamplerate && /usr/local/Cellar/cmake/3.20.3/bin/ctest -D NightlyTest

NightlyTest: 3rdparty/libsamplerate/CMakeFiles/NightlyTest
NightlyTest: 3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/build.make
.PHONY : NightlyTest

# Rule to build all files generated by this target.
3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/build: NightlyTest
.PHONY : 3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/build

3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/clean:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/build/3rdparty/libsamplerate && $(CMAKE_COMMAND) -P CMakeFiles/NightlyTest.dir/cmake_clean.cmake
.PHONY : 3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/clean

3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/depend:
	cd /Users/ferluht/Dev/metarack/metarack/c-modules/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/ferluht/Dev/metarack/metarack/c-modules /Users/ferluht/Dev/metarack/metarack/c-modules/3rdparty/libsamplerate /Users/ferluht/Dev/metarack/metarack/c-modules/build /Users/ferluht/Dev/metarack/metarack/c-modules/build/3rdparty/libsamplerate /Users/ferluht/Dev/metarack/metarack/c-modules/build/3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : 3rdparty/libsamplerate/CMakeFiles/NightlyTest.dir/depend

