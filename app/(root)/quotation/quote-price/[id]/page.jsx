"use client"
import { fetchOrderDetails, supabase } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Label } from "@/components/ui/label"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"

import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import toast from 'react-hot-toast'

export default function QuotePrice() {
    const router = useRouter();
    const query = useSearchParams();
    const quote_id = query.get("quote_id")
    const { id } = useParams();
    const [orderData, setOrderData] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.from("supplier_offer").insert({
            quote_id,
            supplier_offer: e.target.offer.value,
            estimated_delivery: e.target.date.value,
            supplier_name: user.user_name,
            supplier_id: user.user_id,
            status: "pending"
        }).select()
        toast.success("Successfuly Offered Price!")
        router.push("/quotation")
        console.log(data, error)

    }
    useEffect(() => {
        (async function () {
            const { data, error } = await supabase
                .from("quotes")
                .select(`*, shop(*)`)
                .eq("order_id", id)
            console.log(data, error)
            const { order } = await fetchOrderDetails(id, {
                API_KEY: data[0].shop.api_key,
                SHOP_URL: data[0].shop.shop_domain,
                PASSWORD: data[0].shop.api_access
            });
            console.log(order)
            setOrderData(order)
        })()
    }, [])
    return (<section className="">
        <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center sm:gap-8 md:gap-10 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">

                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-gray-100 p-1 text-sm dark:bg-gray-800">
                            Details
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter">Order {orderData?.name} - {orderData?.customer?.first_name}{" "}{orderData?.customer?.last_name}</h1>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Product Details</h2>
                        {orderData?.line_items?.map((item, index) => (
                            <div key={index} className="grid gap-4 md:grid-cols-2 border rounded-lg shadow-md p-4">
                                {item.image_url && (
                                    <div>
                                        <img
                                            alt="Product Image"
                                            className="aspect-square object-cover rounded-lg"
                                            height={300}
                                            src={item.image_url}
                                            width={300}
                                        />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <span className='text-xs'>{item.vendor}</span>
                                        <h3 className="text-lg font-bold">{item.name}</h3>
                                        <div className="text-xl font-bold">${item.price}</div>
                                        <div className="flex items-center space-x-2">
                                            <Label htmlFor="quantity" className="text-sm text-gray-600">Quantity:</Label>
                                            <span className="text-xl">{item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}



                    </div>
                </div>

                <div className="flex flex-col">
                    <div className='w-full H-10'>
                        <Image src={require("../../../../../public/supplier-quote.svg")} height={100} width={450} />
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Offer Your Price
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={e => handleSubmit(e)} className='flex gap-10 flex-col'>
                                <div><Label>Offer Price</Label>
                                    <Input name="offer" placeholder="Enter Offer" /></div>
                                <div><Label>Estimated Delivery</Label>
                                    <Input name="date" type="date" /></div>
                                <Button type="submit">Submit</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </section>
    )
}


function HeartIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}


function StarIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}