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

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newVenta, setNewVenta] = useState({
    idCliente: 0,
    idSucursal: 0,
    fechaVenta: "2025-04-04T02:32:13.306Z", // Fecha como string
    total: 0,
    estado: "string", // Estado como string
  });

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const response = await api.get("/ventas");
      setVentas(response.data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  const handleOpenDialog = (venta = null) => {
    setIsEditing(!!venta);
    setSelectedVenta(venta);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedVenta(null);
    setNewVenta({
      idCliente: 0,
      idSucursal: 0,
      fechaVenta: "2025-04-04T02:32:13.306Z", // Fecha por defecto en string
      total: 0,
      estado: "string",
    });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedVenta((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewVenta((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const formattedVenta = {
        idCliente: newVenta.idCliente,
        idSucursal: newVenta.idSucursal,
        fechaVenta: newVenta.fechaVenta, // Fecha como string
        total: newVenta.total,
        estado: newVenta.estado,
      };

      const data = JSON.stringify(formattedVenta); // Convertir el objeto a cadena JSON

      if (isEditing) {
        await api.put(`/ventas/${selectedVenta.idVenta}`, { data });
      } else {
        await api.post("/ventas", {
          data: {
            idCliente: newVenta.idCliente,
            idSucursal: newVenta.idSucursal,
            fechaVenta: newVenta.fechaVenta, // Fecha como string
            total: newVenta.total,
            estado: newVenta.estado,
          },
        });
      }
      fetchVentas();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar venta:", error);
    }
  };

  const handleCancelar = async (idVenta) => {
    try {
      await api.put(`/ventas/cancelar/${idVenta}`);
      fetchVentas();
    } catch (error) {
      console.error("Error al cancelar venta:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Ventas</Typography>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog()}
        sx={{ backgroundColor: '#7b4d0a', '&:hover': { backgroundColor: '#6c3f07' } }}
      >
        Añadir Venta
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Cliente</TableCell>
              <TableCell>ID Sucursal</TableCell>
              <TableCell>Fecha Venta</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.idVenta} sx={{ backgroundColor: '#fae5c6' }}>
                <TableCell>{venta.idVenta}</TableCell>
                <TableCell>{venta.idCliente}</TableCell>
                <TableCell>{venta.idSucursal}</TableCell>
                <TableCell>{venta.fechaVenta}</TableCell> {/* Fecha como texto */}
                <TableCell>{venta.total}</TableCell>
                <TableCell>{venta.estado}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(venta)}
                    sx={{ backgroundColor: '#7b4d0a', '&:hover': { backgroundColor: '#6c3f07' } }}
                  >
                    Ver / Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancelar(venta.idVenta)}
                    sx={{ ml: 1, backgroundColor: '#7b4d0a', '&:hover': { backgroundColor: '#6c3f07' } }}
                  >
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Venta" : "Añadir Venta"}</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Cliente"
            name="idCliente"
            value={isEditing ? selectedVenta?.idCliente : newVenta.idCliente}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Sucursal"
            name="idSucursal"
            value={isEditing ? selectedVenta?.idSucursal : newVenta.idSucursal}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha Venta"
            name="fechaVenta"
            value={isEditing ? selectedVenta?.fechaVenta : newVenta.fechaVenta}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Total"
            name="total"
            value={isEditing ? selectedVenta?.total : newVenta.total}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedVenta?.estado : newVenta.estado}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{ native: true }}
          >
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ backgroundColor: '#7b4d0a', '&:hover': { backgroundColor: '#6c3f07' } }}
          >
            {isEditing ? "Guardar Cambios" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Ventas;
