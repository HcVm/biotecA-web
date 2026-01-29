"use client"

import { useState } from "react"
import { Product } from "@/types/product"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Edit, Trash2, Archive, AlertTriangle, PackageOpen } from "lucide-react"

interface InventoryListProps {
    data: Product[]
}

export function InventoryList({ data }: InventoryListProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, SKU o categoría..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredData.length} productos encontrados
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Producto</TableHead>
                            <TableHead className="font-semibold text-slate-700">SKU / Categoria</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Precio</TableHead>
                            <TableHead className="text-center font-semibold text-slate-700">Stock</TableHead>
                            <TableHead className="text-center font-semibold text-slate-700">Estado</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700 px-4">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PackageOpen className="h-8 w-8 text-slate-300" />
                                        <p>No se encontraron productos.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-semibold">{product.name}</span>
                                            <span className="text-xs text-slate-500">{product.supplier || 'Proveedor no especificado'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded w-fit">
                                                {product.sku || "N/A"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{product.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-slate-700">
                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`font-bold ${product.stock_quantity <= product.min_stock_level ? "text-red-600" : "text-slate-700"}`}>
                                                {product.stock_quantity}
                                            </span>
                                            {product.stock_quantity <= product.min_stock_level && (
                                                <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={
                                            product.is_active
                                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                        }>
                                            {product.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Archive className="mr-2 h-4 w-4" /> Movimientos
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-rose-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
