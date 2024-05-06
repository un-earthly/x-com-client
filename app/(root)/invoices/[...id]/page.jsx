"use client"
import React, { useEffect, useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useParams } from 'next/navigation';
import { supabase } from '@/api';
import Link from 'next/link';

export default function Invoice() {
    const { id } = useParams();
    const [invoiceData, setInvoiceData] = useState({});
    useEffect(() => {
        async function loadDataAndConvertToJson() {
            try {
                // Load invoice data from the invoices table
                const { data: invoices } = await supabase.from("invoices").select();
                console.log(invoices)
                // Load customer data from the customers table
                const { data: customers } = await supabase.from("customers").select();

                // Load item data from the items table
                const { data: items } = await supabase.from("items").select();

                // Load invoice-item mapping data from the invoice_items table
                const { data: invoiceItems } = await supabase.from("invoice_items").select();


                // Iterate through each invoice
                invoices.forEach(invoice => {
                    // Find the corresponding customer
                    const customer = customers.find(c => c.id === invoice.customer_id);

                    // Find items associated with the current invoice
                    const invoiceItemsData = invoiceItems.filter(item => item.invoice_id === invoice.invoice_number);
                    const formattedItems = invoiceItemsData.map(item => {
                        const { description, quantity, price, tax } = items.find(i => i.id === item.item_id);
                        return { description, quantity, price, tax };
                    });

                    // Build the JSON object for the current invoice
                    const invoiceObject = {
                        invoice_number: invoice.invoice_number,
                        invoice_date: invoice.invoice_date,
                        id: invoice.id,
                        customer: {
                            id: customer.id,
                            name: customer.name,
                            address_line1: customer.address_line1,
                            address_line2: customer.address_line2,
                            address_line3: customer.address_line3,
                            email: customer.email,
                            phone: customer.phone
                        },
                        items: formattedItems,
                        note: invoice.note,
                        invoice_total: invoice.invoice_total
                    };

                    setInvoiceData(invoiceObject)
                });
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
            // Update customer data in the database
            await supabase.from("customers")
                .update(invoiceData.customer).match({ id: invoiceData.customer_id });

            // Update invoice data in the database
            const { data: updatedInvoice } = await supabase.from("invoices").update({
                invoice_number: invoiceData.invoice_number,
                invoice_date: invoiceData.invoice_date,
                note: invoiceData.note
            }).match({ id: invoiceData.id }).select();

            // Delete existing item data associated with the invoice from the database
            await supabase.from("invoice_items").delete().match({ invoice_id: invoiceData.id });

            // Insert updated item data into the database
            await Promise.all(invoiceData.items.map(async (item) => {
                const { data: newItem } = await supabase.from("items").insert({
                    invoice_id: updatedInvoice.id,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    tax: item.tax
                }).single();
                return newItem;
            })); lo

            console.log("Invoice data saved successfully");
        } catch (error) {
            console.error("Error saving invoice data:", error.message);
        }
    };


    return (
        <Card className="w-full max-w-4xl mx-auto" variant="2">
            <CardHeader className="space-y-4">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
                    <CardDescription>Invoice # {id[0]}</CardDescription>
                </div>
                <div className="grid gap-1 text-sm capitalize">
                    <div className="font-medium">Acme Inc</div>
                    <div>123 Street</div>
                    <div>City, State, Zip</div>
                    <div>United States</div>
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
                                        {invoiceData?.customer?.name}
                                        <br />
                                        {invoiceData?.customer?.phone}
                                    </div>
                                    <div>
                                        {invoiceData?.customer?.address_line1}
                                        <br />
                                        {invoiceData?.customer?.address_line2}
                                        <br />
                                        {invoiceData?.customer?.address_line3}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-medium">Invoice number</div>
                                <div>#{invoiceData?.invoice_number}</div>
                                <div className="font-medium">Date</div>
                                <div>{invoiceData?.invoice_date}</div>
                            </div>
                        </div>
                        <Table className="w-full border-collapse">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Description</TableHead>
                                    <TableHead className="w-1/4 text-xs">Qty</TableHead>
                                    <TableHead className="w-1/4 text-xs">Price</TableHead>
                                    <TableHead className="w-1/4 text-xs text-right">Tax</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoiceData?.items?.map((item, index) => <TableRow key={index} className="text-sm">
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell className="text-right">${item.tax}</TableCell>
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
                                <div>$ {calculateSubtotal}</div>
                                <div className="font-medium">Taxes</div>
                                <div>${calculateTotalTax}</div>
                                <div className="font-semibold">Total</div>
                                <div>${calculateTotal}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>}
            <CardFooter className="flex justify-end gap-2">
                {id[1] === "view" ? <>

                    {/* <Link href={`/invoices/${id[0]}/edit`}>
                        <Button variant="outline">Edit</Button>
                    </Link> */}
                    <Button onClick={undefined}>Download</Button>
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
