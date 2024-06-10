"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { fetchOrderDetails, supabase } from '@/api'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'

export default function AdminQuoteListing({ history }) {
    const [quoteData, setQuoteData] = useState([])
    const [productQuoteData, setProductQuoteData] = useState([])
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
        fetchQuoteData();
    }, []);
    const fetchQuoteData = async () => {
        try {
            const { data, error } = await supabase.from('quotes').select(`*,user(*),shop(*)`);
            if (error) throw error;

            if (history) {
                setQuoteData(data);
            } else {
                const { data: existingOffers, error: existingOffersError } = await supabase
                    .from('supplier_offer').select('quote_id');
                if (existingOffersError) throw existingOffersError;

                const existingQuoteIds = existingOffers.map(offer => offer.quote_id);
                const filteredQuotes = data.filter(quote => !existingQuoteIds.includes(quote.quote_id));
                setQuoteData(filteredQuotes);
            }
        } catch (error) {
            console.error('Error fetching quote data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductQuoteData = async () => {
        try {
            const { data, error } = await supabase.from('product_quotes').select(`*,user(*),shop(*)`);
            if (error) throw error;

            if (history) {
                setProductQuoteData(data);
            } else {
                const { data: existingOffers, error: existingOffersError } = await supabase
                    .from('supplier_offer_product').select('quote_id');
                if (existingOffersError) throw existingOffersError;

                const existingQuoteIds = existingOffers.map(offer => offer.quote_id);
                const filteredQuotes = data.filter(quote => !existingQuoteIds.includes(quote.quote_id));
                setProductQuoteData(filteredQuotes);
            }
        } catch (error) {
            console.error('Error fetching product quote data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <div>
            <Tabs className="w-full" defaultValue="table1">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="table1">Quotes On Order</TabsTrigger>
                    <TabsTrigger onClick={() => fetchProductQuoteData()} value="table2">Quotes On Product</TabsTrigger>
                </TabsList>
                <TabsContent value="table1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quotation ID</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Shop Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><div className="text-center">Actions</div></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quoteData?.length > 0 ? quoteData.map((d) => <TableRow key={d?.quote_id}>
                                <TableCell>#{d?.quote_id}</TableCell>
                                <TableCell>#{d?.order_number}</TableCell>
                                <TableCell>${d?.amount}</TableCell>
                                <TableCell>{d?.shop?.shop_name}</TableCell>
                                <TableCell><Badge>{d?.status === 'up_for_quote' ? 'Open For Quotation' : d?.status}</Badge></TableCell>


                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <Link href={{ pathname: `quotation/quote-price/${d?.order_id}`, query: { quote_id: d.quote_id } }}>  <Button>Details</Button></Link>
                                    </div>
                                </TableCell>
                            </TableRow>) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
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
                                <TableHead>Product Name</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Shop Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><div className="text-center">Actions</div></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productQuoteData?.length > 0 ? productQuoteData.map((d) => <TableRow key={d?.quote_id}>
                                <TableCell>#{d?.quote_id}</TableCell>
                                <TableCell>#{d?.product_id}</TableCell>
                                <TableCell>${d?.amount}</TableCell>
                                <TableCell>{d?.shop?.shop_name}</TableCell>
                                <TableCell><Badge>{d?.status === 'up_for_quote' ? 'Open For Quotation' : d?.status}</Badge></TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <Link href={{ pathname: `quotation/quote-price/product/${d?.product_id}`, query: { quote_id: d.quote_id, supplier_id: user.user_id } }}>  <Button>Details</Button></Link>
                                    </div>
                                </TableCell>
                            </TableRow>) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
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
