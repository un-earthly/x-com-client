"use client"
import { fetchProductDetails, supabase } from '@/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getCurrencyIcon } from '@/lib/utils';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState({});
  const [imgSrc, setImgSrc] = useState("")
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    async function handleGetDetails() {

      const { data, error } = await supabase
        .from("shop")
        .select()
        .eq("user_id", user.user_id);
      setShop(data[0])
      const { product } = await fetchProductDetails(id, {
        API_KEY: data[0].api_key,
        SHOP_URL: data[0].shop_domain,
        PASSWORD: data[0].api_access
      })
      console.log(product)
      setProduct(product)
      setLoading(false)
    }
    handleGetDetails()
  }, []);
  const handleUpForQuote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location = "/login"
      window.localStorage.removeItem("user");
    }
    const { data: quoteData, error } = await supabase
      .from("product_quotes")
      .insert({
        amount: product.variants[0].price,
        dropshipper_id: user.id,
        product_id: product.id,
        shop_id: shop.id
      }).select();

    if (error) {
      console.error("Error inserting data:", error.message);
      toast.success("Error While inserting data");

    } else {
      toast.success("Quote successfully created");
      console.log("Data inserted successfully:", quoteData);
    }

    console.log(quoteData, error)

  }
  if (loading) {
    return <p>
      Loading...
    </p>
  }
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4 md:px-0">
        <div className="grid gap-4 md:gap-10">
          <img
            alt="Product Image"
            className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
            height={600}
            src={imgSrc || product?.image?.src}
            width={600}
          />
          <div className="hidden md:flex gap-4 items-start">
            {product?.images?.map(d => <button key={d?.src} className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50">
              <img
                alt="Preview thumbnail"
                className="aspect-square object-cover"
                height={100}
                src={d?.src}
                onClick={() => setImgSrc(d?.src)}
                width={100}
              />
              <span className="sr-only">View Image 1</span>
            </button>)}
          </div>

        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product?.title}</h1>
          </div>
          <div className="space-y-2">

            <p className="font-bold text-2xl">{getCurrencyIcon("EUR")}{product?.variants[0].price}</p>
          </div>
          <form className="grid gap-4 md:gap-10">
            {product?.options?.map(d => <div key={d?.name} className="grid gap-2">
              <Label className="text-base" htmlFor="color">
                {d?.name}
              </Label>
              <div className="flex">
                {d?.values?.map(d => <Label key={d}
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                  htmlFor="color-black"
                >
                  {d}
                </Label>)}
              </div>
            </div>
            )}

          </form>
          <div onClick={() => handleUpForQuote()}>

            <Button>
              Up for quote
            </Button>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: product?.body_html }} />


      </div>
    </div>
  )
}
