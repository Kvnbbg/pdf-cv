import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Your App Name</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
