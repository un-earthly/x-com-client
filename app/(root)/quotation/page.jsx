"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ROLE_SUPPLIER, ROLE_USER } from '@/lib/constant'
import SupplierQuoteListing from '@/components/custom/SupplierQuoteListing'
import DropShipperQuoteList from '@/components/custom/DropShipperQuoteList'
import { PlusCircle } from 'lucide-react'

export default function Quotation() {
    const [user, setUser] = useState({})
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, [])
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">

            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>Quotations</CardTitle>
                            <CardDescription>
                                Manage your quotations with efficiency.
                            </CardDescription>
                        </div>
                        <Link href="/order">
                            <Button className="ml-auto gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add
                                </span>
                            </Button>
                        </Link>
                    </div>

                </CardHeader>
                <CardContent>


                    {user.role === ROLE_SUPPLIER ? <SupplierQuoteListing /> :
                        <DropShipperQuoteList />}
                </CardContent>
            </Card>
        </main>

    )
}


