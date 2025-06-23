#include <napi.h>
#include "risk_metrics_bindings.hpp"
#include "test.hpp"


Napi::Object InitAll(Napi::Env env, Napi::Object exports){
    exports = Test::Init(env, exports);
    exports = RiskMetrics::Init(env, exports);
    return exports;
}

NODE_API_MODULE(addon, InitAll)