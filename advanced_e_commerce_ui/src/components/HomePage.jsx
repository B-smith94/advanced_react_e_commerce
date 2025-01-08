import { useContext } from "react";
import UserContext from "../context/UserContext";
import { Container, Button } from "react-bootstrap";
// import { useCartCount } from "../hooks/useCartCount";
import ProductCatalog from "./ProductCatalog";
import { useSelector } from "react-redux"; 
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";

function HomePage() {
    const { user } = useContext(UserContext);
    //const cartCount = useCartCount(); // Use the custom hook
    const navigate = useNavigate()
    const cartCount = useSelector((state) => state.cart.totalItems); // Redux approach used in place of custom hook
    // accesses the total items in the cart state

    // gets access from user via useContext, displays current name and log status
    return (
        <Container className="mt-5">
            <h1>Welcome, {user.name}!</h1>
            <p>You are now {user.isLoggedIn ? 'logged in' : 'logged out'}.</p>
            <NavLink to='/logout'>Logout</NavLink>
            <br />
            <NavLink to="/cart">Your cart has {cartCount} item(s).</NavLink> {/* displays the card count */}
            <ProductCatalog />
        </Container>
    );
}

export default HomePage;