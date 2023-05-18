import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand >Online Test</Navbar.Brand>
          <Nav className="mr-auto" >
            <NavLink style={{color:"white" , paddingLeft:"15px", textDecoration:"none"}} to="/user">User</NavLink>
            <NavLink style={{color:"white" , paddingLeft:"15px", textDecoration:"none"}} to="/adminlogin">Admin</NavLink>
            <NavLink style={{color:"white" , paddingLeft:"15px", textDecoration:"none"}} to="/help">Help</NavLink>
          </Nav>
        </Container>
      </Navbar>

    
    </>
  );
}

export default Header;