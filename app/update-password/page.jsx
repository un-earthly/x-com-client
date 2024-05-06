"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { supabase } from "@/api"

export default function Component() {
    const [password, setPassword] = useState("");
    const router = useRouter()
    const handlePassword = async () => {
        const { error } = await supabase.auth.updateUser({ password })
        if (!error) {
            toast.success("Successfully updated password")
            router.push("/login")
        }
        else toast.error(error.message)
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
                    <CardDescription>Enter your email below to update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your new password" type="password" />
                    </div>
                    <Button onClick={handlePassword} className="w-full" type="submit">
                        Update Password
                    </Button>
                </CardContent>
                <CardFooter>
                    <Link className="underline" href="#">
                        Return to login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}