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

const Personal = () => {
  const [personal, setPersonal] = useState([]);
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPersonal, setNewPersonal] = useState({
    idSucursal: 0,
    idCargo: 0,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ci: "",
    correo: "",
    telefono: 0,
    genero: "",
    salario: 0,
    usuario: "",
    contrasena: "",
    estado: true
  });

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      const response = await api.get("/personal");
      setPersonal(response.data);
    } catch (error) {
      console.error("Error al obtener personal:", error);
    }
  };

  const handleOpenDialog = (personal = null) => {
    setIsEditing(!!personal);
    setSelectedPersonal(personal);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPersonal(null);
    setNewPersonal({
      idSucursal: 0,
      idCargo: 0,
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      ci: "",
      correo: "",
      telefono: 0,
      genero: "",
      salario: 0,
      usuario: "",
      contrasena: "",
      estado: true
    });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedPersonal((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewPersonal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/personal/${selectedPersonal.idPersonal}`, selectedPersonal);
      } else {
        await api.post("/personal", newPersonal);
      }
      fetchPersonal();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar personal:", error);
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await api.put(`/personal/${id}/desactivar`);
      fetchPersonal();
    } catch (error) {
      console.error("Error al desactivar personal:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Personal</Typography>
      <Button variant="contained" onClick={() => handleOpenDialog()}>Añadir Personal</Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personal.map((person) => (
              <TableRow key={person.idPersonal}>
                <TableCell>{person.idPersonal}</TableCell>
                <TableCell>{`${person.nombre} ${person.apellidoPaterno} ${person.apellidoMaterno}`}</TableCell>
                <TableCell>{person.correo}</TableCell>
                <TableCell>{person.telefono}</TableCell>
                <TableCell>{person.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenDialog(person)}>
                    Ver / Editar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDesactivar(person.idPersonal)} sx={{ ml: 1 }}>
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Personal" : "Añadir Personal"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={isEditing ? selectedPersonal?.nombre : newPersonal.nombre}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido Paterno"
            name="apellidoPaterno"
            value={isEditing ? selectedPersonal?.apellidoPaterno : newPersonal.apellidoPaterno}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido Materno"
            name="apellidoMaterno"
            value={isEditing ? selectedPersonal?.apellidoMaterno : newPersonal.apellidoMaterno}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="CI"
            name="ci"
            value={isEditing ? selectedPersonal?.ci : newPersonal.ci}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo"
            name="correo"
            value={isEditing ? selectedPersonal?.correo : newPersonal.correo}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Teléfono"
            name="telefono"
            value={isEditing ? selectedPersonal?.telefono : newPersonal.telefono}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Género"
            name="genero"
            value={isEditing ? selectedPersonal?.genero : newPersonal.genero}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Salario"
            name="salario"
            value={isEditing ? selectedPersonal?.salario : newPersonal.salario}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Usuario"
            name="usuario"
            value={isEditing ? selectedPersonal?.usuario : newPersonal.usuario}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="contrasena"
            value={isEditing ? selectedPersonal?.contrasena : newPersonal.contrasena}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedPersonal?.estado : newPersonal.estado}
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

export default Personal;
