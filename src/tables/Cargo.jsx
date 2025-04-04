import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig";  

const Cargo = () => {
  const [cargos, setCargos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [formData, setFormData] = useState({ nombreCargo: "", estado: true });
  const [isCreating, setIsCreating] = useState(false); 

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    try {
      const response = await api.get("/cargos/all");
      setCargos(response.data);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "estado" ? value === "true" : value,
    }));
  };

  const handleModificarCargo = async () => {
    const { nombreCargo, estado } = formData;
    if (!nombreCargo) {
      console.error("El nombre del cargo es requerido");
      return;
    }

    const cargoData = { nombreCargo, estado };

    try {
      const response = await api.put(`/cargos/${selectedCargo.idCargo}`, cargoData);
      console.log("Cargo modificado:", response.data);
      fetchCargos(); 
      setOpenDialog(false);  
    } catch (error) {
      console.error("Error al modificar cargo:", error.response?.data || error.message);
    }
  };

  const handleCrearCargo = async () => {
    const { nombreCargo, estado } = formData;
    if (!nombreCargo) {
      console.error("El nombre del cargo es requerido");
      return;
    }

    const cargoData = { nombreCargo, estado };

    try {
      const response = await api.post("/cargos", cargoData);
      console.log("Cargo creado:", response.data);
      fetchCargos();  
      setOpenDialog(false);  
    } catch (error) {
      console.error("Error al crear cargo:", error.response?.data || error.message);
    }
  };

  const handleOpenDialog = (cargo = null) => {
    if (cargo) {
      setSelectedCargo(cargo);
      setFormData({ nombreCargo: cargo.nombreCargo, estado: cargo.estado });
      setIsCreating(false); 
    } else {
      setFormData({ nombreCargo: "", estado: true });
      setIsCreating(true); 
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4">Cargos</Typography>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog()} 
        sx={{
          backgroundColor: '#7b4d0a', 
          color: 'white', 
          marginBottom: '20px'
        }}
      >
        Añadir Cargo
      </Button>
      <TableContainer component={Paper} sx={{ backgroundColor: '#fae5c6' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargos.length > 0 ? (
              cargos.map((cargo) => (
                <TableRow key={cargo.idCargo}>
                  <TableCell>{cargo.idCargo}</TableCell>
                  <TableCell>{cargo.nombreCargo}</TableCell>
                  <TableCell>{cargo.estado ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog(cargo)}
                      sx={{
                        backgroundColor: '#7b4d0a', 
                        color: 'white'
                      }}
                    >
                      Modificar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No hay cargos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isCreating ? "Añadir Cargo" : "Modificar Cargo"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del Cargo"
            fullWidth
            name="nombreCargo"
            value={formData.nombreCargo}
            onChange={handleFormChange}
          />
          <TextField
            label="Estado (true/false)"
            fullWidth
            name="estado"
            value={formData.estado}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#7b4d0a', color: 'white' }}>
            Cancelar
          </Button>
          <Button
            onClick={isCreating ? handleCrearCargo : handleModificarCargo}
            variant="contained"
            sx={{
              backgroundColor: '#7b4d0a', 
              color: 'white'
            }}
          >
            {isCreating ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cargo;
