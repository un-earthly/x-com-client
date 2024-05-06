"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SupportTicketForm() {
    const [ticketSubject, setTicketSubject] = useState('');
    const [issueType, setIssueType] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const router = useRouter()
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data: { session: { user } } } = await supabase.auth.getSession()

        try {
            // Upload image to Supabase Storage
            let imageUrl = null;
            if (imageFile) {
                const { data, error } = await supabase.storage
                    .from('support_ticket_images')
                    .upload(`support_tickets/${imageFile.name}`, imageFile, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) {
                    throw error;
                }

                imageUrl = data.Key;
            }

            // Insert support ticket data into Supabase
            const { data, error } = await supabase.from('support_tickets').insert([
                {
                    user_id: user.id,
                    ticket_subject: ticketSubject,
                    issue_type: issueType,
                    priority: priority,
                    description: description,
                    image_url: imageUrl,
                }
            ]);

            if (error) {
                console.error('Error saving support ticket:', error.message);
            } else {
                console.log('Support ticket saved successfully:', data);
                // Reset form fields after successful submission
                setTicketSubject('')
                setTicketSubject('');
                setIssueType('');
                setPriority('');
                setDescription('');
                setImageFile(null);
                toast.success("Successfully created")
                router.push("/ticket")
            }
        } catch (error) {
            console.error('Error saving support ticket:', error.message);
        }
    };
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Support Ticket</CardTitle>
                        <CardDescription>Fill in the details to create a support ticket.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="gap-8 flex flex-col">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Ticket Subject</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Billing ticket"
                                        value={ticketSubject}
                                        onChange={(e) => setTicketSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex gap-10">

                                    <div className="grid gap-2">
                                        <Label htmlFor="issue_type">Select an issue type</Label>

                                        <Select value={issueType} onValueChange={setIssueType}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select an issue type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select issue type</SelectLabel>
                                                    <SelectItem value="technical">Technical</SelectItem>
                                                    <SelectItem value="billing">Billing</SelectItem>
                                                    <SelectItem value="account">Account</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">Select Priority</Label>

                                        <Select value={priority} onValueChange={setPriority}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select Priority</SelectLabel>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        label="Description"
                                        id="description"
                                        rows={8}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your issue here"
                                        required
                                    />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture">Picture</Label>
                                    <Input onChange={handleImageChange} id="picture" type="file" />
                                </div>
                            </div>
                            <Button type="submit" className="mt-4 sm:mt-6">
                                Submit Ticket
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
