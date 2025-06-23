#include "test.hpp"
#include <napi.h>
#include <hello.hpp>
#include <boost/align.hpp>

using namespace Napi;

namespace Test
{
  Napi::String Method(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    return Napi::String::New(env, "world");
  }

  Napi::Value Factorial(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || info.Length() > 1)
    {
      Napi::TypeError::New(env, "Wrong number of arguments")
          .ThrowAsJavaScriptException();
      return env.Null();
    }

    if (!info[0].IsNumber())
    {
      Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
      return env.Null();
    }

    int arg0 = info[0].As<Napi::Number>().Int64Value();
    boost::multiprecision::cpp_int value = hello::factorial(arg0);
    double result = static_cast<double>(value);

    return Napi::Number::New(env, result);
  }

  Napi::Object Init(Napi::Env env, Napi::Object exports)
  {
    exports.Set(Napi::String::New(env, "HelloWorld"),
                Napi::Function::New(env, Method));
    exports.Set(Napi::String::New(env, "factorial"), Napi::Function::New(env, Factorial));
    return exports;
  }
}
