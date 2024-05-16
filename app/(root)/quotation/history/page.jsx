"use client"
import { supabase } from '@/api'
import React, { useEffect, useState } from 'react'

export default function PreviousQuotation() {
    const [data, setData] = useState([])
    useEffect(() => {
        (async () => {
            const user = JSON.parse(localStorage.getItem("user"))

            const { data: history, error } = await supabase.from("quotes").select().eq("dropshipper_id", user.id)
            console.log(user, history, error)
            setData(history)
        })()

    }, [])
    return (
        <div> <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Quotation ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Estimated Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Total</TableHead>
                    <TableHead>Supplier Offer</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quoteData?.length > 0 ? quoteData.map((d) => <TableRow key={d?.id}>
                    <TableCell>#{d?.id}</TableCell>
                    <TableCell>#{d?.quotes?.order_number}</TableCell>
                    <TableCell>{d?.supplier_name}</TableCell>
                    <TableCell>{d?.estimated_delivery}</TableCell>
                    <TableCell>{d?.status}</TableCell>
                    <TableCell>€ {d?.quotes?.amount}</TableCell>
                    <TableCell>€ {d?.supplier_offer}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><div onClick={() => handleAcceptQuotion(d.quote_id)}>Accept Quote</div></DropdownMenuItem>
                                <DropdownMenuItem><div onClick={() => handleRejectQuotion(d.quote_id)} >Reject Quote</div></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>) : (
                    <TableRow>
                        <TableCell
                            colSpan={7}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        </div>
    )
}
