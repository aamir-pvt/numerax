import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 18px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const StepsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const StepItem = styled.li`
  font-size: 16px;
  margin-bottom: 8px;
  padding: 10px;
  border-left: 5px solid blue;
  background-color: #f4f4f4;
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: gray;
`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  // const API_URL = "http://127.0.0.1:8000/dashboard"; // FastAPI backend
  // const API_URL = "http://0.0.0.0:8000/dashboard"; // FastAPI backend
  const API_URL = "http://82.180.160.15/dashboard"; // FastAPI backend

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => setDashboardData(response.data))
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  return (
    <Container>
      {dashboardData ? (
        <>
          <Title>{dashboardData.title}</Title>
          <Description>{dashboardData.description}</Description>
          <h2>Steps to Get Started:</h2>
          <StepsList>
            {dashboardData.steps.map((step, index) => (
              <StepItem key={index}>✅ {step}</StepItem>
            ))}
          </StepsList>
        </>
      ) : (
        <LoadingText>Loading...</LoadingText>
      )}
    </Container>
  );
};

export default Dashboard;
