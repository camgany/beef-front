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

const Pago = () => {
  const [pagos, setPagos] = useState([]);
  const [nuevoPago, setNuevoPago] = useState({
    idPedido: "",
    metodoPago: "",
    monto: "",
    fechaPago: ""
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      const response = await api.get("/pagos");
      setPagos(response.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNuevoPago((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPago = async () => {
    try {
      await api.post("/pagos", nuevoPago);
      setNuevoPago({ idPedido: "", metodoPago: "", monto: "", fechaPago: "" });
      setAddDialogOpen(false);
      fetchPagos();
    } catch (error) {
      console.error("Error al añadir pago:", error);
    }
  };

  const handleEdit = (pago) => {
    setSelectedPago({ ...pago });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedPago((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/pagos/${selectedPago.idPago}`, selectedPago);
      setEditDialogOpen(false);
      fetchPagos();
    } catch (error) {
      console.error("Error al actualizar pago:", error);
    }
  };

  const handleView = (pago) => {
    setSelectedPago(pago);
    setViewDialogOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pagos</Typography>

      <Button 
        variant="contained" 
        onClick={() => setAddDialogOpen(true)} 
        sx={{ backgroundColor: '#7B4D0A', '&:hover': { backgroundColor: '#6A3B08' } }}
      >
        Añadir Pago
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>ID Pedido</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>Método de Pago</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>Monto</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>Fecha de Pago</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.idPago}>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{pago.idPago}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{pago.idPedido}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{pago.metodoPago}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{pago.monto}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{pago.fechaPago}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleView(pago)} 
                    sx={{ marginRight: 1 }}
                  >
                    Ver
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => handleEdit(pago)} 
                    sx={{ backgroundColor: '#7B4D0A', '&:hover': { backgroundColor: '#6A3B08' } }}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Añadir Pago */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Añadir Pago</DialogTitle>
        <DialogContent>
          <TextField label="ID Pedido" name="idPedido" value={nuevoPago.idPedido} onChange={handleAddChange} fullWidth margin="normal" />
          <TextField label="Método de Pago" name="metodoPago" value={nuevoPago.metodoPago} onChange={handleAddChange} fullWidth margin="normal" />
          <TextField label="Monto" name="monto" value={nuevoPago.monto} onChange={handleAddChange} fullWidth margin="normal" />
          <TextField label="Fecha de Pago" name="fechaPago" value={nuevoPago.fechaPago} onChange={handleAddChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleAddPago} 
            sx={{ backgroundColor: '#7B4D0A', '&:hover': { backgroundColor: '#6A3B08' } }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ver Pago */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Detalles del Pago</DialogTitle>
        <DialogContent>
          <Typography>ID: {selectedPago?.idPago}</Typography>
          <Typography>ID Pedido: {selectedPago?.idPedido}</Typography>
          <Typography>Método de Pago: {selectedPago?.metodoPago}</Typography>
          <Typography>Monto: {selectedPago?.monto}</Typography>
          <Typography>Fecha de Pago: {selectedPago?.fechaPago}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Editar Pago */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Pago</DialogTitle>
        <DialogContent>
          <TextField label="ID Pedido" name="idPedido" value={selectedPago?.idPedido || ""} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="Método de Pago" name="metodoPago" value={selectedPago?.metodoPago || ""} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="Monto" name="monto" value={selectedPago?.monto || ""} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField label="Fecha de Pago" name="fechaPago" value={selectedPago?.fechaPago || ""} onChange={handleEditChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleEditSave} 
            sx={{ backgroundColor: '#7B4D0A', '&:hover': { backgroundColor: '#6A3B08' } }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pago;
