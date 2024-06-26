"use client"
import { fetchOrderDetails, fetchProductDetails, supabase } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getCurrencyIcon } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { ROLE_SUPPLIER } from '@/lib/constant'

export default function QuotePrice() {
    const router = useRouter();
    const query = useSearchParams();
    const quote_id = query.get("quote_id");
    const [shop, setShop] = useState({})
    const { id } = useParams();
    const [productData, setProducrtData] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // State for error messages

    const validateInputs = (offer, date) => {
        if (!offer || !date) {
            setError('All fields are required.');
            return false;
        }
        setError('');
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const offer = e.target.offer.value;
        const date = e.target.date.value;

        if (!validateInputs(offer, date)) return;

        setLoading(true);

        const { data, error } = await supabase.from("supplier_offer_product").insert({
            quote_id,
            supplier_offer: offer,
            estimated_delivery: date,
            supplier_name: user.user_name,
            supplier_id: user.user_id,
            // shop_id: shop.id
        }).select();

        setLoading(false);

        if (error) {
            console.error('Error offering price:', error.message);
            toast.error("Error offering price.");
        } else {
            toast.success("Successfully offered price!");
            router.push("/quotation");
            console.log(data, error);
        }
    };
    useEffect(() => {
        // console.log(id)
        (async function () {
            const { data, error } = await supabase
                .from("product_quotes")
                .select(`*, shop(*)`)
                .eq("product_id", id)
            setShop(data[0].shop)
            const { product } = await fetchProductDetails(id, {
                API_KEY: data[0].shop.api_key,
                SHOP_URL: data[0].shop.shop_domain,
                PASSWORD: data[0].shop.api_access
            });
            console.log(product)
            setProducrtData(product)
            setLoading(false)
        })()
    }, []);
    if (loading) {
        return <p>Loading...</p>
    }
    return (<section className="">
        <div className="container px-4 md:px-6">
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                <div className="flex flex-col justify-center space-y-4">
                    <Card className="w-full max-w-2xl border-none">
                        <div className="">
                            <div>
                                <img
                                    alt="Product Image"
                                    className="aspect-square object-cover rounded-lg"
                                    height={600}
                                    src={productData.image?.src}
                                    width={600}
                                />
                            </div>
                            <div className="grid gap-4 my-10">
                                <div>
                                    <div className='flex item-center justify-between'>
                                        <h2 className="text-2xl font-bold">{productData.title}</h2>
                                        <p className="text-gray-500 text-xl dark:text-gray-400">
                                            {productData.variants && productData.variants.length > 0 && (
                                                <span>{`${getCurrencyIcon("EUR")} ${productData.variants[0].price}`}</span>
                                            )}                                    </p>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {productData.tags}
                                    </p>
                                </div>
                                <div className='my-3' dangerouslySetInnerHTML={{ __html: productData?.body_html }}>
                                </div>

                            </div>
                        </div>
                    </Card>

                </div>
                {user.role === ROLE_SUPPLIER &&
                    <div className="flex flex-col sticky top-4">
                        <div className='w-full H-10'>
                            <Image src={require("../../../../../../public/supplier-quote.svg")} height={100} width={450} />
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
                                    {error && <p className="text-red-500">{error}</p>}

                                    <Button type="submit">Submit</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>}
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