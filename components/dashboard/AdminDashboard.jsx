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
import { ActivityIcon, CreditCardIcon, DollarSignIcon, Eye, UsersIcon } from 'lucide-react'
import { supabase } from '@/api'
export default function AdminDashboard() {
    const [ticketData, setData] = useState([])
    useEffect(() => {
        (async () => {
            try {
                let { data, error } = await supabase
                    .from("support_tickets")
                    .select(`*,user(*)`)
                    .eq("priority", "high");

                if (error) {
                    throw error;
                }
                setData(data)
                console.log(data);
            } catch (err) {
                console.log(err);
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
    const returnData = [
        {
            "customer_id": "001",
            "returns_count": 3
        },
        {
            "customer_id": "002",
            "returns_count": 1
        },
        {
            "customer_id": "003",
            "returns_count": 2
        },
    ];

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
        <div className='space-y-5'>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+201 since last hour</p>
                    </CardContent>
                </Card>
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
            {/* <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[400px]'>
                        <ResponsiveBar
                            data={returnData}
                            keys={['returns_count']}
                            indexBy="customer_id"
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
                                legend: 'Customer ID',
                                legendPosition: 'middle',
                                legendOffset: 32,
                                truncateTickAt: 0
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Returns Count',
                                legendPosition: 'middle',
                                legendOffset: -40,
                                truncateTickAt: 0
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 1.6]]
                            }}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                            role="application"
                            ariaLabel="Customer Returns Chart"
                            barAriaLabel={e => e.id + ": " + e.formattedValue + " returns"}
                        />

                    </div>

                </CardContent>
            </Card> */}

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
