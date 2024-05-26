"use client"
import { supabase } from '@/api'
import Loading from '@/components/custom/Loading'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import SupplierDashboard from '@/components/dashboard/SupplierDashboard'
import UserDashboard from '@/components/dashboard/UserDashboard'
import { ROLE_ADMIN, ROLE_SUPPLIER, ROLE_USER } from '@/lib/constant'
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    localStorage.removeItem('user');
                    window.location.href = "/login";
                    return;
                }
                const user = localStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setUserRole(parsedUser.role);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <>
                {userRole === ROLE_USER ? (
                    <UserDashboard />
                ) : userRole === ROLE_ADMIN ? (
                    <AdminDashboard />
                ) : userRole === ROLE_SUPPLIER ? (
                    <SupplierDashboard />
                ) : (
                    <Loading progress={100} />
                )}
            </>
        </div>
    )
}
