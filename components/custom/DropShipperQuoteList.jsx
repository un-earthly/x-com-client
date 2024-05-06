"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import { supabase } from '@/api'

export default function DropShipperQuoteList() {
    const [quoteData, setQuoteData] = useState([])
    // const user = JSON.parse(localStorage.getItem("user"))



    const handleAcceptQuotion = async (quoteId) => {
        try {
            // Update data in the Supabase table
            const { data, error } = await supabase
                .from('quotes')
                .update({ status: 'accepted' })
                .eq('quote_id', quoteId)
                .select();
            const offerStatus = await supabase
                .from('supplier_offer')
                .update({ status: 'accepted' })
                .eq('quote_id', quoteId)

            if (error) {
                throw error;
            }
            const { data: supplierOrderData, error: supplierOrderError } = await supabase
                .from("supplier_order").insert({
                    order_number: data[0].order_number,
                    supplier_id: data[0].supplier_id,
                    dropshipper_id: data[0].dropshipper_id,
                    quote_id: quoteId,
                    total_amount: data[0].amount,
                    order_id: data[0].order_id
                }).select()
            console.log(supplierOrderData, supplierOrderError)

            // console.log('Data updated successfully with status accepted:', data);
        } catch (error) {
            console.error('Error updating data:', error.message);
        }
    };
    const handleRejectQuotion = async (quoteId) => {
        try {
            // Update data in the Supabase table
            const { data, error } = await supabase
                .from('quotes')
                .update({ quote_status: 'rejected' })
                .eq('id', quoteId)
                .select();

            if (error) {
                throw error;
            }

            console.log('Data updated successfully with status rejected:', data);
        } catch (error) {
            console.error('Error updating data:', error.message);
        }
    };
    useEffect(() => {
        const fetchQuoteData = async () => {
            try {

                let { data: supplier_offer, error } = await supabase
                    .from('supplier_offer')
                    .select('*')


                console.log(supplier_offer)
                if (error) {
                    throw error;
                }

                setQuoteData(supplier_offer);
            } catch (error) {
                console.error('Error fetching quote data:', error.message);
            }
        };
        fetchQuoteData();
    }, []);
    return (
        <div> <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Quotation ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Estimated Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quoteData?.length > 0 ? quoteData.map((d) => <TableRow key={d?.id}>
                    <TableCell>#{d?.id}</TableCell>
                    <TableCell>#{d?.order_number}</TableCell>
                    <TableCell>{d?.supplier_name}</TableCell>
                    <TableCell>{d?.estimated_delivery}</TableCell>
                    <TableCell>{d?.status}</TableCell>
                    <TableCell>${d?.supplier_offer}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View details</DropdownMenuItem>
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
