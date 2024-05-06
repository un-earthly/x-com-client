"use client"
import { createShopifyClient, fetchProducts } from "@/api";
import { useEffect, useState } from "react";

import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function ProdctList() {
    const [data, setData] = useState([])
    useEffect(() => {
        async function fetchShopifyData() {
            const products = await fetchProducts()
            setData(products.products)
            console.log(products.products)
        }
        fetchShopifyData()
    }, [])
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
                            <TableCell><Link href={`/product/list/${d?.id}`}><Button>Details</Button></Link></TableCell>
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
