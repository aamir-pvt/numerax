cmake_minimum_required(VERSION 3.0)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)
project(ReportAnalysisNumeraxial VERSION 0.1.0 LANGUAGES C CXX)

include(CTest)
enable_testing()
add_definitions(-DNAPI_VERSION=3)

# include_directories(${CMAKE_JS_INC})
cmake_policy(SET CMP0042 NEW)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})

# include_directories(${CMAKE_JS_INC})
file(GLOB SOURCE_FILES "src/cpp/*.hpp" "src/cpp/*.cpp" )

# find_package(Boost)
find_package(Eigen3 CONFIG REQUIRED)
find_package(QuantLib CONFIG REQUIRED)
find_package(unofficial-node-addon-api CONFIG REQUIRED)

add_library(${PROJECT_NAME} SHARED
  ${SOURCE_FILES}

  # ${CMAKE_JS_SRC}
)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# set(BOOST_ROOT "${PROJECT_SOURCE_DIR}/external/boost")
# set(QL_INSTALL_CMAKEDIR "${PROJECT_SOURCE_DIR}/external/ql")
# add_executable(ReportAnalysisNumeraxial main.cpp)

# Subdirectories for libraries in the project
add_subdirectory(src/cpp/Reports)

# add_subdirectory(src/cpp/external/ql)
# add_subdirectory(src/cpp/external/eigen)

# add_subdirectory(external/boost)

# External Packages
# Boost
# set(QL_INSTALL_CMAKEDIR "${CMAKE_SOURCE_DIR}/external/boost")
# To make sure Boost is installed on the system

# target_link_libraries(ql_library PRIVATE ${Boost_LIBRARIES})
# target_include_directories(ql_library PRIVATE ${Boost_INCLUDE_DIRS})

# if(Boost_FOUND)∏
# include_directories(${Boost_INCLUDE_DIRS})
# target_link_libraries(${PROJECT_NAME} PUBLIC ${Boost_LIBRARIES})
# endif()
# target_include_directories(${PROJECT_NAME} PUBLIC )
# target_link_libraries(${PROJECT_NAME} PUBLIC )
# library include directories
target_include_directories(${PROJECT_NAME} PUBLIC

  # ${CMAKE_JS_INC}
  # "node_modules/node-addon-api"
  # "${PROJECT_BINARY_DIR}"
  "${PROJECT_SOURCE_DIR}/src/cpp/Reports"

  # "${QL_INSTALL_INCLUDEDIR}"
  # "${Eigen_SOURCE_DIR}"
  # ${Boost_INCLUDE_DIRS}
)
# library source files
target_link_libraries(${PROJECT_NAME} PUBLIC
  Reports
  QuantLib::QuantLib
  Eigen3::Eigen

  # Boost::boost

  # ${Boost_INCLUDE_DIRS}
  unofficial::node-addon-api::node-addon-api

  # ${CMAKE_JS_LIB}
)

# To make cmake-js work with windows
# if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
#   # Generate node.lib
#   execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
# endif()

# For node-addon-api to work during builds
# execute_process(COMMAND node -p "require('node-addon-api').include"
#   WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
#   OUTPUT_VARIABLE NODE_ADDON_API_DIR
# )
# string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
# string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
# target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

# target_include_directories(Reports PUBLIC ${Boost_INCLUDE_DIRS})
include(CPack)
