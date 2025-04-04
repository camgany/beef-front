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

const Mesas = () => {
  const [mesas, setMesas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMesa, setNewMesa] = useState({
    idSucursal: "",
    numeroMesa: "",
    capacidad: "",
  });

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      const response = await api.get("/mesas");
      setMesas(response.data);
    } catch (error) {
      console.error("Error al obtener mesas:", error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await api.put(`/mesas/${id}/desactiva`);
      fetchMesas();
    } catch (error) {
      console.error("Error al desactivar mesa:", error);
    }
  };

  const handleEdit = (mesa) => {
    setSelectedMesa({ ...mesa });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedMesa((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/mesas/${selectedMesa.idMesa}`, selectedMesa);
      setEditDialogOpen(false);
      fetchMesas();
    } catch (error) {
      console.error("Error al actualizar mesa:", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewMesa((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMesa = async () => {
    try {
      await api.post("/mesas", { ...newMesa, estadoMesa: "Disponible" });
      setAddDialogOpen(false);
      setNewMesa({ idSucursal: "", numeroMesa: "", capacidad: "" });
      fetchMesas();
    } catch (error) {
      console.error("Error al añadir mesa:", error);
    }
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Mesas</Typography>
        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>Añadir Mesa</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>Número de Mesa</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mesas.map((mesa) => (
              <TableRow key={mesa.idMesa}>
                <TableCell>{mesa.idMesa}</TableCell>
                <TableCell>{mesa.idSucursal}</TableCell>
                <TableCell>{mesa.numeroMesa}</TableCell>
                <TableCell>{mesa.capacidad}</TableCell>
                <TableCell>{mesa.estadoMesa}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(mesa)}>Editar</Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDesactivar(mesa.idMesa)}
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
        <DialogTitle>Editar Mesa</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Sucursal"
            name="idSucursal"
            value={selectedMesa?.idSucursal || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Número de Mesa"
            name="numeroMesa"
            value={selectedMesa?.numeroMesa || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacidad"
            name="capacidad"
            value={selectedMesa?.capacidad || ""}
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
        <DialogTitle>Añadir Mesa</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Sucursal"
            name="idSucursal"
            value={newMesa.idSucursal}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Número de Mesa"
            name="numeroMesa"
            value={newMesa.numeroMesa}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacidad"
            name="capacidad"
            value={newMesa.capacidad}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleAddMesa} color="primary" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Mesas;
