#include <Statistics.h>
#include <napi.h>

using namespace Napi;
namespace utils
{
    bool isArrayOfOnlyNumbers(const Napi::Array &array)
    {
        size_t length = array.Length();

        for (size_t i = 0; i < length; i++)
        {
            Napi::Value element = array.Get(i);

            if (!element.IsNumber())
            {
                return false;
            }
        }
        return true;
    }

    std::vector<double> ArrayOfNumbersToVectorOfDoubles(const Napi::Array &array)
    {
        size_t length = array.Length();
        vector<double> result;

        for (size_t i = 0; i < length; i++)
        {
            Napi::Value element = array.Get(i);

            if (!element.IsNumber())
            {
                result.push_back(element.As<Napi::Number>().DoubleValue());
            }
        }
        return result;
    }
}

namespace Statistics_Bindings
{
    Napi::Number Beta(const Napi::CallbackInfo &info)
    {
        Napi::Env env = info.Env();

        if (info.Length() < 2 || info.Length() > 2)
        {
            Napi::TypeError::New(env, "Wrong number of arguments. Required 2 but got " + std::to_string(info.Length())).ThrowAsJavaScriptException();
        }

        if (!info[0].IsArray() || !info[1].IsArray())
        {
            Napi::TypeError::New(env, "All arguements must be arrays").ThrowAsJavaScriptException();
        }

        Napi::Array info0 = info[0].As<Napi::Array>();
        Napi::Array info1 = info[1].As<Napi::Array>();

        if (!utils::isArrayOfOnlyNumbers(info0) || !utils::isArrayOfOnlyNumbers(info1))
        {
            Napi::TypeError::New(env, "All arrays must contain numbers only").ThrowAsJavaScriptException();
        }

        std::vector<double> arg0 = utils::ArrayOfNumbersToVectorOfDoubles(info0);
        std::vector<double> arg1 = utils::ArrayOfNumbersToVectorOfDoubles(info1);
        
        double result = Statistics::Beta(arg0, arg1);

        return Napi::Number::New(env, result);
    }
}
