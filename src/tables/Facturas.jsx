import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../axiosConfig"; 

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [facturaData, setFacturaData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    idVenta: "",
    idMetodoPago: "",
    nit: "",
    fechaFactura: "",
    montoTotal: "",
  });

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const response = await api.get("/facturas");
      setFacturas(response.data);
      console.log("Facturas obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
    }
  };

  const handleViewDetails = async (idFactura) => {
    try {
      const response = await api.get(`/facturas/${idFactura}`);
      setFacturaData(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener la factura:", error);
      alert("No se pudo obtener la factura");
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
    const { idVenta, idMetodoPago, nit, fechaFactura, montoTotal } = formData;

    if (!idVenta || !idMetodoPago || !nit || !fechaFactura || !montoTotal) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await api.post("/facturas", {
        idVenta,
        idMetodoPago,
        nit,
        fechaFactura,
        montoTotal,
      });
      console.log("Factura añadida:", response.data);
      setOpenForm(false);  
      fetchFacturas();  
    } catch (error) {
      console.error("Error al añadir la factura:", error);
      alert("No se pudo añadir la factura");
    }
  };

  const handleEdit = async () => {
    const { idVenta, idMetodoPago, nit, fechaFactura, montoTotal } = formData;
    const idFactura = facturaData.idFactura;

    if (!idVenta || !idMetodoPago || !nit || !fechaFactura || !montoTotal) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await api.put(`/facturas/${idFactura}`, {
        idVenta,
        idMetodoPago,
        nit,
        fechaFactura,
        montoTotal,
      });
      console.log("Factura actualizada:", response.data);
      setOpenForm(false); 
      fetchFacturas();  
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
      alert("No se pudo actualizar la factura");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Facturas</Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpenForm} 
        style={{ backgroundColor: "#7b4d0a" }} // Brown color for buttons
      >
        Añadir Factura
      </Button>

      <TableContainer component={Paper} style={{ marginTop: 20, backgroundColor: "#fae5c6" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Factura</TableCell>
              <TableCell>ID Venta</TableCell>
              <TableCell>NIT</TableCell>
              <TableCell>Fecha Factura</TableCell>
              <TableCell>Monto Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura.idFactura}>
                <TableCell>{factura.idFactura}</TableCell>
                <TableCell>{factura.idVenta}</TableCell>
                <TableCell>{factura.nit}</TableCell>
                <TableCell>{factura.fechaFactura}</TableCell>
                <TableCell>{factura.montoTotal}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewDetails(factura.idFactura)}
                    style={{ marginRight: 10 }}
                  >
                    Ver Detalle
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setFormData({
                        idVenta: factura.idVenta,
                        idMetodoPago: factura.idMetodoPago,
                        nit: factura.nit,
                        fechaFactura: factura.fechaFactura,
                        montoTotal: factura.montoTotal,
                      });
                      setFacturaData(factura);
                      setOpenForm(true);
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Modificar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to view details */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Factura</DialogTitle>
        <DialogContent>
          {facturaData ? (
            <>
              <Typography><strong>ID Factura:</strong> {facturaData.idFactura}</Typography>
              <Typography><strong>ID Venta:</strong> {facturaData.idVenta}</Typography>
              <Typography><strong>NIT:</strong> {facturaData.nit}</Typography>
              <Typography><strong>Fecha Factura:</strong> {facturaData.fechaFactura}</Typography>
              <Typography><strong>Monto Total:</strong> {facturaData.montoTotal}</Typography>
            </>
          ) : (
            <Typography>Cargando factura...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Form to add or edit factura */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{facturaData ? "Modificar Factura" : "Añadir Factura"}</DialogTitle>
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
            label="ID Metodo de Pago"
            name="idMetodoPago"
            fullWidth
            value={formData.idMetodoPago}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="NIT"
            name="nit"
            fullWidth
            value={formData.nit}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Fecha Factura"
            name="fechaFactura"
            type="datetime-local"
            fullWidth
            value={formData.fechaFactura}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Monto Total"
            name="montoTotal"
            type="number"
            fullWidth
            value={formData.montoTotal}
            onChange={handleFormChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
          <Button 
            onClick={facturaData ? handleEdit : handleSubmit} 
            variant="contained" 
            color="primary"
            style={{ backgroundColor: "#7b4d0a" }} // Brown color for buttons
          >
            {facturaData ? "Guardar Cambios" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Facturas;
