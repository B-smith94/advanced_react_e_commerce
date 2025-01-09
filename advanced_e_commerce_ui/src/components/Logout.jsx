import {useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../features/userAccounts/userAccountsSlice";
import { useSelector, useDispatch } from "react-redux";

function Logout() {
    const user = useSelector((state) => state.userAccounts.accounts)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('userSession');
        dispatch(deleteUser(user))
        navigate('/');
        console.log('Logging out...')
    }, [navigate, dispatch]);

    return (
        <div>Logging out...</div>
    );
}

export default Logout;