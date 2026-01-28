import { getProducts } from "@/lib/actions/inventory"
import { NewProductDialog } from "@/components/inventario/new-product-dialog"
import { NewMovementDialog } from "@/components/inventario/new-movement-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export default async function InventarioPage() {
    const products = await getProducts()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
                    <p className="text-muted-foreground">
                        Control de stock y productos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <NewMovementDialog />
                    <NewProductDialog />
                </div>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No hay productos registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                        <div>{product.name}</div>
                                        <div className="text-xs text-muted-foreground">{product.supplier}</div>
                                    </TableCell>
                                    <TableCell>{product.sku || "-"}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="text-right">{product.price.toFixed(2)} €</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={product.stock_quantity <= product.min_stock_level ? "text-red-500 font-bold" : ""}>
                                                {product.stock_quantity}
                                            </span>
                                            {product.stock_quantity <= product.min_stock_level && (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={product.is_active ? "outline" : "destructive"}>
                                            {product.is_active ? "Activo" : "Descatalogado"}
                                        </Badge>
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
