import { Container } from "react-bootstrap";
import ProductCatalog from "./ProductCatalog";
import { useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";

import { NavLink } from "react-router-dom";

function HomePage() {
    const cartCount = useSelector((state) => state.cart.totalItems); 
    const user = useSelector((state) => state.userAccount.user)
    const navigate = useNavigate();
    const userName = user ? user.user.name.firstname : "";
    console.log(user)

    useEffect(() => {
        if (!user) {
            return navigate("/")
        } 
    }, [user, navigate])

    return (
        <Container className="mt-5">
            <NavBar />
            <h1>Welcome, {userName}!</h1>
            <hr />
            <NavLink to="/cart">{ cartCount > 0 ? `Your cart has ${cartCount} item(s).` : "Your cart is empty." }</NavLink>
            <ProductCatalog />
        </Container>
    );
}

export default HomePage;