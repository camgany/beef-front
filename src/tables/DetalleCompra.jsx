import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; 

const DetalleCompra = () => {
  const [detalleCompras, setDetalleCompras] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    idCompra: 0,
    idProducto: 0,
    cantidad: 0,
    precioUnitario: 0,
    estado: true
  });
  const [editIdDetalleCompra, setEditIdDetalleCompra] = useState(null);

  useEffect(() => {
    fetchDetalleCompras();
  }, []);

  const fetchDetalleCompras = async () => {
    try {
      const response = await api.get("/detallecompra");
      setDetalleCompras(response.data);
      console.log("Detalle de Compras obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener detalles de compras:", error);
    }
  };

  const handleEdit = (idDetalleCompra, detalleCompraData) => {
    setEditMode(true);
    setEditIdDetalleCompra(idDetalleCompra);
    setFormData(detalleCompraData);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setEditIdDetalleCompra(null);
    setFormData({
      idCompra: 0,
      idProducto: 0,
      cantidad: 0,
      precioUnitario: 0,
      estado: true
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`/detallecompra/${editIdDetalleCompra}`, formData);
        alert("Detalle de compra actualizado correctamente");
      } else {
        await api.post("/detallecompra", formData);
        alert("Detalle de compra creado correctamente");
      }
      fetchDetalleCompras(); 
      setOpenDialog(false); 
    } catch (error) {
      console.error("Error al guardar detalle de compra:", error);
      alert("No se pudo guardar el detalle de compra");
    }
  };

  const handleDesactivar = async (idDetalleCompra) => {
    try {
      await api.put(`/detallecompra/${idDetalleCompra}/desactivar`);
      alert("Detalle de compra desactivado correctamente");
      fetchDetalleCompras(); 
    } catch (error) {
      console.error("Error al desactivar detalle de compra:", error);
      alert("No se pudo desactivar el detalle de compra");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "estado" ? value === "true" : value
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Detalle de Compras</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        style={{ marginBottom: "20px" }}
      >
        Añadir Detalle de Compra
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Compra ID</TableCell>
              <TableCell>Producto ID</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalleCompras.map((detalleCompra) => (
              <TableRow key={detalleCompra.idDetalleCompra}>
                <TableCell>{detalleCompra.idDetalleCompra}</TableCell>
                <TableCell>{detalleCompra.idCompra}</TableCell>
                <TableCell>{detalleCompra.idProducto}</TableCell>
                <TableCell>{detalleCompra.cantidad}</TableCell>
                <TableCell>{detalleCompra.precioUnitario}</TableCell>
                <TableCell>{detalleCompra.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(detalleCompra.idDetalleCompra, detalleCompra)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDesactivar(detalleCompra.idDetalleCompra)}
                    style={{ marginLeft: "10px" }}
                  >
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? "Modificar Detalle de Compra" : "Añadir Detalle de Compra"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Compra ID"
            fullWidth
            name="idCompra"
            value={formData.idCompra}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Producto ID"
            fullWidth
            name="idProducto"
            value={formData.idProducto}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Cantidad"
            fullWidth
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Precio Unitario"
            fullWidth
            type="number"
            name="precioUnitario"
            value={formData.precioUnitario}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Estado"
            fullWidth
            name="estado"
            value={formData.estado}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? "Guardar Cambios" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DetalleCompra;
