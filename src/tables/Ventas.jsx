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
        // Ajustamos el formato para el POST con el Token en headers
        await api.post("/ventas", {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidXNlcjEiLCJSb2wiOiI0IiwiZXhwIjoxNzQzNzM2ODgxLCJpc3MiOiJ3ZWJhcHBsaWNhdGlvbjEuY29tIiwiYXVkIjoid2ViYXBwbGljYXRpb24xLmNvbSJ9.du-x0u_OPZ97FDuPlaCFCpmnkbKkRFxKBdHAjFHTo-0", 
          },
          data: {
            idCliente: newVenta.idCliente,
            idSucursal: newVenta.idSucursal,
            fechaVenta: newVenta.fechaVenta, // Fecha como string
            total: newVenta.total,
            estado: newVenta.estado,
          }
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
      <Button variant="contained" onClick={() => handleOpenDialog()}>Añadir Venta</Button>

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
              <TableRow key={venta.idVenta}>
                <TableCell>{venta.idVenta}</TableCell>
                <TableCell>{venta.idCliente}</TableCell>
                <TableCell>{venta.idSucursal}</TableCell>
                <TableCell>{venta.fechaVenta}</TableCell> {/* Fecha como texto */}
                <TableCell>{venta.total}</TableCell>
                <TableCell>{venta.estado}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenDialog(venta)}>
                    Ver / Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleCancelar(venta.idVenta)} sx={{ ml: 1 }}>
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
          <Button onClick={handleSave} variant="contained" color="primary">
            {isEditing ? "Guardar Cambios" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Ventas;
