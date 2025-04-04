import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; // Asegúrate de que esta importación sea correcta

const DetallePedido = () => {
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    idPedido: 0,
    idProducto: 0,
    cantidad: 0,
    precioUnitario: 0,
    subtotal: 0,
  });
  const [editIdDetallePedido, setEditIdDetallePedido] = useState(null);

  useEffect(() => {
    fetchDetallePedidos();
  }, []);

  const fetchDetallePedidos = async () => {
    try {
      const response = await api.get("/detallepedido");
      setDetallePedidos(response.data);
      console.log("Detalles de Pedido obtenidos:", response.data);
    } catch (error) {
      console.error("Error al obtener detalles de pedido:", error);
    }
  };

  const handleEdit = (idDetallePedido, detallePedidoData) => {
    setEditMode(true);
    setEditIdDetallePedido(idDetallePedido);
    setFormData(detallePedidoData);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setEditIdDetallePedido(null);
    setFormData({
      idPedido: 0,
      idProducto: 0,
      cantidad: 0,
      precioUnitario: 0,
      subtotal: 0,
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`/detallepedido/${editIdDetallePedido}`, formData);
        alert("Detalle de pedido actualizado correctamente");
      } else {
        await api.post("/detallepedido", formData);
        alert("Detalle de pedido creado correctamente");
      }
      fetchDetallePedidos(); 
      setOpenDialog(false); 
    } catch (error) {
      console.error("Error al guardar detalle de pedido:", error);
      alert("No se pudo guardar el detalle de pedido");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      subtotal: name === "cantidad" || name === "precioUnitario" ? (formData.cantidad * formData.precioUnitario) : formData.subtotal
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Detalle de Pedidos</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        style={{ marginBottom: "20px" }}
      >
        Añadir Detalle de Pedido
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pedido ID</TableCell>
              <TableCell>Producto ID</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detallePedidos.map((detallePedido) => (
              <TableRow key={detallePedido.idDetalle}>
                <TableCell>{detallePedido.idDetalle}</TableCell>
                <TableCell>{detallePedido.idPedido}</TableCell>
                <TableCell>{detallePedido.idProducto}</TableCell>
                <TableCell>{detallePedido.cantidad}</TableCell>
                <TableCell>{detallePedido.precioUnitario}</TableCell>
                <TableCell>{detallePedido.subtotal}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(detallePedido.idDetalle, detallePedido)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? "Modificar Detalle de Pedido" : "Añadir Detalle de Pedido"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Pedido ID"
            fullWidth
            name="idPedido"
            value={formData.idPedido}
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
            label="Subtotal"
            fullWidth
            name="subtotal"
            value={formData.subtotal}
            InputProps={{
              readOnly: true,
            }}
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

export default DetallePedido;
