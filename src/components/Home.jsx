import React, { useState } from 'react';
import { Container, AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import Cargos from '../tables/Cargo';
import Sucursales from '../tables/Sucursales';
import Header from './Header'; 
import Categorias from '../tables/Categorias';
import Cliente from '../tables/Cliente'; 
import Compras from '../tables/Compras';
import DetalleCompra from '../tables/DetalleCompra';
import DetallePedido from '../tables/DetallePedido';
import DetalleVentas from '../tables/DetalleVentas';
import Facturas from '../tables/Facturas';
import Mesas from '../tables/Mesas';
import Inventario from '../tables/Inventario';
import MetodoPago from '../tables/MetodoPago';
import Pago from '../tables/Pago';
import Pedidos from '../tables/Pedidos';
import Personal from '../tables/Personal';
import Productos from '../tables/Productos';
import Proveedores from '../tables/Proveedores';
import Reservas from '../tables/Reservas';
import TurnosPersonal from '../tables/TurnoPersonal';


const TabPanel = ({ value, index, children }) => {
  return value === index ? <Box p={3}>{children}</Box> : null;
};

const Home = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header />

      <Container>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab label="Cargos" />
            <Tab label="Sucursales" />
            <Tab label="Categorias" />
            <Tab label="Clientes" />
            <Tab label="Compras" />
            <Tab label="Detalle Compra" />
            <Tab label="Detalle Pedido" />
            <Tab label="Detalle Ventas" />
            <Tab label="Facturas" />
            <Tab label="Mesas" />
            <Tab label="Inventario" />
            <Tab label="Metodo de Pago" />
            <Tab label="Pago" />
            <Tab label="Pedidos" />
            <Tab label="Personal" />
            <Tab label="Productos" />
            <Tab label="Proveedores" />
            <Tab label="Reservas" />
            <Tab label="Turnos Personal" />
            
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <Cargos />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Sucursales />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Categorias />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Cliente />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Compras />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <DetalleCompra />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <DetallePedido />
        </TabPanel>
        <TabPanel value={value} index={7}>
          <DetalleVentas />
        </TabPanel>
        <TabPanel value={value} index={8}>
          <Facturas />
        </TabPanel>
        <TabPanel value={value} index={9}>
          <Mesas />
        </TabPanel>
        <TabPanel value={value} index={10}>
          <Inventario />
        </TabPanel>
        <TabPanel value={value} index={11}>
          <MetodoPago />
        </TabPanel>
        <TabPanel value={value} index={12}>
          <Pago />
        </TabPanel>
        <TabPanel value={value} index={13}>
          <Pedidos />
        </TabPanel>
        <TabPanel value={value} index={14}>
          <Personal />
        </TabPanel>
        <TabPanel value={value} index={15}>
          <Productos />
        </TabPanel>
        <TabPanel value={value} index={16}>
          <Proveedores />
        </TabPanel>
        <TabPanel value={value} index={17}>
          <Reservas />
        </TabPanel>
        <TabPanel value={value} index={18}>
          <TurnosPersonal />
        </TabPanel>

      </Container>
    </div>
  );
};

export default Home;
