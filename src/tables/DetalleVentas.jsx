import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig";

const DetalleVentas = () => {
  const [detalleVentas, setDetalleVentas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [detalleVentaData, setDetalleVentaData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    idVenta: "",
    idProducto: "",
    cantidad: "",
    precioUnitario: "",
    subtotal: "",
  });

  useEffect(() => {
    fetchDetalleVentas();
  }, []);

  const fetchDetalleVentas = async () => {
    try {
      const response = await api.get("/detalle-ventas");
      setDetalleVentas(response.data);
      console.log("Detalles de Venta obtenidos:", response.data);
    } catch (error) {
      console.error("Error al obtener detalles de venta:", error);
    }
  };

  const handleViewDetails = async (idDetalleVenta) => {
    try {
      const response = await api.get(`/detalle-ventas/${idDetalleVenta}`);
      setDetalleVentaData(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener el detalle de venta:", error);
      alert("No se pudo obtener el detalle de venta");
    }
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { idVenta, idProducto, cantidad, precioUnitario, subtotal } = formData;

    if (!idVenta || !idProducto || !cantidad || !precioUnitario || !subtotal) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await api.post("/detalle-ventas", {
        idVenta,
        idProducto,
        cantidad,
        precioUnitario,
        subtotal,
      });
      console.log("Detalle de venta añadido:", response.data);
      setOpenForm(false); 
      fetchDetalleVentas(); 
    } catch (error) {
      console.error("Error al añadir el detalle de venta:", error);
      alert("No se pudo añadir el detalle de venta");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Detalle de Ventas</Typography>

      <Button
        variant="contained"
        style={{ backgroundColor: "#7b4d0a", color: "white", marginBottom: "20px" }} // Botón marrón
        onClick={handleOpenForm}
      >
        Añadir Detalle de Venta
      </Button>

      <TableContainer component={Paper} style={{ marginTop: 20, backgroundColor: "#fae5c6" }}> {/* Tabla con color crema */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Detalle Venta</TableCell>
              <TableCell>ID Venta</TableCell>
              <TableCell>ID Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalleVentas.map((detalleVenta) => (
              <TableRow key={detalleVenta.idDetalleVenta}>
                <TableCell>{detalleVenta.idDetalleVenta}</TableCell>
                <TableCell>{detalleVenta.idVenta}</TableCell>
                <TableCell>{detalleVenta.idProducto}</TableCell>
                <TableCell>{detalleVenta.cantidad}</TableCell>
                <TableCell>{detalleVenta.precioUnitario}</TableCell>
                <TableCell>{detalleVenta.subtotal}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    style={{ color: "#7b4d0a", borderColor: "#7b4d0a", marginRight: "10px" }} // Botón marrón
                    onClick={() => handleViewDetails(detalleVenta.idDetalleVenta)}
                  >
                    Ver Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup modal para ver el detalle de venta */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Detalle de Venta</DialogTitle>
        <DialogContent>
          {detalleVentaData ? (
            <>
              <Typography><strong>ID Detalle Venta:</strong> {detalleVentaData.idDetalleVenta}</Typography>
              <Typography><strong>ID Venta:</strong> {detalleVentaData.idVenta}</Typography>
              <Typography><strong>ID Producto:</strong> {detalleVentaData.idProducto}</Typography>
              <Typography><strong>Cantidad:</strong> {detalleVentaData.cantidad}</Typography>
              <Typography><strong>Precio Unitario:</strong> {detalleVentaData.precioUnitario}</Typography>
              <Typography><strong>Subtotal:</strong> {detalleVentaData.subtotal}</Typography>
            </>
          ) : (
            <Typography>Cargando detalles...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} style={{ color: "#7b4d0a" }}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Formulario para añadir un nuevo detalle de venta */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Añadir Detalle de Venta</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Venta"
            name="idVenta"
            fullWidth
            value={formData.idVenta}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="ID Producto"
            name="idProducto"
            fullWidth
            value={formData.idProducto}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Cantidad"
            name="cantidad"
            type="number"
            fullWidth
            value={formData.cantidad}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Precio Unitario"
            name="precioUnitario"
            type="number"
            fullWidth
            value={formData.precioUnitario}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Subtotal"
            name="subtotal"
            type="number"
            fullWidth
            value={formData.subtotal}
            onChange={handleFormChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{ backgroundColor: "#7b4d0a", color: "white" }} // Botón marrón
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DetalleVentas;
