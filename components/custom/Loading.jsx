"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

export default function Loading({ progress }) {
    return <div className="h-screen w-full flex items-center justify-center">
        <Progress value={progress} className="w-[60%]" />
    </div>
}
