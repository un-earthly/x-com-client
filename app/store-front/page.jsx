"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function StoreFront() {
    const [shopName, setShopName] = useState(''); // State for shop name
    const [apiKey, setApiKey] = useState(''); // State for API key
    const [shopUrl, setShopUrl] = useState(''); // State for shop URL
    const [accessToken, setAccessToken] = useState(''); // State for access token
   const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Save storefront information to Supabase

        const { data: { session: { user } }, error } = await supabase.auth.getSession()
        if (user) {
            const { error } = await supabase.from('shop').insert([
                {
                    user_id: user.id,
                    shop_name: shopName,
                    api_key: apiKey,
                    shop_domain: shopUrl,
                    api_access: accessToken
                },
            ]);
            if (error) {
                console.error('Error saving storefront information:', error.message);
            } else {
                console.log('Storefront information saved successfully.');
                // Redirect to desired page after storefront information is saved
                toast.success("Storefront information saved successfully.")
                router.push('/login');
            }
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Store Front</CardTitle>
                    <CardDescription>
                        Enter your store front API key and store front access token to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className="space-y-2">
                            <Label htmlFor="shop-name">Shop Name</Label>
                            <Input id="shop-name" placeholder="Enter your shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <Input id="api-key" placeholder="Enter your API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shop-url">Shop URL</Label>
                            <Input id="shop-url" placeholder="Enter your shop URL" value={shopUrl} onChange={(e) => setShopUrl(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="access-token">Access Token</Label>
                            <Input id="access-token" placeholder="Enter your access token" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full">Connect</Button>
                    </form>

                </CardContent>
            </Card>
        </div>
    );
}
