import { redirect } from '@sveltejs/kit'

export async function load({cookies}) {
    cookies.delete("user", { path: '/'})
    cookies.delete("tokenX", { path: '/'})
    redirect("303", "/")
}