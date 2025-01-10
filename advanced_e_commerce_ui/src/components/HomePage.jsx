import { Container } from "react-bootstrap";
import ProductCatalog from "./ProductCatalog";
import { useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";
import '../i18n';
import { useTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";

function HomePage() {
    const cartCount = useSelector((state) => state.cart.totalItems); 
    const user = useSelector((state) => state.userAccount.user)
    const navigate = useNavigate();
    const userName = user ? user.user.name.firstname : "";
    const [t] = useTranslation();
    console.log(user)

    useEffect(() => {
        if (!user) {
            return navigate("/")
        } 
    }, [user, navigate])

    return (
        <Container className="mt-5">
            <NavBar />
            <h1>{t('welcomeMessage')}, {userName}!</h1>
            <hr />
            <NavLink to="/cart" role="link">{ cartCount > 0 ? `${t('cartCount')} ${cartCount} ${t('items')}.` : t("emptyCart") }</NavLink>
            <ProductCatalog />
        </Container>
    );
}

export default HomePage;