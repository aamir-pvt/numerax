#include <vector>
#include <algorithm>
#include <iostream>
#include <numeric>
#include "Statistics.h"
#include <math.h>

using namespace std;

namespace Statistics
{
	double Beta(vector<double> &x, vector<double> &y)
	{

		int n = x.size();

		vector<double>::iterator itr_x;
		vector<double>::iterator itr_y = y.begin();
		double sum_x = 0.0;
		for (itr_x = x.begin(); itr_x != x.end(); itr_x++)
		{
			sum_x = sum_x + *itr_x;
		}
		double sum_y = 0.0;
		for (itr_y = y.begin(); itr_y != y.end(); itr_y++)
		{
			sum_y = sum_y + *itr_y;
		}
		double m_x = sum_x / x.size();
		double m_y = sum_y / y.size();
		vector<double>::iterator itr_yy = y.begin();
		double sum = 0.0;
		for (itr_x = x.begin(); itr_x != x.end(); itr_x++)
		{
			sum = sum + (*itr_x - m_x) * (*itr_yy - m_y);
			itr_yy++;
		}
		double covariance = sum / (n - 1);
		double var = 0.0;
		for (itr_x = x.begin(); itr_x != x.end(); itr_x++)
		{
			var = sum + (*itr_x - m_x) * (*itr_x - m_x);
		}
		double variance = var / (n - 1);
		double temp = covariance / variance;
		return temp;
	}

	double Correlation(vector<double> x, vector<double> y)
	{
		int n = x.size();
		double sum_x = 0.0;
		double sum_y = 0.0;
		double sum_xy = 0.0;
		double sqsum_x = 0.0;
		double sqsum_y = 0.0;
		vector<double>::iterator itr_x;
		vector<double>::iterator itr_y = y.begin();
		for (itr_x = x.begin(); itr_x != x.end(); itr_x++)
		{
			sum_x = sum_x + *itr_x;
			sum_y = sum_y + *itr_y;
			sum_xy = sum_xy + *itr_x * *itr_y;
			sqsum_x = sqsum_x + *itr_x * *itr_x;
			sqsum_y = sqsum_y + *itr_y * *itr_y;
			itr_y++;
		}
		double temp1 = n * sum_xy - sum_x * sum_y;
		double temp3 = n * sqsum_x - sum_x * sum_x;
		double temp4 = n * sqsum_y - sum_y * sum_y;
		double temp5 = temp3 * temp4;
		double temp2 = sqrt(temp5);
		double corr = temp1 / temp2;
		return corr;
	}

	double Mean(vector<double> vec_ret)
	{
		vec_ret.erase(vec_ret.begin());
		double sum = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			sum += vec_ret[i];
		}
		return sum / vec_ret.size();
	}

	double Std(vector<double> vec_ret)
	{
		vec_ret.erase(vec_ret.begin());
		double mean = Mean(vec_ret);

		double sum = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			sum += pow(vec_ret[i] - mean, 2);
		}

		return sqrt(sum / (vec_ret.size() - 1));
	}

	double Skewness(vector<double> vec_ret)
	{
		vec_ret.erase(vec_ret.begin());
		double mean = Mean(vec_ret);
		double sigma = Std(vec_ret);
		double temp = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			temp += pow((vec_ret[i] - mean) / sigma, 3);
		}
		temp = temp * vec_ret.size() / ((vec_ret.size() - 1) * (vec_ret.size() - 2));
		return temp;
	}

	double Kurtosis(vector<double> vec_ret)
	{
		vec_ret.erase(vec_ret.begin());
		double mean = Mean(vec_ret);
		double sigma = Std(vec_ret);
		double n = vec_ret.size();
		double temp = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			temp += pow((vec_ret[i] - mean) / sigma, 4);
		}
		temp = n * (n + 1) / (n - 1) / (n - 2) / (n - 3) * temp - 3 * (n - 1) * (n - 1) / (n - 2) / (n - 3);
		return temp;
	}

	double Annualized_Return(vector<double> vec_ret, int position_sign)
	{
		vec_ret.erase(vec_ret.begin());
		double temp = 1 + position_sign * vec_ret[0];

		for (int i = 1; i < vec_ret.size(); i++)
		{
			temp *= (1 + position_sign * vec_ret[i]);
		}

		temp = position_sign * (pow(temp, 252.0 / vec_ret.size()) - 1);
		return temp;
	}

	double Maxdrawdown(vector<double> vec_ret)
	{
		vec_ret.erase(vec_ret.begin());
		double drawdown_max = 0;
		double product = 1.0;
		vector<double> vec;
		vec.push_back(product);

		for (int i = 0; i < vec_ret.size(); i++)
		{
			product = product * (1 + vec_ret[i]);
			vec.push_back(product);
		}

		for (int i = 0; i < vec.size(); i++)
		{
			for (int j = i; j < vec.size(); j++)
			{
				double drawdown = (vec[i] - vec[j]) / vec[i];
				drawdown_max = max(drawdown_max, drawdown);
			}
		}

		return drawdown_max;
	}

	double Sharpe_Ratio(vector<double> vec_ret, double rf, int position_sign)
	{
		vec_ret.erase(vec_ret.begin());
		double temp = (Annualized_Return(vec_ret, position_sign) - rf) / sqrt(252) / Std(vec_ret);
		return temp;
	}

	double M_Squared(vector<double> vec_ret, double rf, vector<double> benchmark, int position_sign)
	{
		vector<double> bmk_ret;
		for (int i = 1; i < benchmark.size(); i++)
		{
			bmk_ret.push_back(benchmark[i] / benchmark[i - 1] - 1);
		}
		double m_squared = Sharpe_Ratio(vec_ret, rf, position_sign) * Std(bmk_ret) + rf;
		return m_squared;
	}

	double Treynor_Ratio(vector<double> vec_ret, double rf, vector<double> market, int position_sign)
	{
		vec_ret.erase(vec_ret.begin());
		vector<double> mkt_ret;
		for (int i = 1; i < market.size(); i++)
		{
			mkt_ret.push_back(market[i] / market[i - 1] - 1);
		}

		double temp = (Annualized_Return(vec_ret, position_sign) - rf) / Beta(mkt_ret, vec_ret);
		return temp;
	}

	double Information_Ratio(vector<double> vec_ret, vector<double> benchmark, int position_sign)
	{
		vec_ret.erase(vec_ret.begin());
		vector<double> bmk_ret;
		for (int i = 1; i < benchmark.size(); i++)
		{
			bmk_ret.push_back(benchmark[i] / benchmark[i - 1] - 1);
		}

		vector<double> temp(vec_ret.size());
		for (int i = 0; i < vec_ret.size(); i++)
		{
			temp[i] = vec_ret[i] - bmk_ret[i];
		}
		return (Annualized_Return(vec_ret, position_sign) - Annualized_Return(bmk_ret)) / Std(temp);
	}

	double Sortino_Ratio(vector<double> vec_ret, double MAR)
	{
		vec_ret.erase(vec_ret.begin());
		double sum = 0;
		int count = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			if (vec_ret[i] < MAR / 252)
			{
				sum += pow((vec_ret[i] - MAR / 252), 2);
				count++;
			}
		}
		double temp = sqrt(sum / count);
		return (Mean(vec_ret) - (MAR / 252)) / temp;
	}

	double Pure_Downside_Risk(vector<double> vec_ret)
	{
		vec_ret.erase(vec_ret.begin());
		double sum = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			sum += pow(min(vec_ret[i], 0.0), 2) / vec_ret.size();
		}
		return sqrt(sum);
	}

	double Downside_Risk(vector<double> vec_ret, double rt)
	{
		vec_ret.erase(vec_ret.begin());
		double sum = 0;
		for (int i = 0; i < vec_ret.size(); i++)
		{
			sum += pow(min(vec_ret[i] - rt / 252, 0.0), 2) / vec_ret.size();
		}
		return sqrt(sum);
	}

	double Jensen_Alpha(vector<double> vec_ret, vector<double> market, double rf, int position_sign)
	{
		vec_ret.erase(vec_ret.begin());
		vector<double> mkt_ret;

		for (int i = 1; i < market.size(); i++)
		{
			mkt_ret.push_back(market[i] / market[i - 1] - 1);
		}

		double temp = (Annualized_Return(vec_ret, position_sign) - (rf + (Beta(mkt_ret, vec_ret)) * (Annualized_Return(mkt_ret) - rf)));
		return temp;
	}

	double Corr(vector<double> vec_ret, vector<double> market)
	{
		double sum_X = 0, sum_Y = 0, sum_XY = 0;
		double squareSum_X = 0, squareSum_Y = 0;
		int n = vec_ret.size();

		for (int i = 0; i < n; i++)
		{
			// sum of elements of array X.
			sum_X = sum_X + vec_ret[i];

			// sum of elements of array Y.
			sum_Y = sum_Y + market[i];

			// sum of X[i] * Y[i].
			sum_XY = sum_XY + vec_ret[i] * market[i];

			// sum of square of array elements.
			squareSum_X = squareSum_X + vec_ret[i] * vec_ret[i];
			squareSum_Y = squareSum_Y + market[i] * market[i];
		}

		// use formula for calculating correlation coefficient.
		double corr = (n * sum_XY - sum_X * sum_Y) / sqrt((n * squareSum_X - sum_X * sum_X) * (n * squareSum_Y - sum_Y * sum_Y));

		return corr;
	}

	double T_Stats(vector<double> vec_ret, vector<double> market)
	{
		double r = Corr(vec_ret, market);
		int n = vec_ret.size();

		return r * pow(n - 2, 0.5) / pow((1 - pow(r, 2)), 0.5);
	}
}