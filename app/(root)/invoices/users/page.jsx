"use client"
import { supabase } from '@/api'
import { MailIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function SendToUsers() {
    const [users, setUsers] = useState([])
    const [invoiceId, setInvoiceId] = useState("");
    const router = useRouter()
    useEffect(() => {
        setInvoiceId(localStorage.getItem("invoice-id"))
        // console.log(invoice_id)
        async function loadUserData() {
            const { data, error } = await supabase.from("user").select()
            const notSuperUserData = data.filter(d => d.role_id !== 2)
            setUsers(notSuperUserData)
            console.log(notSuperUserData)
        }
        loadUserData()
    }, [])
    const handleSend = async (user_id) => {
        const { error } = await supabase.from("recieved_invoices").insert({
            invoice_id: invoiceId,
            user_id
        });
        // console.log(error)
        if (!error) {
            router.push("")
            toast.success("Successfully sent invoice")
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Select User to Send Invoice</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            users.map(((d, i) => <TableRow key={i}>
                                <TableCell>
                                    <div>{d.user_id}</div>
                                </TableCell>
                                <TableCell>{d.user_name}</TableCell>
                                <TableCell>{d.user_email}</TableCell>
                                <TableCell>{d.user_phone}</TableCell>
                                <TableCell>{d.role_id === 3 ? "supplier" : "user"}</TableCell>
                                <TableCell className="w-10 text-right">
                                    <Button onClick={() => handleSend(d.user_id)} size="sm">
                                        Send
                                    </Button>
                                </TableCell>
                            </TableRow>))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
