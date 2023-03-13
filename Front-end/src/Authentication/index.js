import { Outlet, Navigate } from 'react-router-dom';
import { api } from '../api/api';

export default function Authentication({ redirectTo }) {
    const isAuthenticated = validateLogin();

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />

}

export async function validateLogin() {
    try {
        const { data } = await api.get('/usuario', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (data.length > 0) {
            return true;
        }


    } catch (error) {
        console.log(error.message);
        localStorage.clear();
        return false;
    }
}