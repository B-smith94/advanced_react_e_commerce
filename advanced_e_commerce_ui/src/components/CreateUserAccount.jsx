import React, { useState } from 'react';

const CreateUserAccount = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipcode, setZipcode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            email,
            username,
            password,
            name: {
                firstname,
                lastname,
            },
            address: {
                city,
                street,
                zipcode: zipcode.toString()
            },
            phone,
        };

        try {
            const response = await fetch('https://fakestoreapi.com/users', {
                method: "POST",
                body: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json; charset=UTF-8'},
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error creating account:', error);
        }

        console.log("Submitting form with data:", postData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstname">First Name</label>
            <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
            
            <label htmlFor="lastname">Last Name</label>
            <input type="text" id="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} />

            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label htmlFor="email">Email</label>
            <input type="text" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label htmlFor="city">City</label>
            <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} />

            <label htmlFor="street">Street Address</label>
            <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} />

            <label htmlFor="zipcode">Zip Code</label>
            <input type="text" id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />

            <button type="submit">Create Account</button>
        </form>
    )
}

export default CreateUserAccount