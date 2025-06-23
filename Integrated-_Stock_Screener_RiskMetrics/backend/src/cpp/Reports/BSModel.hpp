#pragma once
#include <vector>
#include <cstdlib>
#include <ctime>

using namespace std;

class BSModel
{
public:
	double S0, rf, sigma;
	void initialize(double S0_, double rf_, double sigma_);
	void MC_Simulation(double deltaT, long m, vector<double> &S);
};


extern int hi;

