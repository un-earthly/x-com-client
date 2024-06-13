"use client"
import React, { useEffect, useState } from 'react'
import DashboardCard from '../custom/DashboardCard'
import BuyerIcon from '../custom/BuyerIcon'
import DelivariesIcon from '../custom/DelivariesIcon'
import GrowthIcon from '../custom/GrowthIcon'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'
import Link from 'next/link'
import { ActivityIcon, CreditCardIcon, DollarSignIcon, Eye, ShoppingBag, Ticket, User, User2, UserCog, UserX2, UsersIcon } from 'lucide-react'
import { supabase } from '@/api'
import { ROLE_SUPPLIER, ROLE_USER } from '@/lib/constant'
export default function AdminDashboard() {
    const [ticketData, setData] = useState([])
    const [dashboardCards, setDashboardCards] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        (async () => {
            try {
                let { data, error } = await supabase
                    .from("support_tickets")
                    .select(`*,user(*)`)
                    .eq("priority", "high");

                if (error) {
                    throw error;
                }
                let { data: userData, error: userError } = await supabase
                    .from("user")
                    .select()
                    .eq("role", ROLE_USER);

                if (userError) {
                    throw userError;
                }
                let { data: supplierData, error: supplierError } = await supabase
                    .from("user")
                    .select()
                    .eq("role", ROLE_SUPPLIER);

                if (supplierError) {
                    throw supplierError;
                }
                let { data: orderData, error: orderError } = await supabase
                    .from("supplier_order")
                    .select()

                if (orderError) {
                    throw orderError;
                }
                setData(data);
                setDashboardCards([...dashboardCards, {
                    header: "Recent Orders",
                    value: orderData.length,
                    message: orderData.length + "new tickets to resolve",
                    icon: <ShoppingBag />
                }, {
                    header: "Total Dropshippers",
                    value: userData.length,
                    message: userData.length + "new tickets to resolve",
                    icon: <User />
                }, {
                    header: "Total Suppliers",
                    value: supplierData.length,
                    message: supplierData.length + "new tickets to resolve",
                    icon: <UserCog />
                }, {
                    header: "Recent Tickets",
                    value: data.length,
                    message: data.length + "new tickets to resolve",
                    icon: <Ticket />
                },
                ])
                console.log(data);
            } catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false)
            }
        })();

    }, [])
    const data = [
        {
            id: 1,
            title: 'Recent Deliveries',
            value: 80,
            icon: <DelivariesIcon h="100" w="100" color="rgb(255 224 183)" />
        },
        {
            id: 2,
            title: 'Recent Orders',
            value: 20,
            icon: <GrowthIcon h="100" w="100" color="rgb(255 224 183)" />
        },
        {
            id: 3,
            title: 'Recent Customers',
            value: 10,
            icon: <BuyerIcon h="100" w="100" color="rgb(255 224 183)" />
        }
    ]

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
    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <div className='space-y-5'>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {dashboardCards?.map(e => <Card key={e.id} x-chunk="dashboard-01-chunk-0">
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
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[400px]'>
                        <ResponsivePie
                            data={data}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            borderWidth={1}
                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        0.2
                                    ]
                                ]
                            }}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        2
                                    ]
                                ]
                            }}
                            defs={[
                                {
                                    id: 'dots',
                                    type: 'patternDots',
                                    background: 'inherit',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    size: 4,
                                    padding: 1,
                                    stagger: true
                                },
                                {
                                    id: 'lines',
                                    type: 'patternLines',
                                    background: 'inherit',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10
                                }
                            ]}
                            fill={[
                                {
                                    match: {
                                        id: 'ruby'
                                    },
                                    id: 'dots'
                                },
                                {
                                    match: {
                                        id: 'c'
                                    },
                                    id: 'dots'
                                },
                                {
                                    match: {
                                        id: 'go'
                                    },
                                    id: 'dots'
                                },
                                {
                                    match: {
                                        id: 'python'
                                    },
                                    id: 'dots'
                                },
                                {
                                    match: {
                                        id: 'scala'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'lisp'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'elixir'
                                    },
                                    id: 'lines'
                                },
                                {
                                    match: {
                                        id: 'javascript'
                                    },
                                    id: 'lines'
                                }
                            ]}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 0,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#999',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>

                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>
                        Urgent Tickets
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {
                                        ticketColumns.map(c => <TableHead key={c.accessorKey}>{c.header}</TableHead>)
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    ticketData.map(td => <TableRow key={td.id}>
                                        <TableCell>
                                            {td.id}
                                        </TableCell>
                                        <TableCell>
                                            {td.ticket_subject}
                                        </TableCell>
                                        <TableCell>
                                            {td.status}
                                        </TableCell>
                                        <TableCell>
                                            {td.priority}
                                        </TableCell>
                                        <TableCell>
                                            {td.issue_at}
                                        </TableCell>
                                        <TableCell>
                                            {td.resolve_at ? td.resolve_at : "Yet to resolve"}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`ticket/${td.id}`}>
                                                <div className='flex justify-end'>
                                                    <Eye />
                                                </div>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
