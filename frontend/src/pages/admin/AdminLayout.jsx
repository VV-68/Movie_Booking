import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';

const AdminLayout = () => {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const checkRole = () => {
            try {
                const userStr = localStorage.getItem('user');
                const adminUserStr = localStorage.getItem('adminUser');
                
                let role = '';
                if (adminUserStr) {
                    const adminUser = JSON.parse(adminUserStr);
                    role = adminUser?.role || 'admin'; // Assuming adminUser means admin
                } else if (userStr) {
                    const user = JSON.parse(userStr);
                    role = user?.role;
                }
                
                if (role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                setIsAdmin(false);
            }
        };

        checkRole();
    }, []);

    if (isAdmin === null) return null; // or a loading spinner

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <AdminNavbar />
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
