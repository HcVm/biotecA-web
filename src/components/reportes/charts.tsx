"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts"

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#6366f1']

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-medium">{formatter ? formatter(entry.value) : entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export function RevenueChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                />
                <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `€${value}`}
                    tick={{ fill: '#64748b' }}
                />
                <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    content={<CustomTooltip formatter={(val: number) => `€${new Intl.NumberFormat('es-ES').format(val)}`} />}
                />
                <Bar
                    dataKey="total"
                    name="Ingresos"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export function StatusPieChart({ data }: { data: any[] }) {
    // Filter out zero values for cleaner chart
    const activeData = data.filter(d => d.value > 0)

    if (activeData.length === 0) return <div className="flex h-[300px] items-center justify-center text-muted-foreground">Sin datos</div>

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {activeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-600 text-sm">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}

export function DoctorPerformanceChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomTooltip />}
                />
                <Bar
                    dataKey="citas"
                    name="Citas Atendidas"
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
