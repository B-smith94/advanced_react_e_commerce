// Steps: 

// 1. Set up a react query to fetch user carts from fakestoreapi.com
// 2. Configure render so that it displays:
//      - Cart ID
//      - Date of Creation
//      - Total Price
// 3. Enable users to click on individual orders to view full details, including:
//      -list of Products
//      -Total Price of the Order

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user)

    console.log(user)

    const fetchCarts = async (user) => {
        const response = await fetch(`http://fakestoreapi.com/carts/user/${user.id}`)
        if (!response) throw new Error('Failed to fetch carts');
        const carts = await response.json();
        return carts
    }

    const { data: carts, isLoading, error } = useQuery({
        queryKey: ['carts'],
        queryFn: fetchCarts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000
    });
    
    
}