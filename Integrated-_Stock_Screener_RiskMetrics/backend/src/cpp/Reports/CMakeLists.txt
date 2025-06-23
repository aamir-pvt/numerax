file(GLOB MY_LIBRARY_SOURCES "*.hpp" "*.h" "*.cpp" )
add_library(Reports ${MY_LIBRARY_SOURCES} )
# find_package(Boost)
find_package(Eigen3 CONFIG REQUIRED)
find_package(QuantLib CONFIG REQUIRED)
# find_package()
# IF (Boost_FOUND)
# message(STATUS "BOOST FOUND !")
# target_include_directories(Reports INTERFACE ${Boost_INCLUDE_DIRS})
# target_include_directories(Reports INTERFACE ${QL_INSTALL_INCLUDEDIR})
# target_include_directories(Reports INTERFACE ${Eigen_SOURCE_DIR})
# target_link_libraries(Reports PUBLIC ql_library eigen)
target_link_libraries(Reports PUBLIC
    QuantLib::QuantLib
    Eigen3::Eigen
    # Boost::boost
    # ${Boost_INCLUDE_DIRS}
    # unofficial::node-addon-api::node-addon-api
    # ${CMAKE_JS_LIB}
)

# ELSE()
# message(STATUS "BOOST NOT Found !")
# endif()
