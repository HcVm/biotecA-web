import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // PROTECTED ROUTES LOGIC
    if (user) {
        // 1. Get user role from Metadata (faster) or DB
        // We put role in metadata on creation/update, but fallback to DB query if needed.
        // For robustness, let's query DB quickly or rely on metadata if you sync it. 
        // Let's assume we query DB for security source of truth.

        // Note: Middleware DB queries can be tricky with edge functions, but basic select is fine.
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role || 'patient'
        const path = request.nextUrl.pathname

        // 2. Redirect Rules

        // If Patient tries to go to Dashboard (Admin area)
        if (role === 'patient' && path.startsWith('/dashboard')) {
            const url = request.nextUrl.clone()
            url.pathname = '/portal'
            return NextResponse.redirect(url)
        }

        // If Admin/Doctor tries to go to Portal (Patient area) -> Optional restriction
        // Maybe doctors want to see portal features? Let's restrict for clarity.
        if (role !== 'patient' && path.startsWith('/portal')) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // 3. Login Redirect (Only for /login page, leave / open for Landing Page)
        if (path === '/login') {
            const url = request.nextUrl.clone()
            url.pathname = role === 'patient' ? '/portal' : '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    // ALLOW PUBLIC ACCESS TO ROOT
    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/register') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        request.nextUrl.pathname !== '/' // Allow Landing Page
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
