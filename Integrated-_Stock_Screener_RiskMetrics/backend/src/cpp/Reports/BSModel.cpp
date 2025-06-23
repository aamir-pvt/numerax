#include <cmath>
#include <iostream>
#include "BSModel.hpp"
#include <Eigen/Dense>

using namespace std;

const double pi = 4.0 * atan(1.0);

int hi = Eigen::internal::all();

double Gauss()
{
	double U1 = (rand() + 1.0) / (RAND_MAX + 1.0);
	double U2 = (rand() + 1.0) / (RAND_MAX + 1.0);
	return sqrt(-2.0 * log(U1)) * cos(2.0 * pi * U2);
}
// Generate standard normal distribution random number
void BSModel::initialize(double S0_, double rf_, double sigma_)
{
	S0 = S0_;
	rf = 0;
	sigma = sigma_;
	srand(time(NULL));
}

void BSModel::MC_Simulation(double deltaT, long m, vector<double> &S)
{
	S[0] = S0;
	double first_part = 0;
	double second_part = 0;
	for (int k = 1; k < m; k++)
	{
		first_part = (sigma * sigma / 2) * deltaT;
		second_part = sigma * sqrt(deltaT) * Gauss();
		S[k] = S0 * exp(first_part + second_part);
	}
}

