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

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPedido, setNewPedido] = useState({
    idCliente: "",
    idMesa: "",
    fechaPedido: "",
    total: "",
    estado: ""
  });

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await api.get("/pedidos");
      setPedidos(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const handleOpenDialog = (pedido = null) => {
    setIsEditing(!!pedido);
    setSelectedPedido(pedido);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPedido(null);
    setNewPedido({ idCliente: "", idMesa: "", fechaPedido: "", total: "", estado: "" });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedPedido((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewPedido((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/pedidos/${selectedPedido.idPedido}`, selectedPedido);
      } else {
        await api.post("/pedidos", newPedido);
      }
      fetchPedidos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar pedido:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pedidos</Typography>
      <Button 
        variant="contained" 
        onClick={() => handleOpenDialog()} 
        sx={{ backgroundColor: "#7b4d0a", "&:hover": { backgroundColor: "#6a3b08" } }}
      >
        Añadir Pedido
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4, backgroundColor: "#fae5c6" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Cliente</TableCell>
              <TableCell>ID Mesa</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.idPedido}>
                <TableCell>{pedido.idPedido}</TableCell>
                <TableCell>{pedido.idCliente}</TableCell>
                <TableCell>{pedido.idMesa}</TableCell>
                <TableCell>{pedido.fechaPedido}</TableCell>
                <TableCell>{pedido.total}</TableCell>
                <TableCell>{pedido.estado}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleOpenDialog(pedido)} 
                    sx={{ backgroundColor: "#7b4d0a", "&:hover": { backgroundColor: "#6a3b08" } }}
                  >
                    Ver / Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Pedido" : "Añadir Pedido"}</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Cliente"
            name="idCliente"
            value={isEditing ? selectedPedido?.idCliente : newPedido.idCliente}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID Mesa"
            name="idMesa"
            value={isEditing ? selectedPedido?.idMesa : newPedido.idMesa}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha Pedido"
            name="fechaPedido"
            value={isEditing ? selectedPedido?.fechaPedido : newPedido.fechaPedido}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Total"
            name="total"
            value={isEditing ? selectedPedido?.total : newPedido.total}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedPedido?.estado : newPedido.estado}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            sx={{ backgroundColor: "#7b4d0a", "&:hover": { backgroundColor: "#6a3b08" } }}
          >
            {isEditing ? "Guardar Cambios" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pedidos;
