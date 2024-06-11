"use client"
import { useState } from 'react';
import axios from 'axios';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast';

export default function SendInvitations() {
    const [emails, setEmails] = useState('');

    const handleSendInvitations = async () => {
        try {
            const response = await axios.post('http://localhost:8000/send-invitation', {
                recipientEmail: emails,
            });
            toast.success("Sent!")
            console.log('Invitations sent:', response.data);
        } catch (error) {
            console.error('Error sending invitations:', error.response.data);
        }
    };

    return (
        <Card className="w-full ">
            <CardHeader>
                <CardTitle>Send email invitations</CardTitle>
                <CardDescription>Personalize your email invitations before sending them.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter supplier email address" type="email" value={emails} onChange={(e) => setEmails(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSendInvitations}>Send invitations</Button>
            </CardFooter>
        </Card>
    )
}
