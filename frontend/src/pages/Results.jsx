import React, { useEffect, useState } from "react";
import axios from "axios";

const Results = () => {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    // axios.get("http://127.0.0.1:8000/runs/list")
    // axios.get("http://0.0.0.0:8000/runs/list")
    axios.get("http://82.180.160.15/runs/list")
    
      .then((response) => setRuns(response.data.runs))
      .catch((error) => console.error("Error fetching runs:", error));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📁 All Past Run Results</h1>
      {runs.length === 0 ? (
        <p>No runs found.</p>
      ) : (
        <ul>
          {runs.map((run, idx) => (
            <li key={idx}>
              <strong>{run}</strong> — 
              <a
                href={`http://82.180.160.15/download-zip/${run}.zip`}
                // href={`http://0.0.0.0:8000/download-zip/${run}.zip`}
                
                download
                style={{ marginLeft: "10px", textDecoration: "underline", color: "blue" }}
              >
                Download ZIP
              </a>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;
