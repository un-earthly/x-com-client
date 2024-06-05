"use client"
import { createShopifyClient, fetchProducts, supabase } from "@/api";
import { useEffect, useState } from "react";

import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function ProdctList() {
    const [data, setData] = useState([]);
    const [shop, setShop] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        async function fetchShopifyData() {
            const { data, error } = await supabase
                .from("shop")
                .select()
                .eq("user_id", user.user_id)
            setShop(data[0])
            const products = await fetchProducts({
                API_KEY: data[0].api_key,
                SHOP_URL: data[0].shop_domain,
                PASSWORD: data[0].api_access
            })
            setData(products.products)
            setLoading(false)
            console.log(products.products)
        }
        fetchShopifyData();
    }, []);
    if (loading) {
        return <p>
            Loading...
        </p>
    }
    const handleUpForQuote = async (data) => {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: quoteData, error } = await supabase
            .from("product_quotes")
            .insert({
                amount: data.variants[0].price,
                dropshipper_id: user.id,
                product_id: data.id,
                shop_id: shop.id
            }).select();

        if (error) {
            // Handle the error appropriately
            console.error("Error inserting data:", error.message);
        } else {
            toast.success("Quote successfully created");
            // Data inserted successfully, you can access the inserted data in quoteData
            console.log("Data inserted successfully:", quoteData);
        }

        console.log(quoteData, error)
        // const { data } = await supabase.from("product_quotes").insert()

    }
    return (
        <Card
            className="sm:col-span-2"
        >
            <CardHeader className="pb-3">
                <CardTitle>Manage Your Products</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Product Dashboard for Seamless
                    Management and Insightful Analysis.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card >

    )
}
