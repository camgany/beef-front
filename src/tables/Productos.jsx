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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../axiosConfig";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProducto, setNewProducto] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    estado: "Disponible"
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await api.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleOpenDialog = (producto = null) => {
    setIsEditing(!!producto);
    setSelectedProducto(producto);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProducto(null);
    setNewProducto({
      idCategoria: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      estado: "Disponible"
    });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedProducto((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProducto((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/productos/${selectedProducto.idProducto}`, selectedProducto);
      } else {
        await api.post("/productos", newProducto);
      }
      fetchProductos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await api.put(`/productos/${id}/desactivar`);
      fetchProductos();
    } catch (error) {
      console.error("Error al desactivar producto:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Productos</Typography>
      <Button variant="contained" onClick={() => handleOpenDialog()}>Añadir Producto</Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.idProducto}>
                <TableCell>{producto.idProducto}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>{producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>{producto.estado}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenDialog(producto)}>
                    Ver / Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDesactivar(producto.idProducto)} sx={{ ml: 1 }}>
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Producto" : "Añadir Producto"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="idCategoria"
              value={isEditing ? selectedProducto?.idCategoria : newProducto.idCategoria}
              onChange={handleDialogChange}
            >
              <MenuItem value={1}>Bebidas</MenuItem>
              <MenuItem value={2}>Entradas</MenuItem>
              <MenuItem value={3}>Plato Fuerte</MenuItem>
              <MenuItem value={4}>Postres</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Nombre"
            name="nombre"
            value={isEditing ? selectedProducto?.nombre : newProducto.nombre}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={isEditing ? selectedProducto?.descripcion : newProducto.descripcion}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={isEditing ? selectedProducto?.precio : newProducto.precio}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={isEditing ? selectedProducto?.stock : newProducto.stock}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedProducto?.estado : newProducto.estado}
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

export default Productos;
