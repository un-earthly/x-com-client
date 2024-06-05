"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { getCurrencyIcon } from "@/lib/utils"
import { fetchOrderDetails, fetchOrders, fetchProductDetails, supabase } from "@/api"
import toast from "react-hot-toast"
import { ChevronDownIcon, InboxIcon, PlusCircle, Trash } from "lucide-react"

import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function CreateInvoice() {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState("");
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [invoiceOrderDetails, setInvoiceDetails] = useState({});
    const [invoiceId, setInvoiceId] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [invoiceTotal, setInvoiceTotal] = useState("")
    const [sendTo, setSendTo] = useState("")
    const [note, setNote] = useState("")
    useEffect(() => {
        async function fetchData() {
            const { data: orders } = await supabase.from("supplier_order").select(`*,quotes(*,shop(*))`);
            const { data: products } = await supabase.from("supplier_order_product").select(`*,product_quotes(*,shop(*))`);
            setOrders(orders);
            setProducts(products);
            console.log(products)
        }

        fetchData()

    }, [])


    async function handlefetchOrderDetails() {
        if (order.order_id) {
            const { order: orderData } = await fetchOrderDetails(order.order_id, {
                API_KEY: order.quotes.shop.api_key,
                SHOP_URL: order.quotes.shop.shop_domain,
                PASSWORD: order.quotes.shop.api_access
            })
            console.log(orderData)
            setInvoiceDetails(orderData)
        }

    }
    async function handlefetchProductDetails(p) {
        const { product: orderData } = await fetchProductDetails(p.product_id, {
            API_KEY: p.product_quotes.shop.api_key,
            SHOP_URL: p.product_quotes.shop.shop_domain,
            PASSWORD: p.product_quotes.shop.api_access
        })
        console.log(orderData)
        setProductDetails(orderData)
        // }

    }
    function generateInvoiceId() {
        const min = 100000; // Minimum 6-digit number
        const max = 999999; // Maximum 6-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const handleInvoiceCreation = async () => {
        const { data, error } = await supabase.from("invoices").insert({
            invoice_number: invoiceId,
            order_number: order.order_id,
            due_date: dueDate,
            note: note,
            total_price: invoiceTotal,
            status: "pending",
            sent_to: sendTo,
            user_id: sendTo === "dropshipper" ? order.dropshipper_id : order.supplier_id
        })
        if (sendTo === "dropshipper") {
            const { data, error } = await supabase.from("dropshipper_invoices").insert({
                invoice_number: invoiceId,
                dropshipper_id: order.dropshipper_id,
                status: "unpaid",
                received_date: new Date()
            }).select()
            console.log(data, error)
        }
        else if (sendTo === "supplier") {
            const { data, error } = await supabase.from("supplier_invoices").insert({
                invoice_number: invoiceId,
                supplier_id: order.supplier_id,
                status: "unpaid",
                received_date: new Date()
            }).select()
            console.log(data, error)
        }
        console.log(data, error)
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Create invoice</CardTitle>
                        <CardDescription>Enter invoice information to create.</CardDescription>
                    </div>

                </div>
            </CardHeader>
            <Tabs defaultValue="customer">
                <TabsList className="mb-6 border-b">
                    <TabsTrigger value="customer">Order</TabsTrigger>
                    <TabsTrigger value="invoice">Product</TabsTrigger>
                </TabsList>
                <TabsContent value="customer">
                    <div className="flex justify-between">

                        <p className="text-xl font-semibold">Invoice for Order</p>
                        <div className="flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2">
                                    <Button variant="ghost">
                                        {order ? (
                                            `# ${order.order_number}`
                                        ) : (
                                            "Select Order Number"
                                        )}
                                    </Button>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {orders?.map(o => <DropdownMenuItem onClick={() => { setProduct(null); setOrder(o); handlefetchOrderDetails(o.order_number) }} key={o?.order_number}>#{o.order_number}</DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {orders?.length > 0 && <div className="flex space-x-3">

                                {order?.order_number && <DropdownMenu >
                                    <DropdownMenuTrigger className="flex items-center gap-2">
                                        <Button variant="ghost" className="capitalize" >{sendTo ? sendTo : "Send to"}</Button>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent >
                                        <DropdownMenuLabel>Send To </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setSendTo("dropshipper")}>Dropshipper</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSendTo("supplier")}>Supplier</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>}

                            </div>}
                        </div></div>

                    {orders.length > 0 ? <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <Label htmlFor="number">Invoice number</Label>
                                <Input
                                    id="number"
                                    value={invoiceId}
                                    onChange={(e) => setInvoiceId(e.target.value)}
                                    placeholder="Enter invoice number"
                                />
                                <span
                                    onClick={() => setInvoiceId(generateInvoiceId())}
                                    className="absolute right-2 cursor-pointer text-xs top-1/2"
                                >
                                    generate
                                </span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Invoice Due date</Label>
                                <Input
                                    id="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    placeholder="Enter invoice date"
                                    type="date"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invoiceTotal">Invoice Total</Label>
                                <Input
                                    id="invoiceTotal"
                                    value={invoiceTotal}
                                    onChange={(e) => setInvoiceTotal(e.target.value)}
                                    placeholder="Enter Amount"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="items">Items</Label>
                            <div className="space-y-2" id="items">
                                {invoiceOrderDetails.length > 0 && invoiceOrderDetails?.line_items?.map((item, index) => {
                                    return (
                                        <div key={index} className="grid grid-cols-5 items-start gap-2">
                                            <Input readOnly className="col-span-2" value={item.title} />
                                            <Input readOnly value={item.quantity} />
                                            <Input readOnly value={`${getCurrencyIcon("EUR")} ${item.price}`} />
                                        </div>
                                    );
                                })}



                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note">
                                Additional notes

                            </Label>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}

                                id="note" placeholder="Enter Additional notes" />
                        </div>
                    </CardContent>
                        : <Card className="mx-auto my-10 max-w-md p-6 text-center">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <InboxIcon className="h-12 w-12 text-gray-400" />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">No orders found</h3>
                                    <p className="text-gray-500">It looks like you dont any orders yet.</p>
                                </div>
                            </div>
                        </Card>
                    }
                    {orders.length > 0 && <CardFooter>
                        <Button className="ml-auto" onClick={handleInvoiceCreation}>Create Invoice</Button>
                    </CardFooter>}
                </TabsContent>
                <TabsContent value="invoice">
                    <div className="flex justify-between">

                        <p className="text-xl font-semibold">Invoice for Product</p>
                        <div className="flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2">
                                    <Button variant="ghost">
                                        {product ? (
                                            product.product_id
                                        ) : (
                                            "Select Product Number"
                                        )}
                                    </Button>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {products?.map(o => <DropdownMenuItem onClick={() => { setProduct(o); handlefetchProductDetails(o) }} key={o?.product_id}>{o?.product_id}</DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {products?.length > 0 && <div className="flex space-x-3">

                                {product?.product_id && <DropdownMenu >
                                    <DropdownMenuTrigger className="flex items-center gap-2">
                                        <Button variant="ghost" className="capitalize" >{sendTo ? sendTo : "Send to"}</Button>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent >
                                        <DropdownMenuLabel>Send To </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setSendTo("dropshipper")}>Dropshipper</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSendTo("supplier")}>Supplier</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>}

                            </div>}
                        </div></div>

                    {products.length > 0 ? <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <Label htmlFor="number">Invoice number</Label>
                                <Input
                                    id="number"
                                    value={invoiceId}
                                    onChange={(e) => setInvoiceId(e.target.value)}
                                    placeholder="Enter invoice number"
                                />
                                <span
                                    onClick={() => setInvoiceId(generateInvoiceId())}
                                    className="absolute right-2 cursor-pointer text-xs top-1/2"
                                >
                                    generate
                                </span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Invoice Due date</Label>
                                <Input
                                    id="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    placeholder="Enter invoice date"
                                    type="date"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invoiceTotal">Invoice Total</Label>
                                <Input
                                    id="invoiceTotal"
                                    value={invoiceTotal}
                                    onChange={(e) => setInvoiceTotal(e.target.value)}
                                    placeholder="Enter Amount"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="items">Item</Label>
                            <div className="space-y-2" id="items">

                                <div className="grid grid-cols-5 items-start gap-2">
                                    <Input readOnly className="col-span-2" value={productDetails?.title} />
                                </div>
                                <div>
                                    <Label htmlFor="items">Variants</Label>
                                    <div className="space-y-2">
                                        {productDetails.variants && productDetails.variants.length > 0 && productDetails.variants.map((d,i) => <div key={i} className="grid grid-cols-5 items-start gap-2">
                                            <Input readOnly className="col-span-2" value={d?.title} />
                                            <Input readOnly value={d?.inventory_quantity} />
                                            <Input readOnly value={` ${d?.price}`} />
                                            <Input readOnly value={Number(d?.inventory_quantity) * Number(d?.price)} />
                                        </div>)}
                                   </div>
                                    {productDetails?.variants?.length > 0 && (
                                        <div className="space-y-2">
                                            <Label>Total</Label>
                                            <Input
                                                readOnly
                                                value={productDetails.variants
                                                    .reduce((total, variant) => total + parseFloat(variant.price) * variant.inventory_quantity, 0)
                                                    .toFixed(2)}
                                            />
                                       </div>
                                    )}


                                </div>


                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note">
                                Additional notes

                            </Label>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}

                                id="note" placeholder="Enter Additional notes" />
                        </div>
                    </CardContent>
                        : <Card className="mx-auto my-10 max-w-md p-6 text-center">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <InboxIcon className="h-12 w-12 text-gray-400" />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">No orders found</h3>
                                    <p className="text-gray-500">It looks like you dont any orders yet.</p>
                                </div>
                            </div>
                        </Card>
                    }
                    {orders.length > 0 && <CardFooter>
                        <Button className="ml-auto" onClick={handleInvoiceCreation}>Create Invoice</Button>
                    </CardFooter>}
                </TabsContent>
            </Tabs>
        </Card >
    )
}