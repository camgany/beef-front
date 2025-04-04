import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import api from "../axiosConfig";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    estado: true,
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await api.get("/proveedores");
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const handleOpenDialog = (proveedor = null) => {
    setIsEditing(!!proveedor);
    setSelectedProveedor(proveedor);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProveedor(null);
    setNewProveedor({
      nombre: "",
      direccion: "",
      telefono: "",
      estado: true,
    });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedProveedor((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProveedor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/proveedores/${selectedProveedor.idProveedor}`, selectedProveedor);
      } else {
        await api.post("/proveedores", newProveedor);
      }
      fetchProveedores();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await api.put(`/proveedores/${id}/desactivar`);
      fetchProveedores();
    } catch (error) {
      console.error("Error al desactivar proveedor:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Proveedores</Typography>
      <Button variant="contained" onClick={() => handleOpenDialog()}>Añadir Proveedor</Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => (
              <TableRow key={proveedor.idProveedor}>
                <TableCell>{proveedor.idProveedor}</TableCell>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.direccion}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenDialog(proveedor)}>
                    Ver / Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDesactivar(proveedor.idProveedor)} sx={{ ml: 1 }}>
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Proveedor" : "Añadir Proveedor"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={isEditing ? selectedProveedor?.nombre : newProveedor.nombre}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Dirección"
            name="direccion"
            value={isEditing ? selectedProveedor?.direccion : newProveedor.direccion}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={isEditing ? selectedProveedor?.telefono : newProveedor.telefono}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedProveedor?.estado : newProveedor.estado}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEditing ? "Guardar Cambios" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Proveedores;
