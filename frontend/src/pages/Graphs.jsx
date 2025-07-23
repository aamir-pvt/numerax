import React, { useEffect, useState } from "react";
import axios from "axios";

const Graphs = () => {
  const [graphs, setGraphs] = useState(null);
  const [latestRun, setLatestRun] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch static graph descriptions
    // axios.get("http://127.0.0.1:8000/graphs")
    
    axios.get("http://82.180.160.15/graphs")
    // axios.get("http://0.0.0.0:8000/graphs")
      .then((response) => setGraphs(response.data))
      .catch((error) => {
        console.error("Error fetching graphs data:", error);
        setError("Failed to load static graphs.");
      });

    // Fetch latest-run plot list (like in pipeline)
    // axios.get("http://127.0.0.1:8000/plot-list")
    // axios.get("http://0.0.0.0:8000/plot-list")
    axios.get("http://82.180.160.15/plot-list")
      .then((response) => {
        if (response.data?.run && response.data?.plots?.length > 0) {
          setLatestRun({
            run: response.data.run,
            plots: response.data.plots
          });
        }
      })
      .catch(() => {
        setLatestRun(null);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Graphs Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ✅ Static graph examples */}
      {graphs ? (
        <div>
          {Object.entries(graphs).map(([key, graph]) => (
            <div key={key} style={styles.card}>
              <h2>{key.replace(/_/g, " ")}</h2>
              <p>{graph.description}</p>
              <img
                // src={`http://127.0.0.1:8000/graphs/${key}`}
                src={`http://82.180.160.15/graphs/${key}`}
                // src={`http://0.0.0.0:8000/graphs/${key}`}
                
                alt={key}
                style={styles.image}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading static graphs...</p>
      )}

      {/* ✅ Show latest run graphs only if they exist */}
      {latestRun?.plots?.length > 0 && (
        <div>
          <hr />
          <h2>🟢 Most Recent Run: {latestRun.run}</h2>
          {latestRun.plots.map((img, idx) => (
            <div key={idx} style={styles.card}>
              <p><strong>{img}</strong></p>
              <img
                // src={`http://127.0.0.1:8000/plot-image?run=${latestRun.run}&filename=${img}`}
                // src={`http://0.0.0.0:8000/plot-image?run=${latestRun.run}&filename=${img}`}
                src={`http://82.180.160.15/plot-image?run=${latestRun.run}&filename=${img}`}
                
                alt={img}
                style={styles.image}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  },
  image: {
    width: "100%",
    maxWidth: "600px",
    height: "auto",
    marginTop: "10px"
  }
};

export default Graphs;
