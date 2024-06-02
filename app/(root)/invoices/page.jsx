"use client"

import * as React from "react"
import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUpDown, ChevronDown, Delete, DeleteIcon, Eye, EyeIcon, MoreHorizontal, PlusCircle, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { supabase } from "@/api"
import toast from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLE_ADMIN, ROLE_SUPPLIER, ROLE_USER } from "@/lib/constant"


export default function DataTableDemo() {
  const [editStatus, setEditState] = React.useState(false);
  const [status, setStatus] = React.useState("")
  const [role, setRole] = React.useState("");
  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"))?.role;
    setRole(data)
  }, [])
  const handleStatusUpdate = async (status, id) => {
    console.log(id)
    const { data: updatedStatus, error } = await supabase.from("invoices")
      .update({ status }).eq("invoice_number", id).select("status");
    console.log(error)
    setStatus(status);
    setEditState(false);
    if (!error) {

      setData(prevData => {
        // Find the index of the row with the matching invoice_id
        const rowIndex = prevData.findIndex(row => row.invoice_number === id);
        if (rowIndex !== -1) {
          // Create a new array with the updated status for the row
          const newData = [...prevData];
          newData[rowIndex] = { ...newData[rowIndex], status: updatedStatus[0].status };
          return newData;
        }
        return prevData;
      });
      toast.success("Successfully updated status")
    }
    toast.error("error while updating")

    console.log(data, updatedStatus)

  }
  const handleDeleteInvoice = async (id) => {
    try {

      // Delete invoice record from the 'invoices' table
      await supabase
        .from("invoices")
        .delete()
        .eq("invoice_number", id);



      // Show success message
      toast.success("Successfully deleted invoice, related records, and customer");
    } catch (error) {
      // Handle errors
      console.error("Error deleting invoice, related records, and customer:", error.message);
      toast.error("An error occurred while deleting invoice, related records, and customer");
    }
  };



  const [data, setData] = React.useState([])
  React.useEffect(() => {
    async function loadDataAndConvertToJson() {
      const { data: { session: { user } } } = await supabase.auth.getSession()
      try {
        if (role === ROLE_ADMIN) {
          const { data: invoicesData } = await supabase.from("invoices").select();
          console.log(invoicesData)
          setData(invoicesData)
        } else if (role === ROLE_SUPPLIER) {
          const { data: invoicesData, error } = await supabase.from("supplier_invoices")
            .select(`
              *,
              invoices (
                *
              )
            `)

          setData(invoicesData)
        } else if (role === ROLE_USER) {
          const { data: invoicesData, error } = await supabase.from("dropshipper_invoices")
            .select(`
              *,
              invoices (
                *
              )
            `)
          console.log(invoicesData, error)
          setData(invoicesData)
        }


      } catch (error) {
        console.error("An error occurred while loading and converting data:", error.message);
        return null; // Return null or handle the error appropriately
      }
    }

    loadDataAndConvertToJson();
  }, [role]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage your Invoices and manage orders.
              </CardDescription>
            </div>
            {role === ROLE_ADMIN && <Link href="/invoices/create">
              <Button className="ml-auto gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create
                </span>
              </Button>
            </Link>}
          </div>

        </CardHeader>
        <CardContent>
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>
                  Invoice Id
                </TableHead>
                <TableHead>
                  Sent To
                </TableHead>
                <TableHead>
                  Total Amount
                </TableHead>
                <TableHead>
                  Due Date
                </TableHead>
                <TableHead>
                  status
                </TableHead>
                <TableHead>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? data.map(d => <TableRow key={d.invoice_number}>
                {role === ROLE_ADMIN ? <>
                  <TableCell
                  >
                    # {d.invoice_number}
                  </TableCell>
                  <TableCell
                    className="capitalize"
                  >
                    {d.sent_to}
                  </TableCell>
                  <TableCell
                  >
                    {d.total_price}
                  </TableCell>
                  <TableCell
                  >
                    {d.due_date}
                  </TableCell>
                  <TableCell
                  >
                    {editStatus ? <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0">
                          <span className="capitalize flex items-center space-x-2">{d.status}<ChevronDown className="h-4 w-4" /></span>

                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{status}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("send", d.invoice_number)}>Send</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("in progress", d.invoice_number)}>In Progress</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("verifying", d.invoice_number)}>Verifying</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("unpaid", d.invoice_number)}>Unpaid</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("paid", d.invoice_number)}>Paid</div></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> : <div className="capitalize">{d.status}</div>}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={`/invoices/${d.invoice_number}/view`}>View invoice details</Link></DropdownMenuItem>
                        <DropdownMenuItem > <div onClick={() => setEditState(true)}>Update Status</div></DropdownMenuItem>
                        {role === ROLE_ADMIN && <>
                          <DropdownMenuItem>
                            <div onClick={() => handleDeleteInvoice(d.invoice_number)}>Delete invoice</div></DropdownMenuItem>
                        </>}</DropdownMenuContent>
                    </DropdownMenu >
                  </TableCell>
                </> : <>

                  <TableCell
                  >
                    # {d.invoices.invoice_number}
                  </TableCell>
                  <TableCell
                  >
                    # {d.invoices.order_number}
                  </TableCell>
                  <TableCell
                  >
                    {d.invoices.total_price}
                  </TableCell>
                  <TableCell
                  >
                    {d.invoices.due_date}
                  </TableCell>
                  <TableCell
                  >
                    {editStatus ? <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0">
                          <span className="capitalize flex items-center space-x-2">{d.status}<ChevronDown className="h-4 w-4" /></span>

                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{status}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("send", d.invoices.invoice_number)}>Send</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("in progress", d.invoices.invoice_number)}>In Progress</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("verifying", d.invoices.invoice_number)}>Verifying</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("unpaid", d.invoices.invoice_number)}>Unpaid</div></DropdownMenuItem>
                        <DropdownMenuItem><div className="w-full" onClick={() => handleStatusUpdate("paid", d.invoices.invoice_number)}>Paid</div></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> : <div className="capitalize">{d?.status}</div>}
                  </TableCell>
                  <TableCell
                  >
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Link href={`/invoices/${d.invoices.invoice_number}/view`}>View invoice details</Link></DropdownMenuItem>
                          <DropdownMenuItem > <div onClick={() => setEditState(true)}>Update Status</div></DropdownMenuItem>
                          {role === ROLE_ADMIN && <>
                            <DropdownMenuItem>
                              <div onClick={() => handleDeleteInvoice(d.invoices.invoice_number)}>Delete invoice</div></DropdownMenuItem>
                          </>}</DropdownMenuContent>
                      </DropdownMenu >
                    </TableCell>
                  </TableCell>

                </>}
              </TableRow>) : <TableRow>
                <TableCell
                  colSpan={6}
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