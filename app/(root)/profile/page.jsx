"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/api"
import toast from "react-hot-toast"

export default function Profile() {
  const [profileData, setProfileData] = useState([])
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [shopName, setShopName] = useState(''); // State for shop name
  // const [apiKey, setApiKey] = useState(''); // State for API key
  // const [shopUrl, setShopUrl] = useState(''); // State for shop URL
  // const [accessToken, setAccessToken] = useState(''); // State for access token
  const [shopData, setShopData] = useState({
    shop_name: '',
    api_key: '',
    shop_domain: '',
    api_access: ''
  })
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/96x96'); // State for avatar URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save storefront information to Supabase

    const { data: { session: { user } }, error } = await supabase.auth.getSession()
    if (user) {
      const { error } = await supabase.from('shop').insert([
        {
          user_id: user.id,
          shop_name: shopData.shop_name,
          api_key: shopData.api_key,
          shop_domain: shopData.shop_domain,
          api_access: shopData.api_access
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
  const handleUpload = async (event) => {
    let file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError.message);
      return;
    }

    const { data, error: urlError } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting avatar URL:', urlError.message);
      return;
    }

    const publicUrl = data.publicUrl;
    setAvatarUrl(publicUrl);

    if (publicUrl) {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (userId) {
        const { error: updateError } = await supabase
          .from('user')
          .update({ avatar: publicUrl })
          .eq('user_id', userId);
        toast.success("Updated Avatar")
        if (updateError) {
          toast.success("Error updating user avatar")
          console.error('Error updating user avatar:', updateError.message);
        }
      }
    }
  };
  const handleSaveProfile = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (userId) {
      const updates = {
        user_name: profileData.user_name,
        user_email: profileData.user_email,
        avatar: avatarUrl,
        bio: profileData.bio
      };

      const { error: updateError } = await supabase
        .from('user')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError.message);
        toast.error(updateError.message);
      } else {
        toast.success("Profile updated successfully.");

      }
    }
  };

  useEffect(() => {

    async function handleProfileDataFetch() {
      const { data: { session }, error: userError } = await supabase.auth.getSession()
      console.log(userError)
      if (!session) {
        localStorage.removeItem('user')
        window.location.href = "/login"
        return
      }
      const { data, error } = await supabase
        .from('user')
        .select()
        .eq('user_id', session.user.id);
      console.log(data[0])
      setProfileData(data[0])

      const { data: shopData } = await supabase.from('shop').select().eq("user_id", session.user.id)
      setShopData(shopData[0])
    }
    handleProfileDataFetch()
  }, [])

  return (
    <div className="p-10">
      <div className="px-4 space-y-6 sm:px-6">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="96"
                  src={profileData.avatar || avatarUrl}
                  style={{
                    aspectRatio: "96/96",
                    objectFit: "cover",
                  }}
                  width="96"
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">{profileData?.user_name}</h1>
                  <Input type="file" onChange={handleUpload} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input defaultValue="Meadow Richardson" id="name" onChange={(e) => setProfileData({ ...profileData, user_name: e.target.value })} value={profileData?.user_name} placeholder="E.g. Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input value={profileData?.user_email} onChange={(e) => setProfileData({ ...profileData, user_email: e.target.value })} id="email" placeholder="E.g. jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Biography</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Enter your bio"
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  value={profileData.bio}
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
              <div className="pt-6">
                <Button onClick={() => handleSaveProfile()}>Save</Button>
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
                  <Input id="shop-name" placeholder="Enter your shop name" value={shopData?.shop_name}
                    onChange={(e) => setShopData({ ...shopData, shop_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" placeholder="Enter your API key" value={shopData?.api_key}
                    onChange={(e) => setShopData({ ...shopData, api_key: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop-url">Shop URL</Label>
                  <Input id="shop-url" placeholder="Enter your shop URL"
                    value={shopData?.shop_domain}
                    onChange={(e) => setShopData({ ...shopData, shop_domain: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token</Label>
                  <Input id="access-token"
                    onChange={(e) => setShopData({ ...shopData, api_access: e.target.value })}
                    placeholder="Enter your access token" value={shopData?.api_access} />
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
