"use client"
import { supabase } from '@/api'
import AdminQuoteListing from '@/components/custom/AdminQuoteListing'
import DropShipperQuoteList from '@/components/custom/DropShipperQuoteList'
import SupplierQuoteListing from '@/components/custom/SupplierQuoteListing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ROLE_ADMIN, ROLE_SUPPLIER } from '@/lib/constant'
import React, { useEffect, useState } from 'react'

export default function PreviousQuotation() {
    const [user, setUser] = useState([])
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, [])
    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>Quote History</CardTitle>
                            <CardDescription>
                                Manage your quotations with efficiency.
                            </CardDescription>
                        </div>
                    </div>

                </CardHeader>
                <CardContent>


                    {
                        user.role === ROLE_SUPPLIER ? <SupplierQuoteListing history={true} /> :
                            user.role === ROLE_ADMIN ? <AdminQuoteListing /> : <DropShipperQuoteList history={true} />
                    }
                </CardContent>
            </Card>
        </div>
    )
}
