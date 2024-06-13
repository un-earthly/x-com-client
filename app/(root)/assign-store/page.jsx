"use client"
import { supabase } from "@/api"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { ROLE_SUPPLIER } from "@/lib/constant"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AssignStore() {
    const [shops, setShops] = useState([]);
    const [supplier, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from("shop").select();
                if (error) throw error;
                setShops(data);
            } catch (error) {
                console.error('Error fetching stores:', error.message);
                toast.error('Error fetching stores');
            } finally {
                setLoading(false);
            }
        };

        const fetchSuppliers = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from("user").select().eq("role", ROLE_SUPPLIER);
                if (error) throw error;
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error.message);
                toast.error('Error fetching suppliers');
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
        fetchSuppliers();
    }, []);
    const assignToStore = async (supplier_id, store_id) => {
        try {
            // Check if the supplier is already assigned to the store
            const { data: existingAssignments, error: selectError } = await supabase
                .from("assigned_shop")
                .select()
                .eq("shop_id", store_id)
                .eq("supplier_id", supplier_id);

            if (selectError) {
                throw selectError;
            }

            // If an assignment already exists, show an error message and return early
            if (existingAssignments.length > 0) {
                toast.error("Supplier is already assigned to this store");
                return;
            }

            // Proceed with the assignment if no existing assignment was found
            const { data, error } = await supabase
                .from("assigned_shop")
                .insert({
                    shop_id: store_id,
                    supplier_id: supplier_id
                })
                .select();

            if (error) {
                throw error;
            }

            toast.success("Successfully assigned supplier");
        } catch (error) {
            console.error('Error assigning supplier:', error.message);
            toast.error('Error assigning supplier');
        }
    };

    if (loading) {
        return <p>Loading...</p>
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
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            Assign to Store
                                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {supplier?.map(d => <DropdownMenuItem key={d.user_id}><div onClick={() => assignToStore(d.user_id, sd.id)} className="flex space-x-3">
                                            <Avatar className="h-12 w-12">
                                                <img src={d.avatar} alt="user" />
                                                <AvatarFallback>{d.user_name.slice(0, 1)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1">
                                                <div className="font-medium capitalize">{d.user_name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{d.user_id}</div>
                                            </div>
                                        </div>
                                        </DropdownMenuItem>
                                        )}

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