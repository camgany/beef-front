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

const MetodoPago = () => {
  const [metodos, setMetodos] = useState([]);
  const [nuevoMetodo, setNuevoMetodo] = useState({ metodo: "" });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchMetodos();
  }, []);

  const fetchMetodos = async () => {
    try {
      const response = await api.get("/metodopago");
      setMetodos(response.data);
    } catch (error) {
      console.error("Error al obtener métodos de pago:", error);
    }
  };

  const handleOpenAdd = () => setAddDialogOpen(true);
  const handleCloseAdd = () => {
    setNuevoMetodo({ metodo: "" });
    setAddDialogOpen(false);
  };

  const handleAddChange = (e) => {
    setNuevoMetodo({ ...nuevoMetodo, metodo: e.target.value });
  };

  const handleAddMetodo = async () => {
    try {
      await api.post("/metodopago", nuevoMetodo);
      handleCloseAdd();
      fetchMetodos();
    } catch (error) {
      console.error("Error al añadir método de pago:", error);
    }
  };

  const handleView = (metodo) => {
    setSelectedMetodo(metodo);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setSelectedMetodo(null);
    setViewDialogOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Métodos de Pago
      </Typography>

      <Button 
        variant="contained" 
        onClick={handleOpenAdd} 
        sx={{ backgroundColor: '#7B4D0A', '&:hover': { backgroundColor: '#6A3B08' } }}
      >
        Añadir Método de Pago
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>Método</TableCell>
              <TableCell sx={{ backgroundColor: '#FAE5C6' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metodos.map((metodo) => (
              <TableRow key={metodo.idMetodoPago}>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{metodo.idMetodoPago}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>{metodo.metodo}</TableCell>
                <TableCell sx={{ backgroundColor: '#FAE5C6' }}>
                  <Button 
                    onClick={() => handleView(metodo)} 
                    variant="outlined" 
                    sx={{ marginRight: 1 }}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup para Añadir */}
      <Dialog open={addDialogOpen} onClose={handleCloseAdd}>
        <DialogTitle>Añadir Método de Pago</DialogTitle>
        <DialogContent>
          <TextField
            label="Método"
            value={nuevoMetodo.metodo}
            onChange={handleAddChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancelar</Button>
          <Button 
            onClick={handleAddMetodo} 
            variant="contained"
            sx={{ backgroundColor: '#7B4D0A', '&:hover': { backgroundColor: '#6A3B08' } }}
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup para Ver */}
      <Dialog open={viewDialogOpen} onClose={handleCloseView}>
        <DialogTitle>Detalles del Método de Pago</DialogTitle>
        <DialogContent>
          <Typography>ID: {selectedMetodo?.idMetodoPago}</Typography>
          <Typography>Método: {selectedMetodo?.metodo}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MetodoPago;
