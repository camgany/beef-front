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

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newReserva, setNewReserva] = useState({
    idCliente: "",
    idSucursal: "",
    idMesa: "",
    fechaReserva: "",
    estado: "Pendiente",
  });

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await api.get("/reservas");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  const handleOpenDialog = (reserva = null) => {
    setIsEditing(!!reserva);
    setSelectedReserva(reserva);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReserva(null);
    setNewReserva({
      idCliente: "",
      idSucursal: "",
      idMesa: "",
      fechaReserva: "",
      estado: "Pendiente",
    });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedReserva((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewReserva((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/reservas/${selectedReserva.idReserva}`, selectedReserva);
      } else {
        await api.post("/reservas", newReserva);
      }
      fetchReservas();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar reserva:", error);
    }
  };

  const handleCancelar = async (id) => {
    try {
      await api.put(`/reservas/cancelar/${id}`);
      fetchReservas();
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Reservas</Typography>
      <Button variant="contained" onClick={() => handleOpenDialog()}>Añadir Reserva</Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Cliente</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>ID Mesa</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.idReserva}>
                <TableCell>{reserva.idReserva}</TableCell>
                <TableCell>{reserva.idCliente}</TableCell>
                <TableCell>{reserva.idSucursal}</TableCell>
                <TableCell>{reserva.idMesa}</TableCell>
                <TableCell>{new Date(reserva.fechaReserva).toLocaleString()}</TableCell>
                <TableCell>{reserva.estado}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenDialog(reserva)}>
                    Ver / Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleCancelar(reserva.idReserva)} sx={{ ml: 1 }}>
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Reserva" : "Añadir Reserva"}</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Cliente"
            name="idCliente"
            value={isEditing ? selectedReserva?.idCliente : newReserva.idCliente}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Sucursal"
            name="idSucursal"
            value={isEditing ? selectedReserva?.idSucursal : newReserva.idSucursal}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Mesa"
            name="idMesa"
            value={isEditing ? selectedReserva?.idMesa : newReserva.idMesa}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha Reserva"
            name="fechaReserva"
            value={isEditing ? selectedReserva?.fechaReserva : newReserva.fechaReserva}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedReserva?.estado : newReserva.estado}
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

export default Reservas;
