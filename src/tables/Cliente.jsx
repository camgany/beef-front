import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; 

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [editMode, setEditMode] = useState(false); 
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    nit: "",
    telefono: "",
    correo: ""
  });
  const [editIdCliente, setEditIdCliente] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
      console.log("Clientes obtenidos:", response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleEdit = (idCliente, clienteData) => {
    setEditMode(true);
    setEditIdCliente(idCliente);
    setFormData(clienteData);
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditMode(false);
    setEditIdCliente(null);
    setFormData({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      ci: "",
      nit: "",
      telefono: "",
      correo: ""
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`/clientes/${editIdCliente}`, formData);
        alert("Cliente actualizado correctamente");
      } else {
        await api.post("/clientes", formData);
        alert("Cliente creado correctamente");
      }
      fetchClientes(); // Recargar la lista de clientes
      setOpenDialog(false); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("No se pudo guardar el cliente");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Clientes</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNew}
        style={{ marginBottom: "20px" }}
      >
        Añadir Cliente
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido Paterno</TableCell>
              <TableCell>Apellido Materno</TableCell>
              <TableCell>CI</TableCell>
              <TableCell>NIT</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.idCliente}>
                <TableCell>{cliente.idCliente}</TableCell>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.apellidoPaterno}</TableCell>
                <TableCell>{cliente.apellidoMaterno}</TableCell>
                <TableCell>{cliente.ci}</TableCell>
                <TableCell>{cliente.nit}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.correo}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(cliente.idCliente, cliente)}
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
        <DialogTitle>{editMode ? "Modificar Cliente" : "Añadir Cliente"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Apellido Paterno"
            fullWidth
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Apellido Materno"
            fullWidth
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="CI"
            fullWidth
            name="ci"
            value={formData.ci}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="NIT"
            fullWidth
            name="nit"
            value={formData.nit}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Teléfono"
            fullWidth
            name="telefono"
            value={formData.telefono}
            onChange={handleFormChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Correo"
            fullWidth
            name="correo"
            value={formData.correo}
            onChange={handleFormChange}
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

export default Cliente;
