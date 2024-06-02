"use client"
import React, { useEffect, useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';
import { fetchOrderDetails, supabase } from '@/api';
import Link from 'next/link';
import { getCurrencyIcon } from '@/lib/utils';

export default function Invoice() {
    const { id } = useParams();
    const [invoiceData, setInvoiceData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadDataAndConvertToJson() {
            try {

                // Load invoice data from the invoices table
                const { data: invoices, error } = await supabase
                    .from("invoices")
                    .select(`*, user(*)`)
                    .eq("invoice_number", id[0]);
                const { data: userShop, error: userShopErr } = await supabase.from("quotes").select(`*,shop(*),user(*)`).eq("order_id", invoices[0].order_number)

                const { order } = await fetchOrderDetails(userShop[0].order_id, {
                    API_KEY: userShop[0].shop.api_key,
                    SHOP_URL: userShop[0].shop.shop_domain,
                    PASSWORD: userShop[0].shop.api_access
                })
                setInvoiceData({ order, invoice_details: invoices[0] })
                setLoading(false)
                console.log({ order, invoice_details: invoices[0], user: userShop[0] })
            } catch (error) {
                console.error("An error occurred while loading and converting data:", error.message);
                return null;
            }
        }

        loadDataAndConvertToJson();


    }, [])


    const calculateSubtotal = invoiceData?.items?.reduce((total, item) => total + (item.quantity * item.price), 0)
    const calculateTotalTax = invoiceData?.items?.reduce((total, item) => total + item.tax, 0)
    const calculateTotal = (invoiceData?.items?.reduce((total, item) => total + (item.quantity * item.price), 0) ?? 0) +
        (invoiceData?.items?.reduce((total, item) => total + item.tax, 0) ?? 0)


    const handleCustomerChange = (field, value) => {
        setInvoiceData(prevState => ({
            ...prevState,
            customer: {
                ...prevState.customer,
                [field]: value
            }
        }));
    };

    const handleInvoiceChange = (field, value) => {
        setInvoiceData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleItemChange = (index, field, value) => {
        setInvoiceData(prevState => {
            const updatedItems = [...prevState.items];
            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };
            return {
                ...prevState,
                items: updatedItems
            };
        });
    };
    const handleSave = async () => {
        try {


            console.log("Invoice data saved successfully");
        } catch (error) {
            console.error("Error saving invoice data:", error.message);
        }
    };
    if (loading) {
        return <p>
            Loading ...
        </p>
    }

    return (
        <Card className="w-full max-w-4xl mx-auto" variant="2">
            <CardHeader className="space-y-4">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
                    <CardDescription>Invoice # {id[0]}</CardDescription>
                </div>
            </CardHeader>
            {id[1] === "edit" ? <CardContent className="p-0">
                <div className="border border-dashed border-gray-200 rounded-lg p-4 dark:border-gray-800">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="font-medium">Invoice to</div>
                            <div className="grid grid-cols-2 gap-1 capitalize">
                                <div className="font-medium">
                                    <input
                                        type="text"
                                        value={invoiceData?.customer?.name}
                                        onChange={e => handleCustomerChange("name", e.target.value)}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        value={invoiceData?.customer?.phone}
                                        onChange={e => handleCustomerChange("phone", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={invoiceData?.customer?.address_line1}
                                        onChange={e => handleCustomerChange("address_line1", e.target.value)}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        value={invoiceData?.customer?.address_line2}
                                        onChange={e => handleCustomerChange("address_line2", e.target.value)}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        value={invoiceData?.customer?.address_line3}
                                        onChange={e => handleCustomerChange("address_line3", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-medium">Invoice number</div>
                            <div>
                                <input
                                    type="text"
                                    value={invoiceData?.invoice_number}
                                    onChange={e => handleInvoiceChange("invoice_number", e.target.value)}
                                />
                            </div>
                            <div className="font-medium">Date</div>
                            <div>
                                <input
                                    type="date"
                                    value={invoiceData?.invoice_date}
                                    onChange={e => handleInvoiceChange("invoice_date", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <Table className="w-full border-collapse">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Description</TableHead>
                                <TableHead className="text-xs">Qty</TableHead>
                                <TableHead className="text-xs">Price</TableHead>
                                <TableHead className="text-xs">Tax</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoiceData?.items?.map((item, index) => (
                                <TableRow className="text-sm" key={index}>
                                    <TableCell>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={e => handleItemChange(index, "description", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(index, "quantity", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={e => handleItemChange(index, "price", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <input
                                            type="number"
                                            value={item.tax}
                                            onChange={e => handleItemChange(index, "tax", e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div className="space-y-2">
                            <div className="font-medium">Additional notes</div>
                            <div className="text-sm">
                                <textarea
                                    value={invoiceData?.note}
                                    onChange={e => handleInvoiceChange("note", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="font-medium">Subtotal</div>
                            <div>$ {calculateSubtotal}</div>
                            <div className="font-medium">Taxes</div>
                            <div>$ {calculateTotalTax}</div>
                            <div className="font-semibold">Total</div>
                            <div>$ {calculateTotal}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
                : <CardContent className="p-0">
                    <div className="border border-dashed border-gray-200 rounded-lg p-4 dark:border-gray-800">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="font-medium">Invoice to</div>
                                <div className="grid grid-cols-2 gap-1 capitalize">
                                    <div className="font-medium">
                                        {invoiceData?.invoice_details?.user?.user_name}
                                        <br />
                                    </div>
                                    <div>
                                        Email: {invoiceData?.invoice_details?.user?.user_email}
                                        <br />
                                        Phone: {invoiceData?.invoice_details?.user?.user_phone}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-medium">Invoice number</div>
                                <div>#{invoiceData?.invoice_details?.invoice_number}</div>
                                <div className="font-medium">Date</div>
                                <div>{invoiceData?.invoice_date}</div>
                            </div>
                        </div>
                        <Table className="w-full border-collapse">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Name</TableHead>
                                    <TableHead className="w-1/4 text-xs">Qty</TableHead>
                                    <TableHead className="w-1/4 text-xs">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoiceData?.order?.line_items?.map((item, index) => <TableRow key={index} className="text-sm">
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{getCurrencyIcon("EUR")}{item.price}</TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div className="space-y-2">
                                <div className="font-medium">Additional notes</div>
                                <div className="text-sm">{invoiceData?.note}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-medium">Subtotal</div>
                                <div>{getCurrencyIcon("EUR")} {invoiceData?.invoice_details?.total_price}</div>
                                <div className="font-medium">Taxes</div>
                                <div>{getCurrencyIcon("EUR")}{invoiceData?.order?.tax_lines[0]?.price}</div>
                                <div className="font-semibold">Total</div>
                                <div>{getCurrencyIcon("EUR")}{Number(invoiceData?.invoice_details?.total_price) + Number(invoiceData?.order?.tax_lines[0]?.price)}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>}
            <CardFooter className="flex justify-end gap-2">
                {id[1] === "view" ? <>

                    {/* <Link href={`/invoices/${id[0]}/edit`}>
                        <Button variant="outline">Edit</Button>
                    </Link> */}
                    {/* <Button onClick={undefined}>Download</Button> */}
                </> : id[1] === "preview" ?
                    <Link href={`/invoices/users`}>  <Button onClick={() => localStorage.setItem("invoice-id", id[0])}>Continue</Button></Link> : <>
                        <Link href={`/invoices/${id[0]}/view`}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button onClick={handleSave}>Save</Button>
                    </>}
            </CardFooter>
        </Card>
    );
}
