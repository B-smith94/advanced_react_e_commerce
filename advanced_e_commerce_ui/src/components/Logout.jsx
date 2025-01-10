import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../features/userAccounts/userAccountsSlice";
import { Button } from "react-bootstrap";

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        dispatch(logOut());
        navigate('/');
    };

    return (
        <Button variant="danger" aria-describedby='logout' onClick={handleLogout} role="button"><p id="logout">Logout</p></Button>
    );
}

export default Logout;