"use client"
import Image from "next/image"
import Link from "next/link"
import {
    CheckCircle2,
    Edit,
    Eye,
    MoreHorizontal,
    PlusCircle,
    Search,
    Trash,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { supabase } from "@/api"
import { formatDate } from "@/lib/utils"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ROLE_ADMIN } from "@/lib/constant"


export default function TicketList() {
    const [data, setData] = useState([])
    useEffect(() => {

        async function getDate() {
            const { data: { session: { user } } } = await supabase.auth.getSession()
            let ticketList;
            if (JSON.parse(localStorage.getItem('user')).role === ROLE_ADMIN) {
                const { data: ticketListData, error: ticketError } = await supabase
                    .from('support_tickets')
                    .select()
                ticketList = ticketListData
            } else {
                const { data: ticketListData, error: ticketError } = await supabase
                    .from('support_tickets')
                    .select()
                    .eq("user_id", user.id)
                ticketList = ticketListData
            }
            setData(ticketList)
        }
        getDate()
    }, [data])
    const handleMarkAsResolved = async (id) => {
        const { data, error } = await supabase
            .from("support_tickets")
            .update({
                status: "closed",
                resolve_at: new Date().toISOString()
            }).eq("id", id).select()
        toast.success("Marked !");

        if (error) {
            toast.error(error.message);
        }
    }
    const handleDelete = async (id) => {
        const { error } = await supabase
            .from("support_tickets")
            .delete().eq("id", id)
        toast.success("Deleted!")
        if (error) {
            toast.error(error.message);
        }
    }

    const ticketColumns = [
        {
            accessorKey: "id",
            header: "Ticket ID",
        },

        {
            accessorKey: "name",
            header: <div >Name</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "priority",
            header: "Priority",
        },
        {
            accessorKey: "issue_at",
            header: "Issue At",
        },
        {
            accessorKey: "resolve_at",
            header: "Resolve At",
        },
        {
            id: "actions",
            header: <div className="text-right"  >
                Actions
            </div>,
        },
    ]
    return (


        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">

            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>Tickets</CardTitle>
                            <CardDescription>
                                Manage your tickets and view resolve the user issues.
                            </CardDescription>
                        </div>
                        <Link href="/ticket/create">
                            <Button className="ml-auto gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Create
                                </span>
                            </Button>
                        </Link>
                    </div>

                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            {
                                ticketColumns.map(c => <TableHead key={c.accessorKey}>{c.header}</TableHead>)
                            }
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? data.map(d => <TableRow key={d.id}>
                                <TableCell >
                                    {d.id}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {d.ticket_subject}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{d.status ? d.status : "Awaiting"}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {d.priority}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {formatDate(d.issue_at)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {d.resolve_at ? formatDate(d.resolve_at) : "Yet to resolve"}
                                </TableCell>
                                <TableCell>

                                    <Dialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem><div className="flex" onClick={() => handleMarkAsResolved(d.id)}><CheckCircle2 size={16} className="me-3" /> Mark as resolved</div></DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href={`ticket/${d.id}`} className="flex">
                                                        <Eye size={16} className="me-3" />View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>

                                                    <DialogTrigger asChild>
                                                        <span className="flex"><Trash size={16} className="me-3" />Delete</span>
                                                    </DialogTrigger>


                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Delete Ticket</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure that you want to delete the ticket?
                                                </DialogDescription>
                                            </DialogHeader>

                                            <DialogFooter>

                                                <DialogTrigger asChild>
                                                    <Button variant="outline">
                                                        <span className="flex">Cancel</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <Button variant="destructive" onClick={() => handleDelete(d.id)} >Delete</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>) : <TableRow>
                                <TableCell
                                    colSpan={ticketColumns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}


