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
import { useRouter } from "next/navigation"
import Link from 'next/link'
import toast from "react-hot-toast"

const formSchema = z.object({
    email: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
    name: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
    phone: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
})
export default function Register() {

    const router = useRouter()


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            phone: "",
            name: ""
        },
    })
    async function onSubmit(values) {
        const { error, data } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
        });
        console.log({ values })
        if (!error) {
            const { user } = data;
            // Assign default role to the user
            const { error: insertError } = await supabase
                .from('user')
                .insert({
                    user_id: user.id,
                    role: "user",
                    user_name: values.name,
                    user_phone: values.phone,
                    user_email: values.email,
                });
            if (insertError) {
                console.error(insertError.message);
            } else {
                console.log("User signed up and default role assigned successfully.", user);
                toast.success("User signed up successfully.")
                router.push("/store-front")
            }
        } else {
            console.error(error.message);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 sm:w-3/5 lg:w-2/5 xl:w-1/5 mx-auto mt-20 p-5">
                <Image src={require("../../public/login.svg")} alt="login" height={300} width={300} />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="phone" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
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
                                <Input type="password" placeholder="password" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Register</Button>
                <p className="text-center text-xs ">
                    Already here? <Link href="/login" className="underline">Login</Link>
                </p>
            </form>
        </Form>
    )
}
