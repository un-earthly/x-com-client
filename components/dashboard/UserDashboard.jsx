"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ResponsiveBar } from '@nivo/bar'
import { Eye, ShoppingBag, Ticket, User, UserCog } from 'lucide-react'
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
import { fetchOrders, supabase } from '@/api'

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
    header: "Due Date",
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
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem("user"))
    setUser(parsedUser)

    async function getDashboardCardsData() {
      setLoading(true);
      try {
        // Fetch shop data
        const { data: shopData, error: shopError } = await supabase
          .from('shop')
          .select()
          .eq("user_id", parsedUser.user_id);

        if (shopError) {
          throw new Error(`Failed to fetch shop data: ${shopError.message}`);
        }
        if (!shopData.length) {
          throw new Error("No shop data found for the user.");
        }
        console.log(shopData)
        // Fetch orders
        const { orders } = await fetchOrders({
          API_KEY: shopData[0].api_key,
          SHOP_URL: shopData[0].shop_domain,
          PASSWORD: shopData[0].api_access
        });
        const productsArray = [];
        orders.forEach(order => {
          order.line_items.forEach(lineItem => {
            const productId = lineItem.product_id;
            const productName = lineItem.name;
            const sales = lineItem.quantity;
            const existingProduct = productsArray.find(product => product.productId === productId);
            if (existingProduct) {
              existingProduct.sales += sales;
            } else {
              productsArray.push({ productId, productName, sales });
            }
          });
        });

        setHotProducts(productsArray);

        // Fetch shop supplier data
        const { data: shopSupplierData, error: shopSupplierError } = await supabase
          .from('assigned_shop')
          .select()
          .eq("shop_id", shopData[0].id);

        if (shopSupplierError) {
          throw new Error(`Failed to fetch shop supplier data: ${shopSupplierError.message}`);
        }

        // Fetch order quote data
        const { data: orderQuoteData, error: orderQuoteError } = await supabase
          .from('quotes')
          .select()
          .eq("shop_id", shopData[0].id);

        if (orderQuoteError) {
          throw new Error(`Failed to fetch order quote data: ${orderQuoteError.message}`);
        }

        // Fetch product quote data
        const { data: productQuoteData, error: productQuoteError } = await supabase
          .from('product_quotes')
          .select()
          .eq("shop_id", shopData[0].id);

        if (productQuoteError) {
          throw new Error(`Failed to fetch product quote data: ${productQuoteError.message}`);
        }

        console.log(productQuoteData);

        // Set card data
        setCardData([
          {
            header: "Recent Orders",
            value: orders.length,
            message: `${orders.length} new orders to review`,
            icon: <ShoppingBag />
          },
          {
            header: "Total Suppliers",
            value: shopSupplierData.length,
            message: `${shopSupplierData.length} suppliers available`,
            icon: <UserCog />
          },
          {
            header: "Total Order Quotes",
            value: orderQuoteData.length,
            message: `${orderQuoteData.length} order quotes available`,
            icon: <User />
          },
          {
            header: "Total Product Quotes",
            value: productQuoteData.length,
            message: `${productQuoteData.length} product quotes available`,
            icon: <Ticket />
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard cards data:', error.message);
      }
    }

    getDashboardCardsData();
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
        setLoading(false)

      } catch (error) {
        console.error('Error fetching dashboard cards data:', error.message);
        setLoading(false)
        throw error;

      }
    }
    getInvoiceData()
  }, [])

  if (loading) {
    return <p>
      Loading...
    </p>
  }
  return (
    <div className='space-y-5'>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {cardData?.map(e => <Card key={e.id} x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{e.header}</CardTitle>
            {e.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{e.value}</div>
            <p className="text-xs text-muted-foreground">{e.message}</p>
          </CardContent>
        </Card>)
        }

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
                        $ {td.total_price}
                      </TableCell>
                      <TableCell>
                        {td.due_date}
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
