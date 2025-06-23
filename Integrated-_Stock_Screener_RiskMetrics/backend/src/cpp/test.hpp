#pragma once
#include <napi.h>

using namespace Napi;

namespace Test
{
    extern Napi::String Method(const Napi::CallbackInfo &info);
    extern Napi::Value Factorial(const Napi::CallbackInfo &info);
    extern Napi::Object Init(Napi::Env env, Napi::Object exports);
}