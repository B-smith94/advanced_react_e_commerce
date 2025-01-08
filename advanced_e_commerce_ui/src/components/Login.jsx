import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Login() {
    const [username, setUsername] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    //localStorage -- cached data on client browser; will persist until removed, regardless of browser/session/computer state
    useEffect(() => {
        // Check for user session in local storage
        const storedUser = localStorage.getItem('userSession');
        if (storedUser) {
            const userSession = JSON.parse(storedUser);
            setUser(userSession);

            if (userSession.name.toLowerCase() === 'admin') {
                navigate('/add-product');
            } else {
                navigate('/home');
            }
        }
    }, [setUser])

    const handleLogin = (e) => {
        e.preventDefault();
        const userData = { name: username, isLoggedIn: true };
        setUser(userData); // updates state and useContext.Provider
        localStorage.setItem('userSession', JSON.stringify(userData)); // Save user session to local storage
    };

    return (
        <Container className="vh-100">
            <Row>
                <Col md={5}>
                    <h1>Login</h1>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login

/* WITHOUT USING WEB STORAGE:
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Login() {
    const [username, setUsername] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setUser({ name: username, isLoggedIn: true }); // updates state and useContext.Provider
        if (username.toLowerCase() === 'admin') {
            navigate('/add-product');
        }else {
            navigate('/home');
        }
    };

    return (
        <Container className="vh-100">
            <Row>
                <Col md={5}>
                    <h1>Login</h1>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login */