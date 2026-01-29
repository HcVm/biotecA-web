"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function SearchInput({ placeholder, className }: { placeholder: string, className?: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1') // Reset page on new search
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className={`relative flex flex-1 flex-shrink-0 ${className || ''}`}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                className="pl-8 w-full"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    )
}
