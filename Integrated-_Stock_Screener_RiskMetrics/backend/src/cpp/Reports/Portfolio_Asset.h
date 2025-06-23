#pragma once
#ifndef Portfolio_Asset_h
#define Portfolio_Asset_h
#include <vector>
#include <map>
#include "CSVParser.hpp"
#include "Statistics.h"
#include <cmath>
#include <Eigen/Dense>

class asset
{
private:
	double load_front_end;
	double load_back_end;
	double operating_expenses;
	double fee_12b_1;
	double custodial;
	double hidden;
	double redemption;
	double quantity = 1;
	double position = 0;
	double mu = 0;
	double sigma = 0;
	double rf = 0;
	int sign;
	double ES_95_hist = 0;
	double ES_99_hist = 0;
	double ES_95_MC = 0;
	double ES_99_MC = 0;
	double var_95_hist = 0;
	double var_99_hist = 0;
	double var_95_MC = 0;
	double var_99_MC = 0;
	double var_95_analytical = 0;
	double var_99_analytical = 0;
	double corr_asset_sp500 = 0.75;
	vector<double> ret;
	vector<double> price;
	vector<double> ret_MC;
	double mean;
	double sample_std;
	double skew;
	double kurt;
	double annualized_return;
	double sharpe_ratio;
	double m_squared;
	double beta;
	double treynor_ratio;
	double information_ratio;
	double sortino_ratio;
	double pure_downside_risk;
	double downside_risk;
	double jensen_alpha;
	double corr;
	double t_stats;

public:
	void initialize(double load_front_end_, double load_back_end_, double operating_expenses_, double fee_12b_1_, double custodial_, double hidden_, double redemption_, double quantity_, double position_, double rf_, double sign_);
	void get_ret(vector<double> ret_);
	void get_price(vector<double> price_);
	double get_sigma();
	double get_expense();
	double risk_VaR(vector<double> &pl, double percentile, double &ES);
	void historical_VaR();
	vector<double> MC_VaR();
	void analytical_VaR();
	void get_parameter(double &var_95_hist_, double &var_99_hist_, double &var_95_MC_, double &var_99_MC_, double &var_95_analytical_, double &var_99_analytical_, double &ES_95_hist_, double &ES_99_hist_, double &ES_95_MC_, double &ES_99_MC_, double &mean_, double &sample_std_, double &skew_, double &kurt_, double &annualized_return_, double &sharpe_ratio_, double &m_squared_, double &beta_, double &treynor_ratio_, double &information_ratio_, double &sortino_ratio_, double &pure_downside_risk_, double &downside_risk_, double &jensen_alpha_, double &corr_, double &t_stats_);
	void get_statistics(vector<double> market_, int sign);
	double get_MCMax();
	double get_MCMin();
};

class portfolio
{
private:
	// Parser data_portfolio;
	// Parser data_fee;
	double rf;
	int n;
	int m;
	double position;
	double net_exposure = 0;
	vector<vector<double>> ret;
	vector<vector<double>> portfolio_ret_MC;
	vector<double> portfolio_return;
	vector<vector<double>> price;
	vector<vector<double>> fee;
	vector<double> market;
	vector<string> name;
	vector<double> expense;
	vector<double> asset_market_corr;
	vector<double> ret_sp500;
	vector<double> sigma;
	vector<double> sign;
	map<string, map<string, double>> result;
	double ES_95_hist = 0;
	double ES_99_hist = 0;
	double ES_95_MC = 0;
	double ES_99_MC = 0;
	double var_95_hist = 0;
	double var_99_hist = 0;
	double var_95_MC = 0;
	double var_99_MC = 0;
	double var_95_analytical = 0;
	double var_99_analytical = 0;
	double mean;
	double sample_std;
	double skew;
	double kurt;
	double annualized_return;
	double sharpe_ratio;
	double m_squared;
	double beta;
	double treynor_ratio;
	double information_ratio;
	double sortino_ratio;
	double pure_downside_risk;
	double downside_risk;
	double jensen_alpha;
	double corr;
	double t_stats;
	double first_sum;
	double last_sum;
	string first;
	string last;
	map<string, double> weights;
	map<string, double> first_date;
	map<string, double> last_date;
	map<string, map<string, double>> correlation_matrix;
	map<string, vector<double>> ret_matrix;

public:
	// portfolio(const string &filename1_, const string &filename2_, double rf_) : data_portfolio(Parser(filename1_)), data_fee(Parser(filename2_))
	portfolio(const std::vector<std::string> header, const std::vector<std::vector<double>> prices, const std::vector<std::vector<double>> feeAndPositions, double rf_)
	{
		// the last column of data_portfolio is market data
		// int n_ = (data_portfolio.columnCount() - 2); // number of assets
		int n_ = header.size() - 1;
		// int m_ = (data_portfolio.rowCount() - 1);	 // number of dates
		int m_ = prices.size();
		cout << "col: " << n_ << endl;
		cout << "row: " << m_ << endl;
		vector<vector<double>> ret_(n_);
		vector<vector<double>> price_(n_);
		vector<vector<double>> fee_(n_);
		// Market data
		for (int i = 0; i < m_; i++)
		{
			market.push_back(prices[i][n_ + 1]);
		}

		// Position and fees
		for (int i = 0; i < n_; i++)
		{
			for (int j = 0; j < feeAndPositions.size(); j++)
			{
				// fee_[i].push_back(stod(data_fee[j][i + 1]));
				fee_[i].push_back(feeAndPositions[j][i + 1]);
			}
		}
		// Long and short
		for (int i = 0; i < n_; i++)
		{
			if (fee_[i][0] < 0)
				sign.push_back(-1);
			else if (fee_[i][0] == 0)
				sign.push_back(0);
			else
				sign.push_back(1);
		}
		// Net exposure
		for (int i = 0; i < n_; i++)
		{
			net_exposure += fee_[i][0];
		}
		// Gross exposure
		for (int i = 0; i < n_; i++)
		{
			fee_[i][0] = sign[i] * fee_[i][0];
		}
		// Ticker
		for (int i = 0; i < n_; i++)
		{
			name.push_back(header[i]);
		}
		// Return and price
		for (int i = 0; i < n_; i++)
		{
			for (int j = 0; j < m_; j++)
			{
				price_[i].push_back(prices[j][(i)]);
			}
		}

		for (int i = 0; i < n_; i++)
		{
			for (int j = 0; j < m_; j++)
			{
				if (j == 0)
				{
					ret_[i].push_back(0);
				}
				else
				{
					double pct = log(price_[i][j] / price_[i][j - 1]);
					ret_[i].push_back(sign[i] * pct);
				}
			}
			ret_matrix[name[i]] = ret_[i];
		}

		// Get return of sp500
		for (int j = 0; j < m_; j++)
		{
			if (j == 0)
			{
				ret_sp500.push_back(0);
			}
			else
			{
				double pct_sp = log(prices[j][n_ - 1] / prices[j - 1][n_ - 1]);
				ret_sp500.push_back(pct_sp);
			}
		}

		// Get corraltion
		for (int i = 0; i < n_; i++)
		{
			asset_market_corr.push_back(Statistics::Correlation(ret_[i], ret_sp500));
			for (int j = 0; j < n_; j++)
			{
				correlation_matrix[name[i]][name[j]] = Statistics::Correlation(ret_matrix[name[i]], ret_matrix[name[j]]);
			}
		}

		for (int i = 0; i < (n_); i++)
		{
			// weights[name[i]] = stod(data_portfolio[data_portfolio.rowCount() - 1][i + 1]);

			weights[name[i]] = prices[prices.size() - 1][i];
		}

		for (int i = 0; i < (n_); i++)
		{
			// first_date[name[i]] = stod(data_portfolio[0][i + 1]);
			// last_date[name[i]] = stod(data_portfolio[data_portfolio.rowCount() - 2][i + 1]);
			first_date[name[i]] = prices[0][i + 1];
			last_date[name[i]] = prices[prices.size() - 1][i + 1];
		}

		first_sum = 0.0;
		last_sum = 0.0;
		for (int i = 0; i < (n_); i++)
		{
			first_sum = first_sum + weights[name[i]] * 1000 * first_date[name[i]];
			last_sum = last_sum + weights[name[i]] * 1000 * last_date[name[i]];
		}

		vector<asset> Asset(n_);

		for (int i = 0; i < n_; i++)
		{
			cout << name[i] << endl
				 << endl;
			Asset[i].initialize(fee_[i][1], fee_[i][2], fee_[i][3], fee_[i][4], fee_[i][5], fee_[i][6], fee_[i][7], floor(fee_[i][0] / price_[i][prices.size() - 1]), fee_[i][0], rf_, sign[i]);
			Asset[i].get_ret(ret_[i]);
			Asset[i].get_price(price_[i]);
			Asset[i].historical_VaR();
			portfolio_ret_MC.push_back(Asset[i].MC_VaR());
			Asset[i].analytical_VaR();
			Asset[i].get_statistics(market, sign[i]);
			cout << "NAV: " << price_[i][m_ - 1] << endl
				 << endl;
			expense.push_back(Asset[i].get_expense() * fee_[i][0]);
			cout << "Expense of asset is: ";
			cout << Asset[i].get_expense() << endl
				 << endl;
			result[name[i]];
			Asset[i].get_parameter(result[name[i]]["var_95_hist"], result[name[i]]["var_99_hist"], result[name[i]]["var_95_MC"], result[name[i]]["var_99_MC"], result[name[i]]["var_95_analytical"], result[name[i]]["var_99_analytical"], result[name[i]]["ES_95_hist"], result[name[i]]["ES_99_hist"], result[name[i]]["ES_95_MC"], result[name[i]]["ES_99_MC"], result[name[i]]["mean"], result[name[i]]["sample_std"], result[name[i]]["skew"], result[name[i]]["kurt"], result[name[i]]["annualized_return"], result[name[i]]["sharpe_ratio"], result[name[i]]["m_squared"], result[name[i]]["beta"], result[name[i]]["treynor_ratio"], result[name[i]]["information_ratio"], result[name[i]]["sortino_ratio"], result[name[i]]["pure_downside_risk"], result[name[i]]["downside_risk"], result[name[i]]["jensen_alpha"], result[name[i]]["corr"], result[name[i]]["t_stats"]);
			result[name[i]]["NAV"] = price_[i][m_ - 1];
			result[name[i]]["expense"] = Asset[i].get_expense();
			result[name[i]]["MC Max"] = Asset[i].get_MCMax();
			result[name[i]]["MC Min"] = Asset[i].get_MCMin();
			vector<double> portfolio_ret;
		}

		for (int i = 0; i < n_; i++)
		{
			sigma.push_back(Asset[i].get_sigma());
		}

		n = n_;
		m = m_;
		ret = ret_;
		price = price_;
		fee = fee_;
		rf = rf_;
	}

	int get_n();
	int get_m();
	vector<vector<double>> get_ret();
	vector<vector<double>> get_price();
	vector<vector<double>> get_fee();

	double risk_VaR(vector<double> &pl, double percentile, double &ES);
	void historical_VaR();
	void MC_VaR();
	void analytical_VaR();
	void get_expense();
	void get_position();
	void get_market_value();
	double get_first_sum();
	double get_last_sum();
	map<string, double> get_weights();
	string get_first();
	string get_last();
	map<string, map<string, double>> get_result();
	map<string, map<string, double>> get_corr();
	vector<string> get_name();
	void get_statistics();
	void minrisk_weights();
};

#endif
