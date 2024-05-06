"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/api"
import Image from "next/image"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"


const formSchema = z.object({
    email: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
})

export default function Login() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    async function onSubmit(values) {
        const { error, data } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password
        })
        if (error) {
            toast.error(error.message)
            return
        }
        const { data: userData, error: userError } = await supabase
            .from('user')
            .select()
            .eq('user_id', data.user.id)
            .single();
        if (userError) {
            toast.error(userError.message)
            return
        }
        const sessionWithRoles = {
            ...data.session.user,
            ...userData

        };
        toast.success("Logged in!")
        localStorage.setItem('user', JSON.stringify(sessionWithRoles))

        router.push("/dashboard")
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:w-3/5 lg:w-2/5 xl:w-1/5 mx-auto mt-20 p-5">
                <Image src={require("../../public/login.svg")} alt="login" height={300} width={300} />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" type="password"  {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Login</Button>
                <div className="flex justify-between text-xs">
                    <p>
                        New here? <Link href="/register" className="underline">Register</Link>
                    </p>
                    <Link href="/forget">Forget password</Link>
                </div>

            </form>

        </Form>
    )
}
