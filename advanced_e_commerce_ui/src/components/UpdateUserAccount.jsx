import React, { useState } from "react";

const UpdateUserAccount = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipcode, setZipcode] = useState('');

    handleSubmit = async (e) => {
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
                zipcode,
            },
            phone,
        };

        try {
            const response = fetch('https://fakestoreapi.com/users/21', {
                method: "PUT",
                body: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstname">First Name</label>
            <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} required />
            
            <label htmlFor="lastname">Last Name</label>
            <input type="text" id="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} required />
            
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            
            <label htmlFor="password">Password</label>
            <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <label htmlFor="email">Email</label>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            
            <label htmlFor="city">city</label>
            <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            
            <label htmlFor="street">Street Address</label>
            <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} required />
            
            <label htmlFor="zipcode">Zip Code</label>
            <input type="text" id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
            
            <button type="submit">Update Account</button>
        </form>
    )
}

export default UpdateUserAccount