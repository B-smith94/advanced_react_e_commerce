import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../features/userAccounts/userAccountsSlice";
import { Button } from "react-bootstrap";
import '../i18n';
import { useTranslation } from 'react-i18next';

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [t] = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        dispatch(logOut());
        navigate('/');
    };

    return (
        <Button variant="danger" aria-describedby='logout' className="align-items-center" onClick={handleLogout} role="button"><p id="logout" className="align-items-center mb-1">{t('logout')}</p></Button>
    );
}

export default Logout;