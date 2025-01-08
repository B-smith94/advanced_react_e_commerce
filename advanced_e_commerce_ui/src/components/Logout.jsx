import {useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {

    const navigate = useNavigate();

    useEffect(() => {

        localStorage.removeItem('userSession');

        setUser({ name: '', isLoggedIn: false });

        navigate('/');
    }, [navigate, setUser]);

    return (
        <div>Loggin out...</div>
    );
}

export default Logout;