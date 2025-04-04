import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; // Asegúrate de que esta importación sea correcta

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ nombre: "" });

  useEffect(() => {
    fetchSucursales();
  }, []);

  const fetchSucursales = async () => {
    try {
      const response = await api.get("/sucursales");
      setSucursales(response.data);
      console.log("Sucursales obtenidas:", response.data);  // Aquí está el console.log
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCrearSucursal = async () => {
    const { nombre } = formData;
    if (!nombre) {
      console.error("El nombre es requerido");
      return;
    }

    const sucursalData = { nombre };

    try {
      const response = await api.post("/sucursales", sucursalData);
      console.log("Sucursal creada:", response.data);
      fetchSucursales();  // Recargar la lista de sucursales
      setOpenDialog(false);  // Cierra el modal
    } catch (error) {
      console.error("Error al crear sucursal:", error.response?.data || error.message);
    }
  };

  const handleDesactivar = async (idSucursal) => {
    try {
      await api.put(`/sucursales/${idSucursal}/desactivar`);
      alert("Sucursal desactivada correctamente");
      fetchSucursales();  // Vuelve a obtener la lista de sucursales
    } catch (error) {
      console.error("Error al desactivar sucursal:", error);
      alert("No se pudo desactivar la sucursal");
    }
  };

  const handleOpenDialog = () => {
    setFormData({ nombre: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sucursales</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        style={{ marginBottom: "20px" }}
      >
        Añadir Sucursal
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sucursales.map((sucursal) => (
              <TableRow key={sucursal.idSucursal}>
                <TableCell>{sucursal.idSucursal}</TableCell>
                <TableCell>{sucursal.nombre}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDesactivar(sucursal.idSucursal)}
                  >
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Añadir Sucursal</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleCrearSucursal} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Sucursales;
