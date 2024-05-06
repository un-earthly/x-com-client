"use client"
import { fetchProductDetails } from '@/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { data } from 'autoprefixer';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState({})
  useEffect(() => {
    async function handleGetDetails() {

      const productDetails = await fetchProductDetails(id)
      console.log(productDetails.product)
      setProduct(productDetails.product)
    }
    handleGetDetails()
  }, [])
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4 md:px-0">
        <div className="grid gap-4 md:gap-10">
          <img
            alt="Product Image"
            className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
            height={600}
            src={product?.image?.src}
            width={600}
          />
          <div className="hidden md:flex gap-4 items-start">
            {product?.images?.map(d => <button key={d?.src} className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50">
              <img
                alt="Preview thumbnail"
                className="aspect-square object-cover"
                height={100}
                src={d?.src}
                width={100}
              />
              <span className="sr-only">View Image 1</span>
            </button>)}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product?.title}</h1>
            <p className="text-gray-500 text-lg">Soft and comfortable fleece sweatshirt</p>
          </div>
          <div className="space-y-2">
            {data?.body_html}
            <p className="font-bold text-2xl">$49.99</p>
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
        </div>

      </div>
    </div>
  )
}
