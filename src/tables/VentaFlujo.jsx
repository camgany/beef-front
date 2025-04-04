import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import api from "../axiosConfig"; // Asegúrate de que tu configuración de axios esté correcta

const VentaFlujo = () => {
  const [ventasData, setVentasData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    idCliente: 0,
    idSucursal: 0,
    detalles: [{ idProducto: 0, cantidad: 0 }],
    idMetodoPago: 0,
    nit: ""
  });
  const [metodosPago, setMetodosPago] = useState([]);

  // Cargar los datos iniciales (Métodos de pago, etc.)
  useEffect(() => {
    fetchVentasData();
    fetchMetodosPago();
  }, []);

  const fetchVentasData = async () => {
    try {
      const response = await api.get("/flujo/datos-iniciales");
      setVentasData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos iniciales de ventas:", error);
    }
  };

  const fetchMetodosPago = async () => {
    try {
      const response = await api.get("/metodos-pago");
      setMetodosPago(response.data); 
    } catch (error) {
      console.error("Error al obtener los métodos de pago:", error);
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

  const handleAddVenta = async () => {
    try {
      const response = await api.post("/ventas/flujo", formData);
      console.log("Venta añadida:", response.data);
      fetchVentasData(); // Recargar los datos
      setOpenDialog(false); // Cerrar el dialogo
    } catch (error) {
      console.error("Error al añadir venta:", error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      idCliente: 0,
      idSucursal: 0,
      detalles: [{ idProducto: 0, cantidad: 0 }],
      idMetodoPago: 0,
      nit: ""
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Flujo Completo de Venta</Typography>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        sx={{
          backgroundColor: '#7b4d0a', 
          color: 'white', 
          marginBottom: '20px'
        }}
      >
        Añadir Venta
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: '#fae5c6' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Cliente</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventasData.length > 0 ? (
              ventasData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.idCliente}</TableCell>
                  <TableCell>{item.idSucursal}</TableCell>
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
                <TableCell colSpan={3} align="center">No hay ventas disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Añadir Flujo Completo de Venta</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Cliente"
            fullWidth
            name="idCliente"
            value={formData.idCliente}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="ID Sucursal"
            fullWidth
            name="idSucursal"
            value={formData.idSucursal}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
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
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Método de Pago</InputLabel>
            <Select
              label="Método de Pago"
              name="idMetodoPago"
              value={formData.idMetodoPago}
              onChange={handleFormChange}
            >
              {metodosPago.map((metodo) => (
                <MenuItem key={metodo.id} value={metodo.id}>
                  {metodo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="NIT"
            fullWidth
            name="nit"
            value={formData.nit}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#7b4d0a', color: 'white' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddVenta}
            variant="contained"
            sx={{
              backgroundColor: '#7b4d0a', 
              color: 'white'
            }}
          >
            Añadir Venta
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VentaFlujo;
