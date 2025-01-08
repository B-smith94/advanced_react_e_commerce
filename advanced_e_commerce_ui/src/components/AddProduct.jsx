import { Col, Form, Button, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

const postProduct = async (product) => {
    const response = await fetch('https://fakestoreapi.com/products', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product), // converts to Javascript Object Notation (JSON) string
    });
    if (!response.ok) {
        throw new Error('Failed to add new product');
    }
    return response.json();
}

const AddProduct = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const navigate = useNavigate();
            // mutate = function to make changes, in this case a Post request
            // isLoading = boolean
            // isError = boolean
            // error = null
    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: postProduct,
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Product added with ID', data.id);
            queryClient.invalidateQueries(['products']); // invalidates data in 'products', ensures data will update next call to reflect changes made here
            setTimeout(() => setShowSuccessAlert(false), 5000); // Auto-hides alert after 5 seconds
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target); //constructs an object representing form fields and values
        const product = {
            title: formData.get('title'),
            price: formData.get('price'),
            description: formData.get('description'),
            image: formData.get('image'),
            category: formData.get('category'),
        };
        mutate(product); // function returned form useMutation hook that performs action
        event.target.reset(); // Reset form fields after submission
    };

    return (
        <div>
            {isError && <Alert variant='danger'>An error occurred: {error.message}</Alert>}
            {showSuccessAlert && <Alert variant='success'>Product added successfully!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" name="price" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" as='textarea' rows={3} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="url" placeholder="Enter image url" name="image" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" placeholder="Enter category" name="category" required />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Product'}
                    </Button>
                    <Button variant="danger" onClick={() => navigate('/logout')}>Log Out</Button>
                </Form>
            </Col>
        </div>
    );
};

export default AddProduct;