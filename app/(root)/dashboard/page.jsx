"use client"
import Loading from '@/components/custom/Loading'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import SupplierDashboard from '@/components/dashboard/SupplierDashboard'
import UserDashboard from '@/components/dashboard/UserDashboard'
import { ROLE_ADMIN, ROLE_SUPPLIER, ROLE_USER } from '@/lib/constant'
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const [userRole, setUserRole] = useState("");
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);

        const interval = setInterval(() => {
            setLoadingProgress(prevProgress => {
                const newProgress = prevProgress + 10;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 300);

        setTimeout(() => {
            setUserRole(parsedUser.role);
            clearInterval(interval);
        }, 2000);

        return () => clearInterval(interval);
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
                    <Loading progress={loadingProgress} />
                )}
            </>
        </div>
    )
}
