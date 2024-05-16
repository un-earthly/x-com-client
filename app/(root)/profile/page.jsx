"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"
import { supabase } from "@/api"
import toast from "react-hot-toast"

export default function Profile() {
  const [profileData, setProfileData] = useState([])
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shopName, setShopName] = useState(''); // State for shop name
  const [apiKey, setApiKey] = useState(''); // State for API key
  const [shopUrl, setShopUrl] = useState(''); // State for shop URL
  const [accessToken, setAccessToken] = useState(''); // State for access token

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
      }
    }
  };
  // Function to handle password reset
  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Password reset email sent successfully.");
      }
    } catch (error) {
      console.error("Error resetting password:", error.message);
      setErrorMessage("An error occurred while resetting the password.");
    }
  };
  useEffect(() => {

    async function handleProfileDataFetch() {
      const user = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('user')
        .select()
        .eq('user_id', user.data.user.id);
      console.log(data[0])
      setProfileData(data[0])
    }
    handleProfileDataFetch()
  }, [])
  return (
    <div className="p-10">
      <div className="px-4 space-y-6 sm:px-6">
        <header className="space-y-2">

          <div className="flex items-center space-x-3">
            <img
              alt="Avatar"
              className="rounded-full"
              height="96"
              src="https://via.placeholder.com/96x96"
              style={{
                aspectRatio: "96/96",
                objectFit: "cover",
              }}
              width="96"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{profileData?.user_name}</h1>
              <Button size="sm">Change photo</Button>
            </div>
          </div>
        </header>
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input defaultValue="Meadow Richardson" id="name" value={profileData?.user_name} placeholder="E.g. Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input value={profileData?.user_email} id="email" placeholder="E.g. jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Biography</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Enter your bio"
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
              <div className="pt-6">
                <Button>Save</Button>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>
                Connect With Your Shopify Account
              </CardTitle>
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
                <Button type="submit" >Connect</Button>
              </form>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}