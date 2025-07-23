import { createContext, useContext, useState } from "react";

const PipelineContext = createContext();

export const PipelineProvider = ({ children }) => {
  const [formState, setFormState] = useState({
    file: null,
    accountValue: 1000000,
    maxShares: 1000,
    rebalanceWindow: 20,
    validationWindow: 20,
    trainStart: "",
    trainEnd: "",
    tradeStart: "",
    tradeEnd: "",
    models: [],
    modelConfigs: {
      A2C: { n_steps: 5, ent_coef: 0.005, learning_rate: 0.0007 },
      PPO: { batch_size: 64, learning_rate: 0.00025, ent_coef: 0.005 },
      DDPG: { buffer_size: 10000, learning_rate: 0.0005, batch_size: 64 },
      SAC: { batch_size: 256, buffer_size: 10000, learning_rate: 0.00003, ent_coef: "auto" },
      TD3: { buffer_size: 10000, learning_rate: 0.0003, batch_size: 256 },
    },
  });

  const [pipelineMeta, setPipelineMeta] = useState({
    logs: "",
    runFolder: "",
    plotList: [],
    loading: false,
    hasDownloaded: false  // ✅ for tracking ZIP download visibility
  });

  return (
    <PipelineContext.Provider value={{ formState, setFormState, pipelineMeta, setPipelineMeta }}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipelineContext = () => useContext(PipelineContext);
