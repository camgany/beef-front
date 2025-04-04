import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; // Asegúrate de que esta importación sea correcta

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [editMode, setEditMode] = useState(false); // Para saber si estamos en modo edición o creación
  const [editNombre, setEditNombre] = useState("");
  const [editIdCategoria, setEditIdCategoria] = useState(null);
  const [formData, setFormData] = useState({ nombre: "" });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
      console.log("Categorías obtenidas:", response.data); 
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const handleEdit = (idCategoria, nombre) => {
    setEditMode(true);
    setEditIdCategoria(idCategoria);
    setEditNombre(nombre);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setEditIdCategoria(null);
    setFormData({ nombre: "" });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`/categorias/${editIdCategoria}`, { nombre: editNombre });
        alert("Categoría actualizada correctamente");
      } else {
        await api.post("/categorias", { nombre: formData.nombre });
        alert("Categoría creada correctamente");
      }
      fetchCategorias(); // Recargar la lista de categorías
      setOpenDialog(false); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      alert("No se pudo guardar la categoría");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Categorías de Productos</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        style={{ marginBottom: "20px" }}
      >
        Añadir Categoría
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.idCategoria}>
                <TableCell>{categoria.idCategoria}</TableCell>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(categoria.idCategoria, categoria.nombre)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? "Modificar Categoría" : "Añadir Categoría"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Categoría"
            fullWidth
            value={editMode ? editNombre : formData.nombre}
            onChange={(e) => (editMode ? setEditNombre(e.target.value) : setFormData({ nombre: e.target.value }))}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? "Guardar Cambios" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categorias;
