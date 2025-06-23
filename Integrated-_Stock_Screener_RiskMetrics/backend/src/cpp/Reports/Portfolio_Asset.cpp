#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <iomanip>
#include <fstream>
#include <string>
#include <climits>
#include <cstdint>
#include <typeinfo>
#include <Eigen/Dense>
#include <ql/math/matrix.hpp>
#include "Portfolio_Asset.h"
#include "BSModel.hpp"
#include "Statistics.h"
#define normal_distrbution_quantile_95 1.644854
#define normal_distrbution_quantile_99 2.326348
using namespace std;
using namespace QuantLib;
using Eigen::MatrixXf;
using Eigen::RowVectorXf;

void asset::initialize(double load_front_end_, double load_back_end_, double operating_expenses_, double fee_12b_1_, double custodial_, double hidden_, double redemption_, double quantity_, double position_, double rf_, double sign_)
{
	load_front_end = load_front_end_;
	load_back_end = load_back_end_;
	operating_expenses = operating_expenses_;
	fee_12b_1 = fee_12b_1_;
	custodial = custodial_;
	hidden = hidden_;
	redemption = redemption_;
	quantity = quantity_;
	position = position_;
	rf = rf_;
	sign = sign_;
}

// return of asset
void asset::get_ret(vector<double> ret_)
{
	ret = ret_;
	for (int i = 0; i < ret.size(); i++)
	{
		mu += ret[i];
	}
	mu /= ret.size();
	for (int i = 0; i < ret.size(); i++)
	{
		sigma += pow((ret[i] - mu), 2);
	}
	sigma = sqrt(sigma / (ret.size() - 1));
}

void asset::get_price(vector<double> price_)
{
	price = price_;
}

double asset::get_sigma()
{
	return sigma;
}

double asset::get_expense()
{
	return (((load_front_end + load_back_end + operating_expenses + fee_12b_1 + redemption) / 100) * position + custodial + hidden) / position;
}

// get VaR from a vector
double asset::risk_VaR(vector<double> &pl, double percentile, double &ES)
{
	vector<double> v = pl;
	sort(v.begin(), v.end());
	int ind = floor(percentile / 100 * pl.size());
	vector<double>::const_iterator first = v.begin();
	vector<double>::const_iterator last = v.begin() + ind - 1;
	vector<double> ES_vector(first, last + 1);
	std::cout << "hello" << std::endl;
	ES = -std::accumulate(ES_vector.begin(), ES_vector.end(), 0.0) / ES_vector.size();
	cout.setf(ios::fixed);
	cout << "Expected shortfall in " << fixed << setprecision(0) << (100 - percentile);
	cout << fixed << setprecision(6) << "% is " << ES << endl;
	return v[ind];
}

// max element of MC simulated value from BS model; this function was originally used as a MC predictor but did not turn out to be accuate
double asset::get_MCMax()
{
	vector<double> ret_MC;
	double SpotPrice = price[price.size() - 1];
	double Delta_T = 1.0 / 252;
	long m = 1e5; // Simulation time
	double sigma_GBM = sigma * sqrt(252);
	BSModel asset_BSModel;
	asset_BSModel.initialize(SpotPrice, rf, sigma_GBM);
	vector<double> SimulatedPricePath(m);
	asset_BSModel.MC_Simulation(Delta_T, m, SimulatedPricePath);
	return *max_element(SimulatedPricePath.begin(), SimulatedPricePath.end());
}

// min element of MC simulated value from BS model; this function was originally used as a MC predictor but did not turn out to be accuate
double asset::get_MCMin()
{
	vector<double> ret_MC;
	double SpotPrice = price[price.size() - 1];
	double Delta_T = 1.0 / 252;
	long m = 1e5; // Simulation time
	double sigma_GBM = sigma * sqrt(252);
	BSModel asset_BSModel;
	asset_BSModel.initialize(SpotPrice, rf, sigma_GBM);
	vector<double> SimulatedPricePath(m);
	asset_BSModel.MC_Simulation(Delta_T, m, SimulatedPricePath);
	return *min_element(SimulatedPricePath.begin(), SimulatedPricePath.end());
}

// Calculate asset component VaR with historical method
void asset::historical_VaR()
{
	vector<double> ret_value;
	for (int i = 1; i < price.size(); i++)
	{
		ret_value.push_back(sign * (price[i] / price[i - 1] - 1));
	}
	cout << "Calculate VaR by historical method:" << endl;
	cout.setf(ios::fixed);
	var_95_hist = -risk_VaR(ret_value, 5, ES_95_hist);
	cout << "The one-day 95% VaR based on historical method is: " << fixed << setprecision(6) << var_95_hist << endl;
	var_99_hist = -risk_VaR(ret_value, 1, ES_99_hist);
	cout << "The one-day 99% VaR based on historical method is: " << fixed << setprecision(6) << var_99_hist << endl;

	// cout << "Calculate marginal VaR by historical method:" << endl;
	// cout.setf(ios::fixed);
	// var_95_hist = -risk_VaR(ret_value, 5, ES_95_hist) * corr_asset_sp500;
	// cout << "The one-day 95% VaR based on historical method is: " << fixed << setprecision(6) << var_95_hist << endl;
	// var_99_hist = -risk_VaR(ret_value, 1, ES_99_hist) * corr_asset_sp500;
	// cout << "The one-day 99% VaR based on historical method is: " << fixed << setprecision(6) << var_99_hist << endl;
	// cout << endl;
}

// Calculate asset marginal VaR with historical method
// void asset::historical_VaR()
//{
//	vector<double> ret_value;
//	for (int i = 1; i < price.size(); i++)
//	{
//		ret_value.push_back(sign * (price[i] / price[i - 1] - 1));
//	}
//	cout << "Calculate marginal VaR by historical method:" << endl;
//	cout.setf(ios::fixed);
//	var_95_hist = -risk_VaR(ret_value, 5, ES_95_hist);
//	cout << "The one-day 95% VaR based on historical method is: " << fixed << setprecision(6) << var_95_hist << endl;
//	var_99_hist = -risk_VaR(ret_value, 1, ES_99_hist);
//	cout << "The one-day 99% VaR based on historical method is: " << fixed << setprecision(6) << var_99_hist << endl;
//
//	cout << "Calculate marginal VaR by historical method:" << endl;
//	cout.setf(ios::fixed);
//	var_95_hist = -risk_VaR(ret_value, 5, ES_95_hist);
//	cout << "The one-day 95% VaR based on historical method is: " << fixed << setprecision(6) << var_95_hist << endl;
//	var_99_hist = -risk_VaR(ret_value, 1, ES_99_hist);
//	cout << "The one-day 99% VaR based on historical method is: " << fixed << setprecision(6) << var_99_hist << endl;
//	cout << endl;
// }

// Calculate asset VaR with monte carlo simulation
vector<double> asset::MC_VaR()
{
	vector<double> ret_MC;
	double SpotPrice = price[price.size() - 1];
	double Delta_T = 1.0 / 252;
	long m = 1e5; // Simulation time
	double sigma_GBM = sigma * sqrt(252);
	BSModel asset_BSModel;
	asset_BSModel.initialize(SpotPrice, rf, sigma_GBM);
	vector<double> SimulatedPricePath(m);
	asset_BSModel.MC_Simulation(Delta_T, m, SimulatedPricePath);

	cout << setiosflags(ios::fixed) << setprecision(6);

	for (int i = 1; i < m; i++)
	{
		double retn = sign * ((SimulatedPricePath[i] - SpotPrice) / SpotPrice);
		ret_MC.push_back(retn);
	}
	cout << "Calculate VaR by Monte Carlo" << endl;
	var_95_MC = -risk_VaR(ret_MC, 5, ES_95_MC);
	cout << "The one-day 95% VaR based on Monte Carlo is: " << var_95_MC << endl
		 << endl;
	var_99_MC = -risk_VaR(ret_MC, 1, ES_99_MC);
	cout << "The one-day 99% VaR based on Monte Carlo is: " << var_99_MC << endl
		 << endl;
	return ret_MC;
}

// Calculate asset VaR with analytical method
void asset::analytical_VaR()
{
	var_95_analytical = normal_distrbution_quantile_95 * sigma;
	var_99_analytical = normal_distrbution_quantile_99 * sigma;
	cout << "Calculate VaR by analytical method" << endl;
	cout << "The one-day 95% VaR based on analytical method is: " << var_95_analytical << endl
		 << endl;
	cout << "The one-day 99% VaR based on analytical method is: " << var_99_analytical << endl
		 << endl;
}

void asset::get_parameter(double &var_95_hist_, double &var_99_hist_, double &var_95_MC_, double &var_99_MC_, double &var_95_analytical_, double &var_99_analytical_, double &ES_95_hist_, double &ES_99_hist_, double &ES_95_MC_, double &ES_99_MC_, double &mean_, double &sample_std_, double &skew_, double &kurt_, double &annualized_return_, double &sharpe_ratio_, double &m_squared_, double &beta_, double &treynor_ratio_, double &information_ratio_, double &sortino_ratio_, double &pure_downside_risk_, double &downside_risk_, double &jensen_alpha_, double &corr_, double &t_stats_)
{
	var_95_hist_ = var_95_hist;
	var_99_hist_ = var_99_hist;
	var_95_MC_ = var_95_MC;
	var_99_MC_ = var_99_MC;
	var_95_analytical_ = var_95_analytical;
	var_99_analytical_ = var_99_analytical;
	ES_95_hist_ = ES_95_hist;
	ES_99_hist_ = ES_99_hist;
	ES_95_MC_ = ES_95_MC;
	ES_99_MC_ = ES_99_MC;
	mean_ = mean;
	sample_std_ = sample_std;
	skew_ = skew;
	kurt_ = kurt;
	annualized_return_ = annualized_return;
	sharpe_ratio_ = sharpe_ratio;
	m_squared_ = m_squared;
	beta_ = beta;
	treynor_ratio_ = treynor_ratio;
	information_ratio_ = information_ratio;
	sortino_ratio_ = sortino_ratio;
	pure_downside_risk_ = pure_downside_risk;
	downside_risk_ = downside_risk;
	jensen_alpha_ = jensen_alpha;
	corr_ = corr;
	t_stats_ = t_stats;
}

// Calculate risk metrics of asset
void asset::get_statistics(vector<double> market_, int sign)
{
	vector<double> mkt_ret;
	for (int i = 1; i < market_.size(); i++)
	{
		mkt_ret.push_back(market_[i] / market_[i - 1] - 1);
	}
	mean = Statistics::Mean(ret);
	sample_std = Statistics::Std(ret);
	skew = Statistics::Skewness(ret);
	kurt = Statistics::Kurtosis(ret);
	annualized_return = Statistics::Annualized_Return(ret, sign);
	sharpe_ratio = Statistics::Sharpe_Ratio(ret, rf, sign);

	// modified the computing formula

	m_squared = Statistics::M_Squared(ret, rf, market_, sign);
	beta = Statistics::Beta(mkt_ret, ret);
	treynor_ratio = Statistics::Treynor_Ratio(ret, rf, market_, sign);
	// treynor_ratio=Treynor_Ratio(ret, rf, mkt_ret, sign);
	information_ratio = Statistics::Information_Ratio(ret, market_, sign);
	// information_ratio = Information_Ratio(ret, mkt_ret, sign);
	sortino_ratio = Statistics::Sortino_Ratio(ret, rf);
	pure_downside_risk = Statistics::Pure_Downside_Risk(ret);
	downside_risk = Statistics::Downside_Risk(ret, 0.07);
	jensen_alpha = Statistics::Jensen_Alpha(ret, market_, rf, sign);
	// jensen_alpha=Jensen_Alpha(ret, mkt_ret, rf, sign);
	corr = Statistics::Corr(ret, market_);
	// corr = Corr(ret, mkt_ret);
	t_stats = Statistics::T_Stats(ret, market_);
	// t_stats = T_Stats(ret, mkt_ret);

	cout << "Mean: " << mean << endl;
	cout << "Sample standard deviation: " << sample_std << endl;
	cout << "Skewness: " << skew << endl;
	cout << "Kurtosis: " << kurt << endl;
	cout << "Annualized return: " << annualized_return << endl;
	cout << "Sharpe ratio: " << sharpe_ratio << endl;
	cout << "M-Squared: " << m_squared << endl;
	cout << "Beta: " << beta << endl;
	cout << "Jensen Alpha: " << jensen_alpha << endl;
	cout << "Treynor ratio: " << treynor_ratio << endl;
	cout << "Information ratio: " << information_ratio << endl;
	cout << "Sortino ratio: " << sortino_ratio << endl;
	cout << "Downside risk: " << downside_risk << endl;
	cout << "Pure downside risk: " << pure_downside_risk << endl
		 << endl;
	cout << "Correlation with Benchmark: " << corr << endl
		 << endl;
	cout << "T statistics: " << t_stats << endl
		 << endl;
}
// Number of assets
int portfolio::get_n()
{
	return n;
}
// Number of days
int portfolio::get_m()
{
	return m;
}

vector<vector<double>> portfolio::get_ret()
{
	return ret;
}

vector<vector<double>> portfolio::get_price()
{
	return price;
}

vector<vector<double>> portfolio::get_fee()
{
	return fee;
}

// get VaR from a vector
double portfolio::risk_VaR(vector<double> &pl, double percentile, double &ES)
{
	vector<double> v = pl;
	sort(v.begin(), v.end());
	int ind = floor(percentile / 100 * pl.size());
	vector<double>::const_iterator first = v.begin();
	vector<double>::const_iterator last = v.begin() + ind - 1;
	vector<double> ES_vector(first, last + 1);
	ES = -std::accumulate(ES_vector.begin(), ES_vector.end(), 0.0) / ES_vector.size();
	cout.setf(ios::fixed);
	cout << "Expected shortfall in " << fixed << setprecision(0) << (100 - percentile) << "% is " << fixed << setprecision(6) << ES << endl;
	return v[ind];
}

// Calculate portfolio VaR with historical method
void portfolio::historical_VaR()
{
	vector<double> portfolio_ret;
	for (int i = 0; i < m; i++)
	{
		double sum1 = 0;
		for (int j = 0; j < n; j++)
		{
			sum1 += ret[j][i] * fee[j][0] / position;
		}
		portfolio_ret.push_back(sum1);
	}
	portfolio_return = portfolio_ret;

	cout << "Calculate VaR by historical method:" << endl;
	std::cout << "After hello" << std::endl;
	var_95_hist = -risk_VaR(portfolio_return, 5, ES_95_hist);
	cout << "The one-day 95% VaR based on historical method is: " << var_95_hist << endl;
	var_99_hist = -risk_VaR(portfolio_return, 1, ES_99_hist);
	cout << "The one-day 99% VaR based on historical method is: " << var_99_hist << endl;
	cout << endl;
	result["portfolio"]["var_95_hist"] = var_95_hist;
	result["portfolio"]["ES_95_hist"] = ES_95_hist;
	result["portfolio"]["var_99_hist"] = var_99_hist;
	result["portfolio"]["ES_99_hist"] = ES_99_hist;

	for (int i = 0; i < n; i++)
	{
		cout << name[i] << endl;
		cout << "Calculate marginal VaR by historical method:" << endl;
		double var_95_hist_m = var_95_hist * asset_market_corr[i];
		cout << "The one-day 95% VaR based on historical method is: " << var_95_hist_m << endl;
		double var_99_hist_m = var_99_hist * asset_market_corr[i];
		cout << "The one-day 99% VaR based on historical method is: " << var_99_hist_m << endl;
		cout << endl;
	}

	// for (int i = 0; i < n; i++)
	//{
	//	cout << name[i] << endl;
	//	cout << "Calculate incremental VaR by historical method:" << endl;
	//	double var_95_hist_m = var_95_hist * asset_market_corr[i];
	//	cout << "The one-day 95% VaR based on historical method is: " << var_95_hist_m << endl;
	//	double var_99_hist_m = var_99_hist * asset_market_corr[i];
	//	cout << "The one-day 99% VaR based on historical method is: " << var_99_hist_m << endl;
	//	cout << endl;
	// }
}

// Calculate portfolio VaR with monte carlo simulation
void portfolio::MC_VaR()
{
	vector<double> ret_MC;
	vector<double> quantity(n);
	double SpotPrice = 0;

	for (int i = 0; i < n; i++)
	{
		quantity[i] = floor(fee[i][0] / price[i][m - 1]);
	}

	for (int i = 0; i < n; i++)
	{
		if (quantity[i] == 0)
			SpotPrice += price[i][m - 1];
		else
			SpotPrice += quantity[i] * price[i][m - 1];
	}

	double Delta_T = 1.0 / 252;
	long M = 1e5;
	double sigma_GBM = Statistics::Std(portfolio_return) * sqrt(252);
	BSModel portfolio_BSModel;
	portfolio_BSModel.initialize(SpotPrice, rf, sigma_GBM);
	vector<double> SimulatedPricePath(M);
	portfolio_BSModel.MC_Simulation(Delta_T, M, SimulatedPricePath);
	cout << setiosflags(ios::fixed) << setprecision(6);

	for (int i = 1; i < M; i++)
	{
		double retn = (SimulatedPricePath[i] - SpotPrice) / SpotPrice;
		ret_MC.push_back(retn);
	}

	cout << "Calculate VaR by Monte Carlo" << endl;
	var_95_MC = -risk_VaR(ret_MC, 5, ES_95_MC);
	cout << "The one-day 95% VaR based on Monte Carlo is: " << var_95_MC << endl
		 << endl;
	var_99_MC = -risk_VaR(ret_MC, 1, ES_99_MC);
	cout << "The one-day 99% VaR based on Monte Carlo is: " << var_99_MC << endl
		 << endl;
	result["portfolio"]["var_95_MC"] = var_95_MC;
	result["portfolio"]["ES_95_MC"] = ES_95_MC;
	result["portfolio"]["var_99_MC"] = var_99_MC;
	result["portfolio"]["ES_99_MC"] = ES_99_MC;
}

// Calculate portfolio VaR with analytical method
void portfolio::analytical_VaR()
{
	MatrixXf weight(1, n);
	MatrixXf ret_mat(m - 1, n);
	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < m - 1; j++)
		{
			ret_mat(j, i) = ret[i][j + 1];
		}
	}

	MatrixXf meanVec = ret_mat.colwise().mean();
	RowVectorXf meanVecRow(RowVectorXf::Map(meanVec.data(), ret_mat.cols()));
	MatrixXf zeroMeanMat = ret_mat;
	zeroMeanMat.rowwise() -= meanVecRow;
	MatrixXf covMat;

	if (ret_mat.rows() == 1)
		covMat = (zeroMeanMat.adjoint() * zeroMeanMat) / double(ret_mat.rows());
	else
		covMat = (zeroMeanMat.adjoint() * zeroMeanMat) / double(ret_mat.rows() - 1);

	for (int i = 0; i < n; i++)
	{
		weight(0, i) = fee[i][0] / position;
	}
	MatrixXf sigma_var = weight * covMat * weight.transpose();
	double z_stat = normal_distrbution_quantile_95;
	cout << "Calculate VaR by analytical method" << endl;
	var_95_analytical = z_stat * sqrt(sigma_var(0, 0));
	cout << "The one-day 95% VaR based on analytical method is: " << var_95_analytical << endl
		 << endl;
	result["portfolio"]["var_95_analytical"] = var_95_analytical;
	var_99_analytical = normal_distrbution_quantile_99 * sqrt(sigma_var(0, 0));
	cout << "The one-day 99% VaR based on analytical method is: " << var_99_analytical << endl
		 << endl;
	result["portfolio"]["var_99_analytical"] = var_99_analytical;
}

// Calculate weights from mean-variance optimization
void portfolio::minrisk_weights()
{

	MatrixXf weight(1, n);
	MatrixXf ret_mat(m - 1, n);
	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < m - 1; j++)
		{
			ret_mat(j, i) = ret[i][j + 1];
		}
	}

	MatrixXf meanVec = ret_mat.colwise().mean();
	RowVectorXf meanVecRow(RowVectorXf::Map(meanVec.data(), ret_mat.cols()));
	MatrixXf zeroMeanMat = ret_mat;
	zeroMeanMat.rowwise() -= meanVecRow;
	MatrixXf covMat;

	if (ret_mat.rows() == 1)
		covMat = (zeroMeanMat.adjoint() * zeroMeanMat) / double(ret_mat.rows());
	else
		covMat = (zeroMeanMat.adjoint() * zeroMeanMat) / double(ret_mat.rows() - 1);

	RowVectorXf u(n);
	for (int i = 0; i < n; i++)
	{
		u[i] = fee[i][0];
	}

	// n is the number of securities
	// C is the convariance matrix
	// u is the identity row vector with length n

	MatrixXf inverse_C(n, n);
	inverse_C = covMat.inverse();
	RowVectorXf w(n);
	// w is the weight that we want to calcalate
	w = (u * inverse_C) / (u * inverse_C * u.transpose());

	for (int i = 0; i < n; i++)
	{
		result[name[i]]["minrisk_weights"] = w[i];
		cout << name[i] << " mean-variance optimization weight: " << w[i] << endl;
	}
}

void portfolio::get_position()
{
	for (int i = 0; i < n; i++)
	{
		position += fee[i][0];
	}
}

void portfolio::get_market_value()
{
	cout << "Gross exposure: " << position << endl;
	cout << "Net exposure: " << net_exposure << endl
		 << endl;
	result["portfolio"]["gross_exposure"] = position;
	result["portfolio"]["net_exposure"] = net_exposure;
}

void portfolio::get_expense()
{
	double sum = 0;
	for (int i = 0; i < n; i++)
	{
		sum += expense[i];
	}
	cout << "Expense of portfolio is: " << sum / position << endl
		 << endl;
	result["portfolio"]["expense"] = sum / position;
}

map<string, map<string, double>> portfolio::get_result()
{
	return result;
}

map<string, map<string, double>> portfolio::get_corr()
{
	return correlation_matrix;
}

vector<string> portfolio::get_name()
{
	return name;
}

map<string, double> portfolio::get_weights()
{
	return weights;
}

double portfolio::get_first_sum()
{
	return first_sum;
}

double portfolio::get_last_sum()
{
	return last_sum;
}

string portfolio::get_first()
{
	return first;
}

string portfolio::get_last()
{
	return last;
}

void portfolio::get_statistics()
{
	vector<double> mkt_ret;
	for (int i = 1; i < market.size(); i++)
	{
		mkt_ret.push_back(market[i] / market[i - 1] - 1);
	}
	mean = Statistics::Mean(portfolio_return);
	sample_std = Statistics::Std(portfolio_return);
	skew = Statistics::Skewness(portfolio_return);
	kurt = Statistics::Kurtosis(portfolio_return);
	annualized_return = Statistics::Annualized_Return(portfolio_return);
	sharpe_ratio = Statistics::Sharpe_Ratio(portfolio_return, rf);
	m_squared = Statistics::M_Squared(portfolio_return, rf, market);
	beta = Statistics::Beta(mkt_ret, portfolio_return);
	treynor_ratio = Statistics::Treynor_Ratio(portfolio_return, rf, market);
	information_ratio = Statistics::Information_Ratio(portfolio_return, market);
	sortino_ratio = Statistics::Sortino_Ratio(portfolio_return, rf);
	pure_downside_risk = Statistics::Pure_Downside_Risk(portfolio_return);
	downside_risk = Statistics::Downside_Risk(portfolio_return, rf);
	jensen_alpha = Statistics::Jensen_Alpha(portfolio_return, market, rf);
	t_stats = Statistics::T_Stats(portfolio_return, market);

	cout << "Mean: " << mean << endl;
	cout << "Sample standard deviation: " << sample_std << endl;
	cout << "Skewness: " << skew << endl;
	cout << "Kurtosis: " << kurt << endl;
	cout << "Annualized return: " << annualized_return << endl;
	cout << "Sharpe ratio: " << sharpe_ratio << endl;
	cout << "M-Squared: " << m_squared << endl;
	cout << "Beta: " << beta << endl;
	cout << "Jensen Alpha: " << jensen_alpha << endl;
	cout << "Treynor ratio: " << treynor_ratio << endl;
	cout << "Information ratio: " << information_ratio << endl;
	cout << "Sortino ratio: " << sortino_ratio << endl;
	cout << "Downside risk: " << downside_risk << endl;
	cout << "Pure downside risk: " << pure_downside_risk << endl
		 << endl;
	cout << "T statistics: " << t_stats << endl
		 << endl;

	result["portfolio"]["mean"] = mean;
	result["portfolio"]["sample_std"] = sample_std;
	result["portfolio"]["skew"] = skew;
	result["portfolio"]["kurt"] = kurt;
	result["portfolio"]["annualized_return"] = annualized_return;
	result["portfolio"]["sharpe_ratio"] = sharpe_ratio;
	result["portfolio"]["m_squared"] = m_squared;
	result["portfolio"]["beta"] = beta;
	result["portfolio"]["jensen_alpha"] = jensen_alpha;
	result["portfolio"]["treynor_ratio"] = treynor_ratio;
	result["portfolio"]["information_ratio"] = information_ratio;
	result["portfolio"]["sortino_ratio"] = sortino_ratio;
	result["portfolio"]["downside_risk"] = downside_risk;
	result["portfolio"]["pure_downside_risk"] = pure_downside_risk;
	result["portfolio"]["t_stats"] = t_stats;
}
