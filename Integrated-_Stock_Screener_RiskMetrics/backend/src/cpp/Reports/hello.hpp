#pragma once
#include <string>
#include <iostream>
#include <iterator>
#include <boost/multiprecision/cpp_int.hpp>
#include <ql/cashflow.hpp>
#include <Eigen/Dense>

namespace hello
{

    extern boost::multiprecision::cpp_int factorial(int n);

    extern QuantLib::Month april;
}
