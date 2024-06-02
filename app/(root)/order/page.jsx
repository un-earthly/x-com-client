"use client"
import * as React from "react"
import Link from "next/link"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/api"
import { MoreHorizontal } from "lucide-react"
import { fetchOrders } from '@/api.js'
import { getCurrencyIcon } from "@/lib/utils"
import toast from "react-hot-toast"
export default function Orders() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [user, setUser] = React.useState("")
    const [shop, setShop] = React.useState("");

    const handleUpForQuote = async (id, order_number, amount) => {
        try {
            const { data, error } = await supabase
                .from('quotes')
                .insert({
                    order_id: id,
                    status: "up_for_quote",
                    dropshipper_id: user.id,
                    order_number,
                    amount,
                    shop_id: shop.id
                })
                .select();

            if (error) {
                console.error('Error inserting quote data:', error.message);
                toast.error("Error inserting quote data");
                return;
            }

            toast.success("Quote successfully created");
            console.log('Data inserted successfully with status up_for_quote:', data);
        } catch (error) {
            console.error('Unexpected error:', error.message);
            toast.error("Unexpected error occurred");
        }
    };



    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        setUser(user)

        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from("shop")
                    .select()
                    .eq("user_id", user.user_id)
                console.log(data, error)
                setShop(data[0])
                const { orders } = await fetchOrders({
                    API_KEY: data[0].api_key,
                    SHOP_URL: data[0].shop_domain,
                    PASSWORD: data[0].api_access
                });
                console.log(orders)
                setData(orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
            setLoading(false); // Set loading to false after data is fetched

        }

        fetchData();
    }, [])
    if (loading) {
        return <p>
            Loading...
        </p>
    }
    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card
                    className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
                >
                    <CardHeader className="pb-3">
                        <CardTitle>Your Orders</CardTitle>
                        <CardDescription className="max-w-lg text-balance leading-relaxed">
                            Introducing Our Dynamic Orders Dashboard for Seamless
                            Management and Insightful Analysis.
                        </CardDescription>
                    </CardHeader>

                </Card>

            </div>
            <div className="rounded-md border">
                {user.role === "supplier" ? null : loading ? (
                    <div className="flex justify-center items-center h-24">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order Id</TableHead>
                                <TableHead>Ordered by</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.length > 0 ? data.map((d) => (
                                <TableRow key={d?.id}>
                                    <TableCell className="font-medium">#{d?.order_number}</TableCell>
                                    <TableCell>{d?.customer?.first_name} {" "}{d?.customer?.last_name}</TableCell>
                                    <TableCell>{d?.phone || d?.email}</TableCell>
                                    <TableCell>{d?.financial_status}</TableCell>
                                    <TableCell>{getCurrencyIcon("EUR")}{d?.total_price}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem><Link href={`/order/${d?.id}`}>View Details</Link></DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <div onClick={() => handleUpForQuote(d.id, d.order_number, d.total_price)}>Up For Quote</div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}



            </div>
        </div>

    )
}
