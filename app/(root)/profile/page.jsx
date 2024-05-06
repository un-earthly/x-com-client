"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, Card, CardHeader } from "@/components/ui/card"
import { RadioGroup } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"
import { supabase } from "@/api"

export default function Profile() {
  const [profileData, setProfileData] = useState([])
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader>
              <div>Change Password</div>
              <div>For your security, please do not share your password with others.</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input  id="confirm-password" type="password" />
              </div>
            </CardContent>
          </Card> */}
        </div>
        <div className="pt-6">
          <Button>Save</Button>
        </div>
      </div>
    </div>
  )
}