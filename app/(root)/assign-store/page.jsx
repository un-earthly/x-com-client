"use client"
import { supabase } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { ROLE_SUPPLIER, ROLE_USER } from "@/lib/constant"
import { useEffect, useState } from "react"

export default function AssignStore() {
    const [shops, setShops] = useState([]);
    const [supplier, setSupplier] = useState([]);
    useEffect(() => {
        const fetchStores = async () => {
            const { data, error } = await supabase.from("shop").select()
            setShops(data);
            console.log(data)
        }
        const fetchSuppliers = async () => {
            const { data, error } = await supabase.from("user").select().eq("role", ROLE_SUPPLIER)
            setSupplier(data);
            console.log(data)
        }
        fetchStores()
        fetchSuppliers()
    }, [])
    const assignToStore = async (supplier_id, store_id) => {
        console.log(supplier_id, store_id)
        const { data, error } = await supabase.from("assigned_shop").insert({
            shop_id: store_id,
            supplier_id: supplier_id
        }).select()
        console.log(data, error)
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col">
                    <CardTitle>Assign Store</CardTitle>
                    <CardDescription>
                        Assign suppliers to the desired store
                    </CardDescription>
                </div>

            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {shops?.length > 0 ? shops?.map(sd => <div key={sd?.shop_name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2 capitalize">{sd?.shop_name}</h2>
                            {/* <p className="text-gray-500 dark:text-gray-400 mb-4">Wholesale supplier of office and cleaning supplies.</p> */}
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            Assign to Store
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {supplier?.map(d => <DropdownMenuItem key={d.user_id}><div onClick={() => assignToStore(d.user_id, sd.id)}>{d.user_name}</div></DropdownMenuItem>)}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>) : <></>}


                </div>
            </CardContent>
        </Card>
    )
}

function ChevronDownIcon(props) {
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
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}