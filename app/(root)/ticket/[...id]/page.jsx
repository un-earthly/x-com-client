"use client"
import React, { useEffect, useState } from 'react'
import { CardContent, CardFooter, Card, CardTitle, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/api'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
export default function Page() {
  const pathname = usePathname();
  const [data, setData] = useState()
  const [replyData, setReplyData] = useState()
  useEffect(() => {
    async function loadIssueData() {
      try {
        // Fetch support ticket data and previous replies data simultaneously
        const [issueResponse, repliesResponse] = await Promise.all([
          supabase
            .from("support_tickets")
            .select()
            .eq("id", pathname.split("/")[2]),
          supabase
            .from("replies")
            .select()
            .eq("ticket_id", pathname.split("/")[2])
        ]);

        const { data: issueData, error: issueError } = issueResponse;
        const { data: previousRepliesData, error: previousReplyErrors } = repliesResponse;

        if (issueError) {
          // Handle error fetching support ticket data
          console.error("Error fetching support ticket data:", issueError.message);
          return;
        }

        if (previousReplyErrors) {
          // Handle error fetching previous replies data
          console.error("Error fetching previous replies data:", previousReplyErrors.message);
          return;
        }

        // Fetch user data based on the user_id from the support ticket data
        const userId = issueData[0].user_id;
        const userResponse = await supabase
          .from("user")
          .select()
          .eq("user_id", userId);

        const { data: userData, error: userError } = userResponse;

        if (userError) {
          // Handle error fetching user data
          console.error("Error fetching user data:", userError.message);
          return;
        }

        // Assuming only one issue is fetched
        const issue = issueData[0];
        const user = userData[0];

        // Combine data into a single object
        const combinedData = {
          ...issue,
          replies: previousRepliesData,
          ...user
        };

        console.log(combinedData);

        // Set combined data using setData
        setData(combinedData);
      } catch (error) {
        // Handle other unexpected errors
        console.error("Unexpected error:", error.message);
      }
    }

    loadIssueData();
  }, [data]);



  const handleReply = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"))
      console.log(user.user_name)
      // Extract ticket ID from pathname
      const ticketId = pathname.split("/")[2];

      // Save the reply to the database
      const { data: newReplyData, error: newReplyError } = await supabase
        .from("replies")
        .insert([{ ticket_id: ticketId, reply: replyData, by: user.user_name }])
        .select()

      if (newReplyError) {
        // Handle error saving reply
        console.error("Error saving reply:", newReplyError.message);
        return;
      }

      // Reply saved successfully
      // console.log("Reply saved:", newReplyData);
      toast.success("Reply saved")

      // Fetch support ticket data
      const { data: issueData, error: issueError } = await supabase
        .from("support_tickets")
        .select()
        .eq("id", ticketId);

      if (issueError) {
        // Handle error fetching support ticket data
        console.error("Error fetching support ticket data:", issueError.message);
        return;
      }

      // Optionally, you can perform additional actions after saving the reply and fetching support ticket data

    } catch (error) {
      // Handle other unexpected errors
      console.error("Unexpected error:", error.message);
    }
  };

  return (
    <div className="flex flex-col sm:gap-4">

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>Details of the reported issue with {data?.issue_type}.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-sm font-medium">Reported by:</div>
                <div className="text-sm text-gray-500">{data?.user_name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reported on: {formatDate(data?.issue_at)}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Reported Issue:</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{data?.ticket_subject}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Status:</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
            </div>
          </div>
          <div className="text-sm prose prose-sm prose-p:leading-normal my-3 dark:prose-invert">
            <div className="text-sm font-medium">Description:</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {data?.description}
            </div>

          </div>
          <div>
            <img src={data?.image_url} alt="" />
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Previous Replies</div>
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  {data?.replies?.map(reply => (
                    <div key={reply.id}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{reply?.by}</div>
                          <time className="text-sm text-gray-500 dark:text-gray-400">{formatDate(reply.created_at)}</time>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {reply.reply}
                        </p>
                      </div>
                    </div>
                  ))}


                  {/* <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">Admin</div>
                      <time className="text-sm text-gray-500 dark:text-gray-400">{formatDate(data?.created_at)}</time>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hi Olivia, I'm sorry to hear you're having trouble with the checkout process. Could you please provide
                      more details about the error message you're seeing? That will help me investigate the issue and get it
                      resolved for you.
                    </p>
                  </div> */}
                </div>

              </div>
            </div>
          </div>
        </CardContent>
        {<CardFooter>

          <div className="flex flex-col w-full space-y-4">
            <div className="space-y-2"> <h2 className='text-sm font-medium'>
              Enter Your Reply
            </h2>
              <Textarea onChange={(e) => setReplyData(e.target.value)} className="p-2 text-sm" placeholder="Write your reply..." />

            </div>
            <Button onClick={() => handleReply()} className="mr-auto">Reply</Button>

          </div>
        </CardFooter>
        }
      </Card>
    </div>
  )
}
