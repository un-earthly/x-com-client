"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ROLE_ADMIN, ROLE_SUPPLIER, ROLE_USER } from '@/lib/constant'
import { signOut } from '@/lib/server-component/auth'
import { CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Layout({ children }) {
    const [userRole, setUserRole] = useState("")
    const router = useRouter();
    const [activeLink, setActiveLink] = useState('Dashboard');
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    let userSession;
    useEffect(() => {
        userSession = JSON.parse(localStorage.getItem('user'))
        if (!userSession) {
            router.push("/login")
            return
        }
        setUserRole(userSession.role)
    }, [userSession]);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">X Commerce</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeLink === '/dashboard' ? ' text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/dashboard')}
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>


                            {userRole === ROLE_USER && <Link
                                href="/order"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeLink === '/order' ? 'text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/order')}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Orders
                            </Link>}
                            {userRole !== ROLE_USER && <Link
                                href="/supplier-order"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeLink === '/order' ? 'text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/order')}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Orders
                            </Link>}
                            {userRole === ROLE_USER && <Link
                                href="/product/list"
                                className={`flex items-center gap-3 rounded-lg ${activeLink === '/product/list' ? 'text-primary' : 'text-muted-foreground'} px-3 py-2 transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/product/list')}
                            >
                                <Package className="h-4 w-4" />
                                Products
                            </Link>}
                            <Link
                                href="/quotation"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeLink === '/quotation' ? ' text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/quotation')}
                            >
                                <Users className="h-4 w-4" />
                                Quotation
                            </Link>
                            <Link
                                href="/invoices"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeLink === '/invoices' ? ' text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/invoices')}
                            >
                                <LineChart className="h-4 w-4" />
                                Invoices
                            </Link>
                            <Link
                                href="/ticket"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${activeLink === '/ticket' ? ' text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}
                                onClick={() => handleLinkClick('/ticket')}
                            >
                                <Home className="h-4 w-4" />
                                Tickets
                            </Link>
                            {userRole === ROLE_ADMIN && <Link
                                href="/assign-store"
                                className={`flex items-center gap-3 rounded-lg ${activeLink === '/product/list' ? 'text-primary' : 'text-muted-foreground'} px-3 py-2 transition-all hover:text-primary`}
                            >
                                <Package className="h-4 w-4" />
                                Assign Store
                            </Link>}
                            {userRole === ROLE_ADMIN && <Link
                                href="/send-invite"
                                className={`flex items-center gap-3 rounded-lg ${activeLink === '/product/list' ? 'text-primary' : 'text-muted-foreground'} px-3 py-2 transition-all hover:text-primary`}
                            >
                                <Package className="h-4 w-4" />
                                Invite Suppliers
                            </Link>}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link
                                    href="#"
                                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeLink === 'Dashboard' ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
                                    onClick={() => handleLinkClick('Dashboard')}
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="#"
                                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeLink === 'Orders' ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
                                    onClick={() => handleLinkClick('Orders')}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Orders
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge>
                                </Link>
                                <Link
                                    href="#"
                                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeLink === 'Products' ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
                                    onClick={() => handleLinkClick('Products')}
                                >
                                    <Package className="h-5 w-5" />
                                    Products
                                </Link>
                                <Link
                                    href="#"
                                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${activeLink === 'Customers' ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
                                    onClick={() => handleLinkClick('Customers')}
                                >
                                    <Users className="h-5 w-5" />
                                    Customers
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link href="/profile">Settings</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem> <button onClick={() => signOut()}>Logout</button></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
