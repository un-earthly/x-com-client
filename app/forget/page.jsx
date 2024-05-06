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
import { useToast } from "@/components/ui/use-toast"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"


const formSchema = z.object({
    email: z.string().min(2, {
        message: "email must be at least 2 characters.",
    })
})

export default function Login() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })
    async function onSubmit(values) {

        const { data, error } = await supabase.auth.resetPasswordForEmail(values.email, {
            redirectTo: 'https://x-comm-lyart.vercel.app/update-password',
        })
        if (error) {
            toast.error(error.message)
            return
        }


        console.log(data)
        // router.push("/dashboard")
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
                <Button type="submit">Submit</Button>
                <div className="flex justify-between text-xs">
                    <p>
                        Back to <Link href="/login" className="underline">Login</Link>
                    </p>
                </div>

            </form>

        </Form>
    )
}
