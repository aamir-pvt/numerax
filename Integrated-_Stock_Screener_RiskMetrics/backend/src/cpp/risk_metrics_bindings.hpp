#pragma once
#include <napi.h>

using namespace Napi;

namespace RiskMetrics{
    extern Napi::Value Stocks(const Napi::CallbackInfo &info);
    extern Napi::Object Init(Napi::Env env, Napi::Object exports);
}