import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; // Asegúrate de que tu configuración de axios esté correcta

const FlujoCompletoCompra = () => {
  const [comprasData, setComprasData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    idProveedor: 0,
    idSucursal: 0,
    detalles: [{ idProducto: 0, cantidad: 0, precioUnitario: 0 }]
  });

  // Cargar los datos iniciales
  useEffect(() => {
    fetchComprasData();
  }, []);

  const fetchComprasData = async () => {
    try {
      const response = await api.get("/flujo/datos-iniciales");
      setComprasData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos iniciales de compras:", error);
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

  const handleAddCompra = async () => {
    try {
      const response = await api.post("/compras/flujo", formData);
      console.log("Compra añadida:", response.data);
      fetchComprasData(); 
      setOpenDialog(false); 
    } catch (error) {
      console.error("Error al añadir compra:", error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      idProveedor: 0,
      idSucursal: 0,
      detalles: [{ idProducto: 0, cantidad: 0, precioUnitario: 0 }]
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Flujo Completo de Compra</Typography>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        sx={{
          backgroundColor: '#7b4d0a', 
          color: 'white', 
          marginBottom: '20px'
        }}
      >
        Añadir Compra
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: '#fae5c6' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Proveedor</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comprasData.length > 0 ? (
              comprasData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.idProveedor}</TableCell>
                  <TableCell>{item.idSucursal}</TableCell>
                  <TableCell>
                    {item.detalles.map((detalle, idx) => (
                      <div key={idx}>
                        Producto ID: {detalle.idProducto}, Cantidad: {detalle.cantidad}, Precio Unitario: {detalle.precioUnitario}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No hay compras disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Añadir Flujo Completo de Compra</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Proveedor"
            fullWidth
            name="idProveedor"
            value={formData.idProveedor}
            onChange={handleFormChange}
          />
          <TextField
            label="ID Sucursal"
            fullWidth
            name="idSucursal"
            value={formData.idSucursal}
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
                <TextField
                  label={`Precio Unitario ${index + 1}`}
                  fullWidth
                  name={`detalles.${index}.precioUnitario`}
                  value={detalle.precioUnitario}
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
            onClick={handleAddCompra}
            variant="contained"
            sx={{
              backgroundColor: '#7b4d0a', 
              color: 'white'
            }}
          >
            Añadir Compra
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FlujoCompletoCompra;
