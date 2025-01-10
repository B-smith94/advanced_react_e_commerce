import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';
import { useMemo } from 'react';

const NavBar = () => {
    return (
        <>
            <Navbar bg='light' expand='lg' as='header' role='navigation'>
                <Navbar.Brand href='/home'>E-Commerce Platform</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='align-items-center mr-auto' as='nav' role='menubar'>
                        <Nav.Link as={NavLink} to='/home' role='menuitem'>Home</Nav.Link>
                        <Nav.Link as={NavLink} to='/update-account' role='menuitem'>Update Account Information</Nav.Link>
                        <Nav.Link as={NavLink} to='/cart' role='menuitem'>View Cart</Nav.Link>
                        <Nav.Link as={NavLink} to='/logout' role='menuitem'><Logout /></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavBar;