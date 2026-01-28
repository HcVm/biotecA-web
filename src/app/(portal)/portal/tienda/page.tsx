import { getShopProducts } from "@/lib/actions/shop"
import { ShopContainer } from "@/components/portal/shop-container"

export default async function PortalTiendaPage() {
    const products = await getShopProducts()

    return (
        <div className="container mx-auto max-w-6xl py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tienda Online</h1>
                <p className="text-muted-foreground">Adquiera productos de cuidado y ortopédicos directamente.</p>
            </div>

            <ShopContainer products={products} />
        </div>
    )
}
