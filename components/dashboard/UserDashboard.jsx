"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ResponsiveBar } from '@nivo/bar'
import {  Eye} from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from '@/api'

export const columns = [
  {
    accessorKey: "id",
    header: "Invoice ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "issue_date",
    header: "Issue Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: <div className="text-right"  >
      Actions
    </div>
  }
]
export default function UserDashboard() {
  const [hotProducts, setHotProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [cardData, setCardData] = useState([])
  useEffect(() => {
    async function getDashboardCardsData() {
      try {
        const { data, error } = await supabase
          .from('dashboard_cards')
          .select();

        if (error) {
          throw error;
        }

        setCardData(data)
      } catch (error) {
        console.error('Error fetching dashboard cards data:', error.message);
        throw error;
      }
    }
    getDashboardCardsData();
    async function getProductsData() {
      try {
        // Fetch data from the local server
        const response = await fetch("https://x-com-server.onrender.com/orders");

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Array to store products with quantities and names
        const productsArray = [];

        // Extract product IDs, names, and quantities from the orders
        data.orders.forEach(order => {
          order.line_items.forEach(lineItem => {
            const productId = lineItem.product_id;
            const productName = lineItem.name;
            const sales = lineItem.quantity;
            // Check if the product already exists in the array
            const existingProduct = productsArray.find(product => product.productId === productId);
            if (existingProduct) {
              // If product exists, update its quantity
              existingProduct.sales += sales;
            } else {
              // If product doesn't exist, add it to the array
              productsArray.push({ productId, productName, sales });
            }
          });
        });

        // Log the result
        setHotProducts(productsArray);

        // Set the data in state or do further processing
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    // Call the function to fetch products data
    getProductsData();

    async function getInvoiceData() {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select();

        if (error) {
          throw error;
        }
        console.log(data)
        setInvoices(data)
      } catch (error) {
        console.error('Error fetching dashboard cards data:', error.message);
        throw error;
      }
    }
    getInvoiceData()
  }, [])

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {cardData?.map(d => <Card key={d.card_id} x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{d.name}</CardTitle>
            {d.icon && <div dangerouslySetInnerHTML={{ __html: d.icon }} />}

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{d.value}</div>
            <p className="text-xs text-muted-foreground">{d.description}</p>
          </CardContent>
        </Card>)}

      </div>


      <Card>
        <CardHeader>
          <CardTitle>
            Hot Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[400px]'>
            <ResponsiveBar
              data={hotProducts}
              keys={['sales']}
              indexBy="productName"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Product',
                legendPosition: 'middle',
                legendOffset: 32,
                format: value => `${value}`
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Sales',
                legendPosition: 'middle',
                legendOffset: -40,
                format: value => `${value}`
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              role="application"
              ariaLabel="Hot Products Sales Chart"
              barAriaLabel={e => `${e.id}: ${e.formattedValue} sales`}
            />


          </div>

        </CardContent>


      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {
                      columns.map(c => <TableHead key={c.accessorKey}>{c.header}</TableHead>)
                    }
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    invoices ? invoices.map(td => <TableRow key={td.id}>
                      <TableCell>
                        {td.invoice_number}
                      </TableCell>
                      <TableCell>
                        $ {td.invoice_total}
                      </TableCell>
                      <TableCell>
                        {td.invoice_date}
                      </TableCell>
                      <TableCell className="capitalize">
                        {td.status ? td.status : "Unpaid"}
                      </TableCell>
                      <TableCell>
                        <Link href={`invoices/${td.invoice_number}`}>
                          <div className='flex justify-end'>
                            <Eye />
                          </div>
                        </Link>
                      </TableCell>
                    </TableRow>
                    ) : (<TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>)
                  }
                </TableBody>
              </Table>

            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  )
}
