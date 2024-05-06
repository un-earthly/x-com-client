"use client"

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { markAsFullfilled, supabase } from "@/api"
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


export default function Component() {
    const [data, setData] = useState([]); 
    const [trackingNumber, setTrackingNumber] = useState('');
    const [carrier, setCarrier] = useState('');
    const [notes, setNotes] = useState('');
    const handleTrackShipment = (e) => {
        e.preventDefault();
      
        
    };

    // const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        // Function to fetch data from the supplier_order table
        async function getSupplierOrders() {
            try {
                // Query the supplier_order table
                const { data, error } = await supabase
                    .from('supplier_order')
                    .select();

                if (error) {
                    throw error;
                }
                console.log(data)
                setData(data);
            } catch (error) {
                console.error('Error fetching supplier orders:', error.message);
                return null;
            }
        }
        getSupplierOrders()
    }, [])
    async function handleFullfilment(id) {
        const order = await markAsFullfilled(id)
        console.log(order)
    }
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage your orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Dropshipper</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? data.map(e => <TableRow key={e.order_id}>
                            <TableCell>{e.order_id}</TableCell>
                            <TableCell>#{e?.order_number}</TableCell>
                            <TableCell>{e?.supplier_id}</TableCell>
                            <TableCell>{e?.dropshipper_id}</TableCell>
                            <TableCell>{e?.order_status}</TableCell>
                            <TableCell>${e?.total_amount}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="outline">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Order actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Invoice</DropdownMenuItem>
                                            <DropdownMenuItem>Mark As Paid</DropdownMenuItem>
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem><div onClick={() => handleFullfilment(e.order_id)}>Mark As Fullfilled</div></DropdownMenuItem>
                                            </DialogTrigger>
                                           

                                        </DropdownMenuContent>

                                    </DropdownMenu>
                                    <DialogContent className="sm:max-w-[450px]">
                                        <DialogHeader>
                                            <DialogTitle>Track Your Shipment</DialogTitle>
                                            <DialogDescription>Enter your shipping details below to track the status of your order.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right" htmlFor="tracking-number">
                                                    Tracking Number
                                                </Label>
                                                <Input
                                                    value={trackingNumber}
                                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                                    className="col-span-3" id="tracking-number" placeholder="Enter tracking number" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right" htmlFor="carrier">
                                                    Shipping Carrier
                                                </Label>
                                                <Input
                                                    value={carrier}
                                                    onChange={(e) => setCarrier(e.target.value)}
                                                    className="col-span-3" id="carrier" placeholder="Enter tracking number" />

                                            </div>
                                            <div className="grid grid-cols-4 items-start gap-4">
                                                <Label className="text-right" htmlFor="notes">
                                                    Notes
                                                </Label>
                                                <Textarea 
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="col-span-3 h-20" id="notes" placeholder="Add any additional notes" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <div>
                                                <Button onClick={handleTrackShipment} type="submit">Track Shipment</Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>) : <TableRow>
                            <TableCell
                                colSpan={7}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>}

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

