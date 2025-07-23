import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Graphs from "./pages/Graphs";
import Pipeline from "./pages/Pipeline";
import Results from "./pages/Results";
import { PipelineProvider } from "./pages/context/PipelineContext"; // adjust if needed

const App = () => {
  return (
    <PipelineProvider>
      <Router>
        <div>
          {/* ✅ Navigation Menu */}
          <nav style={styles.navbar}>
            <Link to="/" style={styles.link}>Dashboard</Link>
            <Link to="/graphs" style={styles.link}>Graphs</Link>
            <Link to="/pipeline" style={styles.link}>Pipeline</Link>
            <Link to="/results" style={styles.link}>Results</Link>
          </nav>

          {/* ✅ Route Definitions */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </PipelineProvider>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    backgroundColor: "#333",
    color: "white"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px"
  }
};

export default App;
