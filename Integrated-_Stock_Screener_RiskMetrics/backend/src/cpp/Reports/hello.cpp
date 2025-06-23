#include "hello.hpp"
#include <string>
#include <iostream>
#include <iterator>
#include <boost/multiprecision/cpp_int.hpp>
#include <ql/cashflow.hpp>
#include <Eigen/Dense>

namespace hello {
    boost::multiprecision::cpp_int factorial(int n)
    {
        boost::multiprecision::cpp_int result = 1;
        for (int i = 1; i <= n; ++i)
        {
            result *= i;
        }
        return result;
    }

    QuantLib::Month april = QuantLib::April;
}