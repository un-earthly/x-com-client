"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ROLE_SUPPLIER, ROLE_USER } from '@/lib/constant'
import SupplierQuoteListing from '@/components/custom/SupplierQuoteListing'
import DropShipperQuoteList from '@/components/custom/DropShipperQuoteList'
import { History, PlusCircle } from 'lucide-react'

export default function Quotation() {
    const [user, setUser] = useState({})
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, [])
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between">
                    <div>
                        <CardTitle>Quotations</CardTitle>
                        <CardDescription>
                            Manage your quotations with efficiency.
                        </CardDescription>
                    </div>
                    <div className='space-x-2'>
                        <Link href="/order">
                            <Button className="ml-auto gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add
                                </span>
                            </Button>
                        </Link>
                        {user.role !== ROLE_SUPPLIER ? <Link href="/quotation/history">
                            <Button className="ml-auto gap-1">
                                <History className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    History
                                </span>
                            </Button>
                        </Link> : <Link href="/quotation/history-supplier">
                            <Button className="ml-auto gap-1">
                                <History className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    History
                                </span>
                            </Button>
                        </Link>}
                    </div>
                </div>

            </CardHeader>
            <CardContent>


                {user.role === ROLE_SUPPLIER ? <SupplierQuoteListing /> :
                    <DropShipperQuoteList />}
            </CardContent>
        </Card>
        // </main>

    )
}


