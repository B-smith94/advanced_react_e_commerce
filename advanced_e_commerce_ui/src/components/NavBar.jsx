import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';
import '../i18n';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
    // setup for translations
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }
    return (
        <>
            <Navbar bg='light' expand='lg' as='header' role='navigation'>
                <Navbar.Brand as={NavLink} to='/home'>{t('eCommerceTitleNav')}</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='align-items-center mr-auto' as='nav' role='menubar'>
                        <Nav.Link as={NavLink} to='/home' role='menuitem'>{t('homeNav')}</Nav.Link>
                        <Nav.Link as={NavLink} to='/update-account' role='menuitem'>{t('updateNav')}</Nav.Link>
                        <Nav.Link as={NavLink} to='/cart' role='menuitem'>{t('cartNav')}</Nav.Link>
                        <Nav.Link as={NavLink} to={'/order-history'} role='menuitem'>{t('orderHistory')}</Nav.Link>
                    </Nav>
                    <Nav className='align-items-center mr-auto border' as='nav' role='menubar'>
                        <Nav.Link onClick={() => changeLanguage('en')}>English</Nav.Link>
                        <Nav.Link onClick={() => changeLanguage('fr')}>Français</Nav.Link>
                        <Logout />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavBar;