import { Container } from "react-bootstrap";
import ProductCatalog from "./ProductCatalog";
import { useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { NavLink } from "react-router-dom";

function HomePage() {
    const cartCount = useSelector((state) => state.cart.totalItems); 
    const user = useSelector((state) => state.userAccounts.accounts)
    const navigate = useNavigate();
    const userName = user.length > 0 ? user[0].name.firstname: "";

    useEffect(() => {
        if (user.length === 0) {
            return navigate("/")
        } 
    })

    return (
        <Container className="mt-5">
            <h1>Welcome, {userName} !</h1>
            <NavLink to='/logout'>Logout</NavLink>
            <br />
            <NavLink to="/cart">{ cartCount > 0 ? "Your cart has {cartCount} item(s)." : "Your cart is empty." }</NavLink>
            <ProductCatalog />
        </Container>
    );
}

export default HomePage;