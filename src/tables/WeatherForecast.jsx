import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import api from "../axiosConfig";  // Asegúrate de configurar correctamente la instancia de axios

const WeatherForecast = () => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetchWeatherForecast();
  }, []);

  const fetchWeatherForecast = async () => {
    try {
      const response = await api.get("https://localhost:7192/WeatherForecast");
      setForecast(response.data);
    } catch (error) {
      console.error("Error al obtener la previsión del tiempo:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Previsión del Tiempo</Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: '#fae5c6' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Temperatura (°C)</TableCell>
              <TableCell>Temperatura (°F)</TableCell>
              <TableCell>Resumen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forecast.length > 0 ? (
              forecast.map((weather, index) => (
                <TableRow key={index}>
                  <TableCell>{weather.date}</TableCell>
                  <TableCell>{weather.temperatureC}</TableCell>
                  <TableCell>{weather.temperatureF}</TableCell>
                  <TableCell>{weather.summary}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default WeatherForecast;
