#include "risk_metrics_bindings.hpp"
#include <napi.h>
#include <sstream>
#include <string>
#include <unordered_map>
#include "Portfolio_Asset.h"

using namespace Napi;

namespace RiskMetrics
{

    extern Napi::Value Stocks(const Napi::CallbackInfo &info)
    {
        Napi::Env env = info.Env();

        /* Get information from javascript */
        if (info.Length() != 2)
        {
            std::ostringstream error;
            error << "Invalid number of arguemnts arguments expected 2 but got" << info.Length();
            Napi::TypeError::New(env, error.str()).ThrowAsJavaScriptException();
            return env.Undefined();
        }

        if (!info[0].IsArray() || !info[1].IsArray() || info[0].As<Napi::Array>().Length() == 0 || info[1].As<Napi::Array>().Length() == 0)
        {
            Napi::TypeError::New(env, "Each arguemnt must be an array and must not be empty").ThrowAsJavaScriptException();
            return env.Undefined();
        }

        Napi::Array arg0 = info[0].As<Napi::Array>();
        Napi::Array arg1 = info[1].As<Napi::Array>();

        /** parse to what c++ code can understand **/
        std::vector<std::string> input0;         // header(company ticker) input
        std::vector<std::vector<double>> input1; // prices input

        // parse first arguement (array of stocks and the market as strings)
        for (uint32_t i = 0; i < arg0.Length(); i++)
        {
            Napi::Value element = arg0.Get(i);
            if (!element.IsString())
            {
                Napi::TypeError::New(env, "Each element in arguement 0 must be a string").ThrowAsJavaScriptException();
                return env.Undefined();
            }
            input0.push_back(element.As<Napi::String>());
        }

        // parse second arguement (matrix of the prices)
        for (int i = 0; i < arg1.Length(); i++)
        {
            Napi::Value currentRow = arg1.Get(i);
            if (!currentRow.IsArray())
            {
                Napi::TypeError::New(env, "Each element in arguement 1 must be an array").ThrowAsJavaScriptException();
                return env.Undefined();
            }

            Napi::Array row = currentRow.As<Napi::Array>();
            std::vector<double> rowData;

            for (int j = 0; j < row.Length(); j++)
            {
                Napi::Value currentCell = row.Get(j);
                if (!currentCell.IsNumber())
                {
                    Napi::TypeError::New(env, "Each element in arguement 1 must be an array of numbers").ThrowAsJavaScriptException();
                    return env.Undefined();
                }
                rowData.push_back(currentCell.As<Napi::Number>().DoubleValue());
            }

            input1.push_back(rowData);
        }

        // check if the size of the argument 0 is the same as the number of columns in argument 1

        if (input0.size() != input1[0].size())
        {
            Napi::TypeError::New(env, "Size of arguments are incompatible").ThrowAsJavaScriptException();
            return env.Undefined();
        }

        // fee and positions input
        std::vector<std::vector<double>> input2;

        // make the position row field with 1's
        for (int i = 0; i < 1; i++)
        {
            std::vector<double> currRow;
            for (int j = 0; j < input0.size() - 1; j++)
            {
                currRow.push_back(1);
            }
            input2.push_back(currRow);
        }

        // fill rest of the information with 0
        for (int i = 0; i < 6; i++)
        {
            std::vector<double> currRow;
            for (int j = 0; j < input0.size(); j++)
            {
                currRow.push_back(0);
            }
            input2.push_back(currRow);
        }

        // pass into the portfolio
        portfolio stockPortfolio(input0, input1, input2, 1);

        // get result
        stockPortfolio.get_position();
        stockPortfolio.historical_VaR();
        stockPortfolio.MC_VaR();
        stockPortfolio.analytical_VaR();
        stockPortfolio.get_statistics();
        stockPortfolio.get_market_value();
        stockPortfolio.get_expense();
        stockPortfolio.minrisk_weights();

        std::map<std::string, std::map<std::string, double>> result = stockPortfolio.get_result();

        std::vector<std::string> result_names = stockPortfolio.get_name();

        // parse result into what Napi can understand
        Napi::Object result_object = Napi::Object::New(env);

        for (auto name : result_names)
        {
            Napi::Object stock_portfolio = Napi::Object::New(env);
            stock_portfolio.Set(Napi::String::New(env, "mean"), Napi::Number::New(env, result[name]["mean"]));
            stock_portfolio.Set(Napi::String::New(env, "sample_std"), Napi::Number::New(env, result[name]["sample_std"]));
            stock_portfolio.Set(Napi::String::New(env, "skew"), Napi::Number::New(env, result[name]["skew"]));
            stock_portfolio.Set(Napi::String::New(env, "kurt"), Napi::Number::New(env, result[name]["kurt"]));
            stock_portfolio.Set(Napi::String::New(env, "annualized_return"), Napi::Number::New(env, result[name]["annualized_return"]));
            stock_portfolio.Set(Napi::String::New(env, "m_squared"), Napi::Number::New(env, result[name]["m_squared"]));
            stock_portfolio.Set(Napi::String::New(env, "beta"), Napi::Number::New(env, result[name]["beta"]));
            stock_portfolio.Set(Napi::String::New(env, "t_stats"), Napi::Number::New(env, result[name]["t_stats"]));
            stock_portfolio.Set(Napi::String::New(env, "minrisk_weights"), Napi::Number::New(env, result[name]["minrisk_weights"]));

            result_object.Set(Napi::String::New(env, name), stock_portfolio);
        }

        return result_object;
    }
    Napi::Object Init(Napi::Env env, Napi::Object exports)
    {
        // Create Object to hold all RiskMetrics types e.g Stock, Bonds, ETF
        Napi::Object newObject = Napi::Object::New(env);
        newObject.Set(Napi::String::New(env, "Stocks"), Napi::Function::New(env, Stocks));

        // Set object to a property called RiskMetrics
        exports.Set(Napi::String::New(env, "RiskMetrics"), newObject);
        return exports;
    }
}
