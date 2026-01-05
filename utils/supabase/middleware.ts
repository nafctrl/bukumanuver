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

    // Get current user session
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // Rule 1: If NOT logged in and trying to access protected route -> redirect to /login
    if (!user && pathname !== '/login') {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // Rule 2: If logged in and trying to access /login -> redirect to dashboard
    if (user && pathname === '/login') {
        const dashboardUrl = new URL('/', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return supabaseResponse
}
