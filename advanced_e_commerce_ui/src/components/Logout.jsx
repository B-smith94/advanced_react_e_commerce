import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../features/userAccounts/userAccountsSlice";
import { Button } from "react-bootstrap";

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('userSession');
        dispatch(logOut());
        navigate('/');
    };

    return (
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
    );
}

export default Logout;