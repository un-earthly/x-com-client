import React from 'react'

export default function DashboardCard({ title, value, icon }) {
    return (
        <div className="relative w-full bg-orange-100 p-5 flex flex-col gap-4 xl:p-10">
            <div>
                <h2 className='font-medium'>{title}</h2>
            </div>
            <div>
                <p className='text-7xl font-semibold'>{value}</p>
            </div>
            <div className="absolute right-8 bottom-0 text-orange-300">
                {icon}
            </div>
        </div>
    )
}
