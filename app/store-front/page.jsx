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
    const [shopName, setShopName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [shopUrl, setShopUrl] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const validateInputs = () => {
        if (!shopName || !apiKey || !shopUrl || !accessToken) {
            setError('All fields are required.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        setLoading(true);

        const { data: { session: { user } }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
            console.error('Error getting session:', sessionError.message);
            setLoading(false);
            return;
        }

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
            setLoading(false);
            if (error) {
                console.error('Error saving storefront information:', error.message);
                toast.error("Error saving storefront information.");
            } else {
                console.log('Storefront information saved successfully.');
                toast.success("Storefront information saved successfully.");
                router.push('/login');
            }
        } else {
            setLoading(false);
            toast.error("No user session found.");
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
                        {error && <p className="text-red-500">{error}</p>}
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Connecting..." : 'Connect'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
