import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; 

const FlujoCompleto = () => {
  const [flujoData, setFlujoData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    idCliente: 0,
    idSucursal: 0,
    idMesa: 0,
    metodoPago: "Efectivo",
    nit: "",
    detalles: [{ idProducto: 0, cantidad: 0 }]
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchFlujoData();
  }, []);

  const fetchFlujoData = async () => {
    try {
      const response = await api.get("/flujo-completo/datos-iniciales");
      setFlujoData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos iniciales:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("detalles")) {
      const [index, field] = name.split(".");
      const newDetails = [...formData.detalles];
      newDetails[index][field] = value;
      setFormData((prevData) => ({
        ...prevData,
        detalles: newDetails
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleAddFlujo = async () => {
    try {
      const response = await api.post("/flujo-completo", formData);
      console.log("Flujo añadido:", response.data);
      fetchFlujoData(); // Recargar los datos
      setOpenDialog(false); // Cerrar el dialogo
    } catch (error) {
      console.error("Error al añadir flujo:", error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      idCliente: 0,
      idSucursal: 0,
      idMesa: 0,
      metodoPago: "Efectivo",
      nit: "",
      detalles: [{ idProducto: 0, cantidad: 0 }]
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Flujo Completo</Typography>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        sx={{
          backgroundColor: '#7b4d0a', 
          color: 'white', 
          marginBottom: '20px'
        }}
      >
        Añadir Flujo
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: '#fae5c6' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Cliente</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>ID Mesa</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>NIT</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flujoData.length > 0 ? (
              flujoData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.idCliente}</TableCell>
                  <TableCell>{item.idSucursal}</TableCell>
                  <TableCell>{item.idMesa}</TableCell>
                  <TableCell>{item.metodoPago}</TableCell>
                  <TableCell>{item.nit}</TableCell>
                  <TableCell>
                    {item.detalles.map((detalle, idx) => (
                      <div key={idx}>
                        Producto ID: {detalle.idProducto}, Cantidad: {detalle.cantidad}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay flujos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Añadir Flujo Completo</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Cliente"
            fullWidth
            name="idCliente"
            value={formData.idCliente}
            onChange={handleFormChange}
          />
          <TextField
            label="ID Sucursal"
            fullWidth
            name="idSucursal"
            value={formData.idSucursal}
            onChange={handleFormChange}
          />
          <TextField
            label="ID Mesa"
            fullWidth
            name="idMesa"
            value={formData.idMesa}
            onChange={handleFormChange}
          />
          <TextField
            label="Método de Pago"
            fullWidth
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleFormChange}
          />
          <TextField
            label="NIT"
            fullWidth
            name="nit"
            value={formData.nit}
            onChange={handleFormChange}
          />
          <div>
            <Typography variant="h6">Detalles de los Productos</Typography>
            {formData.detalles.map((detalle, index) => (
              <div key={index}>
                <TextField
                  label={`ID Producto ${index + 1}`}
                  fullWidth
                  name={`detalles.${index}.idProducto`}
                  value={detalle.idProducto}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label={`Cantidad ${index + 1}`}
                  fullWidth
                  name={`detalles.${index}.cantidad`}
                  value={detalle.cantidad}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 2 }}
                />
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#7b4d0a', color: 'white' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddFlujo}
            variant="contained"
            sx={{
              backgroundColor: '#7b4d0a', 
              color: 'white'
            }}
          >
            Añadir Flujo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FlujoCompleto;
