"use client"
import { createShopifyClient, fetchProducts, supabase } from "@/api";
import { useEffect, useState } from "react";

import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
export default function ProdctList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchShopifyData() {
            const products = await fetchProducts()
            setData(products.products)
            console.log(products.products)
        }
        fetchShopifyData();
    }, []);
    const handleUpForQuote = async (data) => {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: quoteData, error } = await supabase
            .from("product_quotes")
            .insert({
                amount: data.variants[0].price,
                dropshipper_id: user.id,
                product_id: data.id
            }).select();

        if (error) {
            // Handle the error appropriately
            console.error("Error inserting data:", error.message);
        } else {
            // Data inserted successfully, you can access the inserted data in quoteData
            console.log("Data inserted successfully:", quoteData);
        }

        console.log(quoteData, error)
        // const { data } = await supabase.from("product_quotes").insert()

    }
    return (
        <div>
            <div className="border rounded-lg w-full p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>status</TableHead>
                            <TableHead>Variants</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length > 0 ? data.map(d => <TableRow key={d.id}>
                            <TableCell ><img className="h-10 w-10" src={d?.image?.src} alt={d?.image?.alt} /></TableCell>
                            <TableCell className="font-semibold">{d?.title}</TableCell>
                            <TableCell className="font-semibold">{d?.status}</TableCell>
                            <TableCell className="font-semibold">{d?.variants?.length}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost"><MoreHorizontal /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Link href={`/product/list/${d?.id}`}>View Details</Link></DropdownMenuItem>
                                        <DropdownMenuItem><div onClick={() => handleUpForQuote(d)}>Up For Quote</div></DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </TableCell>
                        </TableRow>) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </div>
        </div>

    )
}