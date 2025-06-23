#pragma once
#ifndef Statistics_h
#define Statistics_h
#include <vector>
#include <algorithm>
#include <iostream>
#include <numeric>

using namespace std;

namespace Statistics
{

    extern double Beta(vector<double> &x, vector<double> &y);

    extern double Correlation(vector<double> x, vector<double> y);

    extern double Mean(vector<double> vec_ret);

    extern double Std(vector<double> vec_ret);

    extern double Skewness(vector<double> vec_ret);

    extern double Kurtosis(vector<double> vec_ret);

    extern double Annualized_Return(vector<double> vec_ret, int position_sign = 1);

    extern double Maxdrawdown(vector<double> vec_ret);

    extern double Sharpe_Ratio(vector<double> vec_ret, double rf, int position_sign = 1);

    extern double M_Squared(vector<double> vec_ret, double rf, vector<double> benchmark, int position_sign = 1);

    extern double Treynor_Ratio(vector<double> vec_ret, double rf, vector<double> market, int position_sign = 1);

    extern double Information_Ratio(vector<double> vec_ret, vector<double> benchmark, int position_sign = 1);

    extern double Sortino_Ratio(vector<double> vec_ret, double MAR);

    extern double Pure_Downside_Risk(vector<double> vec_ret);

    extern double Downside_Risk(vector<double> vec_ret, double rt);

    extern double Jensen_Alpha(vector<double> vec_ret, vector<double> market, double rf, int position_sign = 1);

    extern double Corr(vector<double> vec_ret, vector<double> market);

    extern double T_Stats(vector<double> vec_ret, vector<double> market);
}

#endif