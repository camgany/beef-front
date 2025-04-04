import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; // Asegúrate de que esta importación sea correcta

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    idSucursal: 0,
    idProveedor: 0,
    fechaCompra: "",
    total: 0,
    estado: true
  });
  const [editIdCompra, setEditIdCompra] = useState(null);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await api.get("/api/v1/compras");
      setCompras(response.data);
      console.log("Compras obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  };

  const handleEdit = (idCompra, compraData) => {
    setEditMode(true);
    setEditIdCompra(idCompra);
    setFormData(compraData);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setEditIdCompra(null);
    setFormData({
      idSucursal: 0,
      idProveedor: 0,
      fechaCompra: "",
      total: 0,
      estado: true
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`/api/v1/compras/${editIdCompra}`, formData);
        alert("Compra actualizada correctamente");
      } else {
        await api.post("/api/v1/compras", formData);
        alert("Compra creada correctamente");
      }
      fetchCompras(); // Recargar la lista de compras
      setOpenDialog(false); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar compra:", error);
      alert("No se pudo guardar la compra");
    }
  };

  const handleDesactivar = async (idCompra) => {
    try {
      await api.put(`/api/v1/compras/${idCompra}/desactivar`);
      alert("Compra desactivada correctamente");
      fetchCompras(); // Vuelve a obtener la lista de compras
    } catch (error) {
      console.error("Error al desactivar compra:", error);
      alert("No se pudo desactivar la compra");
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
      <Typography variant="h4" gutterBottom>Compras</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        style={{ marginBottom: "20px" }}
      >
        Añadir Compra
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha Compra</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compras.map((compra) => (
              <TableRow key={compra.idCompra}>
                <TableCell>{compra.idCompra}</TableCell>
                <TableCell>{compra.idSucursal}</TableCell>
                <TableCell>{compra.idProveedor}</TableCell>
                <TableCell>{new Date(compra.fechaCompra).toLocaleString()}</TableCell>
                <TableCell>{compra.total}</TableCell>
                <TableCell>{compra.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(compra.idCompra, compra)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDesactivar(compra.idCompra)}
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
        <DialogTitle>{editMode ? "Modificar Compra" : "Añadir Compra"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Sucursal ID"
            fullWidth
            name="idSucursal"
            value={formData.idSucursal}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Proveedor ID"
            fullWidth
            name="idProveedor"
            value={formData.idProveedor}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Fecha de Compra"
            fullWidth
            type="datetime-local"
            name="fechaCompra"
            value={formData.fechaCompra}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Total"
            fullWidth
            type="number"
            name="total"
            value={formData.total}
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

export default Compras;
