# Used only for Windows (MSVC) builds via CMAKE_TOOLCHAIN_FILE_x86_64_pc_windows_msvc.
# llama.cpp enables CMake policy CMP0091, which ignores /MT in compiler flags and
# defaults to the DLL runtime (/MD -> msvcp140.dll). Select the static runtime the
# CMP0091 way so the C++ standard library is linked into Sophy Studio.
set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded" CACHE STRING "MSVC runtime" FORCE)
