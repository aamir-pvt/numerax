export const bindings: Bindings = require("../../build/ReportAnalysisNumeraxial.node");

interface Bindings {
    HelloWorld(word: string): string;
    factorial(num: number): number;
    RiskMetrics: RiskMetrics;
}

interface RiskMetrics {
    Stocks<T extends string[]>(tickers: T, prices: number[][]): Portfolio<T>;
}

type Portfolio<T extends string[]> = {
    [key in T[number]]: {
        mean: number;
        sample_std: number;
        skew: number;
        kurt: number;
        annualized_return: number;
        m_squared: number;
        beta: number;
        t_stats: number;
        minrisk_weights: number;
    };
};

export function testBindings() {
    console.log(bindings.HelloWorld("hello"));
    console.log(bindings.factorial(6));

    console.log(
        bindings.RiskMetrics.Stocks(
            ["META", "TSL", "market"],
            [
                [123, 123, 234],
                [4322, 52398, 52],
                [1234, 45232, 234],
                [153, 223, 2342],
                [232, 213, 23522],
                [2312, 2342, 234234]
            ]
        )
    );
}
