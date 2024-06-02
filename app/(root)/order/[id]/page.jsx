"use client"
import { fetchOrderDetails, supabase } from '@/api';
import { useParams } from 'next/navigation';
import React from 'react'
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { formatDate, getCurrencyIcon } from '@/lib/utils';
export default function Page() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const { id } = useParams()

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from("shop")
                    .select()
                    .eq("user_id", user.user_id)
                console.log(data, error)

                const { order } = await fetchOrderDetails(id, {
                    API_KEY: data[0].api_key,
                    SHOP_URL: data[0].shop_domain,
                    PASSWORD: data[0].api_access
                });
                console.log(order)
                setData(order);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
            setLoading(false)
        }

        fetchData();
    }, []);
    if (loading) {
        return <p>
            Loading...
        </p>
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1.5">
                        <div className="font-medium">Order number</div>
                        <div>#{data?.order_number}</div>
                    </div>
                    <div className="grid gap-1.5">
                        <div className="font-medium">Order date</div>
                        <div>{formatDate(data?.processed_at)}</div>
                    </div>
                    <div>
                        <div className="font-medium">Shipping address</div>
                        <div>

                            {data?.shipping_address?.first_name}
                            {data?.shipping_address?.last_name}
                            <br />
                            {data?.shipping_address?.address1}
                            {data?.shipping_address?.address2}
                            <br />
                            {data?.shipping_address?.city}, {data?.shipping_address?.country} {data?.shipping_address?.zip}
                        </div>
                    </div>
                    <div>
                        <div className="font-medium">Billing address</div>
                        <div>

                            {data?.billing_address?.first_name} {" "}
                            {data?.billing_address?.last_name}
                            <br />
                            {data?.billing_address?.address1}
                            {data?.billing_address?.address2}
                            <br />
                            {data?.billing_address?.city}, {data?.billing_address?.country} {data?.billing_address?.zip}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Items Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {data?.line_items?.map(i => (
                            <div key={i.id} className="flex items-start gap-4 border p-4">
                                <div className="grid gap-1.5">
                                    <div className="font-medium">{i?.title}</div>
                                    <div>Quantity: {i?.quantity}</div>
                                    <div>Price per item: {getCurrencyIcon("EUR")}{i?.price}</div>
                                    <div className="font-medium">Total price: ${i?.quantity * i?.price}</div>
                                </div>
                            </div>
                        ))}

                    </div>
                </CardContent>
            </Card>
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Order Total</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-4">
                        <div className="grid gap-1.5">
                            <div>Subtotal</div>
                            <div>Shipping cost</div>
                            <div>Tax</div>
                            <div className="font-semibold">Total</div>
                        </div>
                        <div className="grid gap-1.5 ml-auto text-right">
                            <div> € {data.subtotal_price}</div>
                            <div> € {data?.shipping_lines[0].price}</div>
                            <div> € {data?.total_tax}</div>
                            <div className="text-xl"> € {data.total_price}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1.5">
                        <div className="font-medium">Current status</div>
                        <div>Shipped</div>
                    </div>
                    <div className="grid gap-1.5">
                        <div className="font-medium">Estimated delivery date</div>
                        <div>June 30, 2022</div>
                    </div>
                </CardContent>
            </Card> */}
        </>
    )
}
