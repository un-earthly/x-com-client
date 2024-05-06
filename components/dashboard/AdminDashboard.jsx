import React from 'react'
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
export default function AdminDashboard() {
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

    const ticketData = [
        {
            "id": "magc9qgj",
            "name": "Ticket Creator 1",
            "status": "in progress",
            "priority": "low",
            "issue_at": "1/13/2016",
            "resolve_at": ""
        },
        {
            "id": "kqmwamtf",
            "name": "Ticket Creator 2",
            "status": "resolved",
            "priority": "low",
            "issue_at": "5/11/2014",
            "resolve_at": "1/12/2015"
        },
        {
            "id": "lt2egi3d",
            "name": "Ticket Creator 3",
            "status": "resolved",
            "priority": "high",
            "issue_at": "8/26/2014",
            "resolve_at": "12/7/2020"
        },
        {
            "id": "00vw9csa",
            "name": "Ticket Creator 4",
            "status": "resolved",
            "priority": "medium",
            "issue_at": "6/27/2014",
            "resolve_at": "11/17/2021"
        },
        {
            "id": "tbpsz1v8",
            "name": "Ticket Creator 5",
            "status": "resolved",
            "priority": "high",
            "issue_at": "4/3/2019",
            "resolve_at": "7/8/2021"
        },
        {
            "id": "izg5bmg9",
            "name": "Ticket Creator 6",
            "status": "resolved",
            "priority": "low",
            "issue_at": "12/10/2019",
            "resolve_at": "7/14/2020"
        },
        {
            "id": "thqgfbe2",
            "name": "Ticket Creator 7",
            "status": "new",
            "priority": "low",
            "issue_at": "5/7/2015",
            "resolve_at": ""
        },
        {
            "id": "d43l5bwp",
            "name": "Ticket Creator 8",
            "status": "resolved",
            "priority": "urgent",
            "issue_at": "6/16/2015",
            "resolve_at": "2/10/2019"
        },
        {
            "id": "skc0guvh",
            "name": "Ticket Creator 9",
            "status": "new",
            "priority": "low",
            "issue_at": "2/2/2020",
            "resolve_at": ""
        },
        {
            "id": "4kad9lep",
            "name": "Ticket Creator 10",
            "status": "new",
            "priority": "high",
            "issue_at": "9/10/2022",
            "resolve_at": ""
        }
    ]
    return (
        <div>
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
            <Card>
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
                                            {td.name}
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
                                            <Link href={`invoices/${td.id}`}>
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
