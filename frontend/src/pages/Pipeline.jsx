import React, { useState } from "react";
import axios from "axios";
import { usePipelineContext } from "./context/PipelineContext";

const Pipeline = () => {
  const {
    formState,
    setFormState,
    pipelineMeta,
    setPipelineMeta
  } = usePipelineContext();

  const [logTimer, setLogTimer] = useState(null);

  const {
    file,
    accountValue,
    maxShares,
    rebalanceWindow,
    validationWindow,
    trainStart,
    trainEnd,
    tradeStart,
    tradeEnd,
    models,
    modelConfigs
  } = formState;

  const { logs, runFolder, plotList, loading } = pipelineMeta;

  const availableModels = ["A2C", "PPO", "DDPG", "SAC", "TD3"];

  const isFormValid =
    trainStart && trainEnd && tradeStart && tradeEnd &&
    models.length > 0 && rebalanceWindow > 0 && validationWindow > 0;

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setPipelineMeta(prev => ({ ...prev, logs: "❌ ERROR: Please select a file to upload.\n" }));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      // await axios.post("http://127.0.0.1:8000/upload-tickers", formData);
      // await axios.post("http://0.0.0.0:8000/upload-tickers", formData);
      await axios.post("http://82.180.160.15/upload-tickers", formData);
      setPipelineMeta(prev => ({
        ...prev,
        logs: prev.logs + `📂 Uploaded file: ${file.name}\n`
      }));
    } catch (err) {
      console.error("Upload error:", err);
      setPipelineMeta(prev => ({
        ...prev,
        logs: prev.logs + "\n❌ ERROR: Failed to upload file."
      }));
    }
  };

  const fetchLogs = async () => {
    try {
      // const response = await axios.get("http://127.0.0.1:8000/logs");
      const response = await axios.get("http://82.180.160.15/logs");
      // const response = await axios.get("http://0.0.0.0:8000/logs");
      
      setPipelineMeta(prev => ({ ...prev, logs: response.data }));
    } catch (error) {
      setPipelineMeta(prev => ({
        ...prev,
        logs: "❌ ERROR: Could not fetch logs.\n" + error.message
      }));
    }
  };

  const startLogStreaming = () => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    setLogTimer(interval);
  };

  const stopLogStreaming = () => {
    if (logTimer) clearInterval(logTimer);
  };

  const fetchPlots = async () => {
    try {
      // const response = await axios.get("http://127.0.0.1:8000/plot-list");
      // const response = await axios.get("http://0.0.0.0:8000/plot-list");
      const response = await axios.get("http://82.180.160.15/plot-list");
      
      setPipelineMeta(prev => ({
        ...prev,
        plotList: response.data.plots,
        runFolder: response.data.run
      }));
    } catch (err) {
      console.error(err);
      setPipelineMeta(prev => ({
        ...prev,
        logs: prev.logs + "\n❌ Failed to fetch plots."
      }));
    }
  };

  const handleRunPipeline = async () => {
    if (!isFormValid) {
      setPipelineMeta(prev => ({ ...prev, logs: "❌ ERROR: Please complete all required fields.\n" }));
      return;
    }

    const ts = new Date(trainStart), te = new Date(trainEnd);
    const ds = new Date(tradeStart), de = new Date(tradeEnd);
    if (!(ts < te && te < ds && ds < de)) {
      setPipelineMeta(prev => ({ ...prev, logs: "❌ ERROR: Invalid date sequence.\n" }));
      return;
    }

    setPipelineMeta(prev => ({ ...prev, loading: true, logs: "🚀 Pipeline started...\n" }));
    startLogStreaming();

    try {
      const formData = new FormData();
      formData.append("rebalance_window", rebalanceWindow);
      formData.append("validation_window", validationWindow);
      formData.append("train_start", trainStart);
      formData.append("train_end", trainEnd);
      formData.append("trade_start", tradeStart);
      formData.append("trade_end", tradeEnd);
      formData.append("models", JSON.stringify(models));

      const selectedConfigs = {};
      models.forEach((model) => {
        selectedConfigs[model + "_model_kwargs"] = modelConfigs[model];
      });
      formData.append("model_configs", JSON.stringify(selectedConfigs));

      // const response = await axios.post("http://127.0.0.1:8000/run-pipeline", formData);
      const response = await axios.post("http://82.180.160.15/run-pipeline", formData);
      // const response = await axios.post("http://0.0.0.0:8000/run-pipeline", formData);
      
      setPipelineMeta(prev => ({
        ...prev,
        logs: prev.logs + `✅ ${response.data.status}\n📁 Results saved to: ${response.data.run_folder}\n`,
        runFolder: response.data.run_folder.split("/").pop()
      }));

      await fetchPlots();
    } catch (error) {
      console.error("Pipeline error:", error);
      setPipelineMeta(prev => ({
        ...prev,
        logs: prev.logs + "\n❌ ERROR: Something went wrong during training."
      }));
    } finally {
      stopLogStreaming();
      setPipelineMeta(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDownload = () => {
    // const zipUrl = `http://127.0.0.1:8000/runs/${runFolder}.zip`;
    const zipUrl = `http://82.180.160.15/runs/${runFolder}.zip`;
    // const zipUrl = `http://0.0.0.0:8000/runs/${runFolder}.zip`;
    
    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = `${runFolder}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>⚙️ Select the Training and Trading Time Periods</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFormState(prev => ({ ...prev, file: e.target.files[0] }))} />
        <button type="submit">Upload</button>
      </form>

      <label>Account Value:
        <input type="number" value={accountValue} onChange={(e) => setFormState(prev => ({ ...prev, accountValue: Number(e.target.value) }))} />
      </label>

      <label>Max Shares:
        <input type="number" value={maxShares} onChange={(e) => setFormState(prev => ({ ...prev, maxShares: Number(e.target.value) }))} />
      </label>

      <label>Rebalance Window:
        <input type="number" value={rebalanceWindow} onChange={(e) => setFormState(prev => ({ ...prev, rebalanceWindow: Number(e.target.value) }))} />
      </label>

      <label>Validation Window:
        <input type="number" value={validationWindow} onChange={(e) => setFormState(prev => ({ ...prev, validationWindow: Number(e.target.value) }))} />
      </label>

      <label>Train Start:
        <input type="date" value={trainStart} onChange={(e) => setFormState(prev => ({ ...prev, trainStart: e.target.value }))} />
      </label>

      <label>Train End:
        <input type="date" value={trainEnd} onChange={(e) => setFormState(prev => ({ ...prev, trainEnd: e.target.value }))} />
      </label>

      <label>Trade Start:
        <input type="date" value={tradeStart} onChange={(e) => setFormState(prev => ({ ...prev, tradeStart: e.target.value }))} />
      </label>

      <label>Trade End:
        <input type="date" value={tradeEnd} onChange={(e) => setFormState(prev => ({ ...prev, tradeEnd: e.target.value }))} />
      </label>

      <h2>Select Models:</h2>
      {availableModels.map((model) => (
        <label key={model} style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            value={model}
            checked={models.includes(model)}
            onChange={(e) => {
              const updated = e.target.checked
                ? [...models, model]
                : models.filter((m) => m !== model);
              setFormState(prev => ({ ...prev, models: updated }));
            }}
          />
          {model}
        </label>
      ))}

      {models.map((model) => (
        <div key={model} style={{ marginTop: "20px", border: "1px solid #ccc", padding: "12px", borderRadius: "8px" }}>
          <h3>{model} Parameters</h3>
          {Object.entries(modelConfigs[model]).map(([param, val]) => (
            <label key={param} style={{ display: "block", marginBottom: "6px" }}>
              {param}:
              <input
                type="text"
                value={val}
                onChange={(e) => {
                  const updated = {
                    ...modelConfigs,
                    [model]: {
                      ...modelConfigs[model],
                      [param]: e.target.value
                    }
                  };
                  setFormState(prev => ({ ...prev, modelConfigs: updated }));
                }}
              />
            </label>
          ))}
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleRunPipeline} disabled={loading || !isFormValid}>
          {loading ? "⏳ Running..." : "🚀 Run Pipeline"}
        </button>
        {runFolder && plotList.length > 0 && (
          <a
            // href={`http://127.0.0.1:8000/download-zip/${runFolder}.zip`}
            // href={`http://0.0.0.0:8000/download-zip/${runFolder}.zip`}
            href={`http://82.180.160.15/download-zip/${runFolder}.zip`}
            
            download={`${runFolder}.zip`}
            style={{ marginLeft: "10px", textDecoration: "none" }}
          >
            <button>📦 Download ZIP</button>
          </a>

        )}
      </div>


      {!isFormValid && !loading && (
        <p style={{ color: "red" }}>⚠️ Please complete all required fields before running the pipeline.</p>
      )}

      <h2>📋 Log Output:</h2>
      <textarea readOnly value={logs} rows="15" style={{ width: "100%", fontFamily: "monospace" }} />

      {plotList.length > 0 && (
        <div>
          <h2>📊 Output Plots</h2>
          {plotList.map((img, idx) => (
            <div key={idx} style={{ marginBottom: "20px" }}>
              <p><strong>{img}</strong></p>
              <img
                // src={`http://127.0.0.1:8000/plot-image?run=${runFolder}&filename=${img}`}
                // src={`http://0.0.0.0:8000/plot-image?run=${runFolder}&filename=${img}`}
                src={`http://82.180.160.15/plot-image?run=${runFolder}&filename=${img}`}
                
                alt={img}
                style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pipeline;