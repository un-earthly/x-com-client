"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import { supabase } from '@/api'
import toast from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export default function DropShipperQuoteList() {
    const [quoteData, setQuoteData] = useState([])
    // const user = JSON.parse(localStorage.getItem("user"))



    const handleAcceptQuotation = async (quoteId, table) => {
        try {
            const quotesTable = table === 'product' ? 'product_quotes' : 'quotes';
            const supplierOrderTable = table === 'product' ? 'supplier_order_product' : 'supplier_order';
            const supplierOfferTable = table === 'product' ? 'supplier_offer_product' : 'supplier_offer';
            // Update data in the quotes table
            const { data, error } = await supabase
                .from(quotesTable)
                .update({ status: 'accepted' })
                .eq('quote_id', quoteId)
                .select();
            if (error) {
                throw error;
            }
            console.log(data[0])
            // Update the supplier_offer table
            const {data:supplierOffer, error: offerError } = await supabase
                .from(supplierOfferTable)
                .update({ status: 'accepted' })
                .eq('quote_id', quoteId)
                .select()
            console.log(error)

            if (offerError) {
                throw offerError;
            }

            // Prepare the data for insertion based on the table type
            const insertData = {
                supplier_id: supplierOffer[0].supplier_id,
                dropshipper_id: data[0].dropshipper_id,
                quote_id: quoteId,
                total_amount: data[0].amount,
                order_id: data[0].order_id
            };

            if (table === 'product') {
                insertData.product_id = data[0].product_id;
            } else {
                insertData.order_number = data[0].order_number;
            }

            // Insert into supplier_order table
            const { data: supplierOrderData, error: supplierOrderError } = await supabase
                .from(supplierOrderTable)
                .insert(insertData)
                .select();

            if (supplierOrderError) {
                throw supplierOrderError;
            }

            toast.success("Accepted");
            console.log(supplierOrderData);
        } catch (error) {
            console.error('Error updating data:', error.message);
        }
    };

    const handleRejectQuotation = async (quoteId, table) => {
        try {
            const quotesTable = table === 'product' ? 'product_quotes' : 'quotes';

            // Update data in the quotes table
            const { data, error } = await supabase
                .from(quotesTable)
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
        fetchProductQuoteData();
        fetchQuoteData();
    }, []);
    const fetchQuoteData = async () => {
        try {

            let { data: supplier_offer, error } = await supabase
                .from('supplier_offer')
                .select(`*,
                        quotes (
                            *
                        )
                    `).neq("status", "accepted")


            console.log(supplier_offer)
            if (error) {
                throw error;
            }

            setQuoteData(supplier_offer);
        } catch (error) {
            console.error('Error fetching quote data:', error.message);
        }
    };
    const fetchProductQuoteData = async () => {
        try {

            let { data: supplier_offer, error } = await supabase
                .from('supplier_offer_product')
                .select(`*,
                        product_quotes (
                            *
                        )
                    `).neq("status", "accepted")


            if (error) {
                throw error;
            }

            setQuoteData(supplier_offer);
        } catch (error) {
            console.error('Error fetching quote data:', error.message);
        }
    };
    return (
        <div>  <Tabs className="w-full" defaultValue="table1">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger onClick={() => fetchQuoteData()} value="table1">Quotes On Order</TabsTrigger>
                <TabsTrigger onClick={() => fetchProductQuoteData()} value="table2">Quotes On Product</TabsTrigger>
            </TabsList>
            <TabsContent value="table1"><Table>
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
                                    {/* <DropdownMenuItem>View details</DropdownMenuItem> */}
                                    <DropdownMenuItem><div onClick={() => handleAcceptQuotation(d.quote_id)}>Accept Quote</div></DropdownMenuItem>
                                    <DropdownMenuItem><div onClick={() => handleRejectQuotation(d.quote_id)} >Reject Quote</div></DropdownMenuItem>
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
            </TabsContent>
            <TabsContent value="table2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quotation ID</TableHead>
                            <TableHead>Product ID</TableHead>
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
                            <TableCell>{d?.product_quotes?.product_id}</TableCell>
                            <TableCell>{d?.supplier_name}</TableCell>
                            <TableCell>{d?.estimated_delivery}</TableCell>
                            <TableCell>{d?.status}</TableCell>
                            <TableCell>€ {d?.product_quotes?.amount}</TableCell>
                            <TableCell>€ {d?.supplier_offer}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"><MoreHorizontal /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {/* <DropdownMenuItem>View details</DropdownMenuItem> */}
                                        <DropdownMenuItem><div onClick={() => handleAcceptQuotation(d.quote_id, "product")}>Accept Quote</div></DropdownMenuItem>
                                        <DropdownMenuItem><div onClick={() => handleRejectQuotation(d.quote_id, "product")} >Reject Quote</div></DropdownMenuItem>
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
            </TabsContent>
        </Tabs>
        </div>
    )
}
