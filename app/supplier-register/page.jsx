"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { supabase } from "@/api"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function Component() {
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
const router  = useRouter()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });
            // Save user information to Supabase
            if (authData && !authError) {
                const { user } = authData;

                const { data, error } = await supabase
                    .from('user')
                    .insert({
                        user_id: user.id,
                        user_name: formData.name,
                        bio: formData.bio,
                        user_email: formData.email,
                        user_phone: formData.phone,
                        address: formData.address,
                        role: 'supplier'
                    }).select();

                console.log(data)
                if (error) {
                    throw error;
                }
            }
            if (authError) {
                throw error;
            }

            toast.success("Successfully registered");
            router.push("/login");

            // Reset form after successful submission
            setFormData({
                name: '',
                bio: '',
                email: '',
                phone: '',
                address: '',
                password: ''
            });

        } catch (error) {
            console.error('Error saving user data:', error.message);
            // Handle error
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-100 dark:bg-gray-900 px-4 py-12">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create an Account</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Fill out the form below to get started.</p>
                </div>
                <form className="space-y-6">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" value={formData.name} onChange={(e) => handleChange(e)} id="name" placeholder="Enter your name" required type="text" />
                    </div>
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea name="bio" value={formData.bio} onChange={(e) => handleChange(e)} className="min-h-[100px]" id="bio" placeholder="Tell us about yourself" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" id="email" value={formData.email} onChange={(e) => handleChange(e)} placeholder="Enter your email" required type="email" />
                    </div>
                    <div className="relative">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" value={formData.password} onChange={(e) => handleChange(e)} placeholder="Enter your password" required name="password" type={!showPassword ? 'text' : 'password'} />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-8 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input value={formData.phone} onChange={(e) => handleChange(e)} id="phone" placeholder="Enter your phone number" required type="tel" name="phone" />
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea value={formData.address} onChange={(e) => handleChange(e)} className="min-h-[100px]" id="address" placeholder="Enter your address" name="address" required />
                    </div>
                    <Button onClick={handleSubmit} className="w-full" type="submit">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    )
}