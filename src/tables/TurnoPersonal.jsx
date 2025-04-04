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

const TurnosPersonal = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTurno, setNewTurno] = useState({
    idPersonal: "",
    fecha: "2025-04-10T22:06:00.000Z", // Fecha como texto plano
    nombreTurno: "",
    horaEntrada: "14:00:00", // Hora como texto plano
    horaSalida: "20:00:00", // Hora como texto plano
    observacion: "",
    estado: true,
  });

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const response = await api.get("/turnos");
      setTurnos(response.data);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
    }
  };

  const handleOpenDialog = (turno = null) => {
    setIsEditing(!!turno);
    setSelectedTurno(turno);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTurno(null);
    setNewTurno({
      idPersonal: "",
      fecha: "2025-04-10T22:06:00.000Z", // Fecha por defecto en formato texto
      nombreTurno: "",
      horaEntrada: "14:00:00", // Hora por defecto en formato texto
      horaSalida: "20:00:00", // Hora por defecto en formato texto
      observacion: "",
      estado: true,
    });
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedTurno((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewTurno((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const formattedTurno = {
        idPersonal: newTurno.idPersonal,
        fecha: newTurno.fecha, // Fecha en texto plano
        nombreTurno: newTurno.nombreTurno,
        horaEntrada: newTurno.horaEntrada, // Hora en texto plano
        horaSalida: newTurno.horaSalida, // Hora en texto plano
        observacion: newTurno.observacion,
        estado: newTurno.estado,
      };

      const data = JSON.stringify(formattedTurno); // Convertir el objeto a cadena JSON

      if (isEditing) {
        await api.put(`/turnos/${selectedTurno.idTurnoPersonal}`, { data });
      } else {
        await api.post("/turnos", { data });
      }
      fetchTurnos();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar turno:", error);
    }
  };

  const handleDesactivar = async (idPersonal) => {
    try {
      await api.put(`/turnos/desactivar-por-personal/${idPersonal}`);
      fetchTurnos();
    } catch (error) {
      console.error("Error al desactivar turno por personal:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Turnos de Personal</Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#7b4d0a", marginBottom: "20px" }} // Brown color for button
        onClick={() => handleOpenDialog()}
      >
        Añadir Turno
      </Button>

      <TableContainer component={Paper} sx={{ backgroundColor: "#fae5c6", mt: 4 }}> {/* Cream color for table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Personal</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Nombre Turno</TableCell>
              <TableCell>Hora Entrada</TableCell>
              <TableCell>Hora Salida</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno) => (
              <TableRow key={turno.idTurnoPersonal}>
                <TableCell>{turno.idTurnoPersonal}</TableCell>
                <TableCell>{turno.idPersonal}</TableCell>
                <TableCell>{turno.fecha}</TableCell> {/* Fecha como texto */}
                <TableCell>{turno.nombreTurno}</TableCell>
                <TableCell>{turno.horaEntrada}</TableCell> {/* Hora Entrada como texto */}
                <TableCell>{turno.horaSalida}</TableCell> {/* Hora Salida como texto */}
                <TableCell>{turno.observacion}</TableCell>
                <TableCell>{turno.estado ? "Activo" : "Desactivado"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenDialog(turno)}
                    sx={{ marginRight: "8px" }}
                  >
                    Ver / Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDesactivar(turno.idPersonal)}
                    sx={{ backgroundColor: "#7b4d0a" }} // Brown color for button
                  >
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Editar Turno" : "Añadir Turno"}</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Personal"
            name="idPersonal"
            value={isEditing ? selectedTurno?.idPersonal : newTurno.idPersonal}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha"
            name="fecha"
            value={isEditing ? selectedTurno?.fecha : newTurno.fecha}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Nombre del Turno"
            name="nombreTurno"
            value={isEditing ? selectedTurno?.nombreTurno : newTurno.nombreTurno}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Hora Entrada"
            name="horaEntrada"
            value={isEditing ? selectedTurno?.horaEntrada : newTurno.horaEntrada}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            type="time"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hora Salida"
            name="horaSalida"
            value={isEditing ? selectedTurno?.horaSalida : newTurno.horaSalida}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            type="time"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Observación"
            name="observacion"
            value={isEditing ? selectedTurno?.observacion : newTurno.observacion}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Estado"
            name="estado"
            value={isEditing ? selectedTurno?.estado : newTurno.estado}
            onChange={handleDialogChange}
            fullWidth
            margin="normal"
            select
            SelectProps={{ native: true }}
          >
            <option value={true}>Activo</option>
            <option value={false}>Desactivado</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "#7b4d0a" }} // Brown color for button
          >
            {isEditing ? "Guardar Cambios" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TurnosPersonal;
