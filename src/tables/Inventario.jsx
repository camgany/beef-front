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
  Stack,
} from "@mui/material";
import api from "../axiosConfig";

const Inventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newInventario, setNewInventario] = useState({
    idSucursal: "",
    idProducto: "",
    cantidad: "",
    fechaRegistro: "",
  });

  useEffect(() => {
    fetchInventarios();
  }, []);

  const fetchInventarios = async () => {
    try {
      const response = await api.get("/inventario");
      setInventarios(response.data);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await api.put(`/inventario/${id}/desactivar`);
      fetchInventarios();
    } catch (error) {
      console.error("Error al desactivar inventario:", error);
    }
  };

  const handleEdit = (inventario) => {
    setSelectedInventario({ ...inventario });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedInventario((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/inventario/${selectedInventario.idInventario}`, selectedInventario);
      setEditDialogOpen(false);
      fetchInventarios();
    } catch (error) {
      console.error("Error al actualizar inventario:", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewInventario((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInventario = async () => {
    try {
      await api.post("/inventario", { ...newInventario, estado: true });
      setAddDialogOpen(false);
      setNewInventario({ idSucursal: "", idProducto: "", cantidad: "", fechaRegistro: "" });
      fetchInventarios();
    } catch (error) {
      console.error("Error al añadir inventario:", error);
    }
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Inventario</Typography>
        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>Añadir Inventario</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>ID Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventarios.map((inv) => (
              <TableRow key={inv.idInventario}>
                <TableCell>{inv.idInventario}</TableCell>
                <TableCell>{inv.idSucursal}</TableCell>
                <TableCell>{inv.idProducto}</TableCell>
                <TableCell>{inv.cantidad}</TableCell>
                <TableCell>{inv.fechaRegistro}</TableCell>
                <TableCell>{inv.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(inv)}>Editar</Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDesactivar(inv.idInventario)}
                    sx={{ ml: 1 }}
                  >
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Inventario</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Sucursal"
            name="idSucursal"
            value={selectedInventario?.idSucursal || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Producto"
            name="idProducto"
            value={selectedInventario?.idProducto || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cantidad"
            name="cantidad"
            value={selectedInventario?.cantidad || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Registro"
            name="fechaRegistro"
            value={selectedInventario?.fechaRegistro || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Añadir Inventario</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Sucursal"
            name="idSucursal"
            value={newInventario.idSucursal}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Producto"
            name="idProducto"
            value={newInventario.idProducto}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cantidad"
            name="cantidad"
            value={newInventario.cantidad}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Registro"
            name="fechaRegistro"
            value={newInventario.fechaRegistro}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleAddInventario} color="primary" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventario;
