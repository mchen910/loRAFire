import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import logo from './static/logo.png';
import 'bootstrap/dist/css/bootstrap.css';

function Layout() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="me-auto" href="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          LoRaFire
        </Navbar.Brand>
        <Nav className="ml-auto">
            <Nav.Link href="/node">All Nodes</Nav.Link>
            <Nav.Link href="/gate">All Gates</Nav.Link>
        </Nav>
      </Navbar>
    )

    
}

export default Layout;