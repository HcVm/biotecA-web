"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

export function RevenueChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `€${value}`}
                />
                <Tooltip
                    formatter={(value: number) => [`€${value}`, "Ingresos"]}
                    cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export function StatusPieChart({ data }: { data: any[] }) {
    // Filter out zero values for cleaner chart
    const activeData = data.filter(d => d.value > 0)

    if (activeData.length === 0) return <div className="flex h-[300px] items-center justify-center text-muted-foreground">Sin datos</div>

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {activeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export function DoctorPerformanceChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="citas" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    )
}
