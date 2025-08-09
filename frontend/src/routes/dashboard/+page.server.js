import { redirect } from '@sveltejs/kit'

export async function load({ cookies, event }) {
    const tokenX = cookies.get("tokenX")
    // console.log("tokenX from dashboard load -> ", tokenX);
    const respone = await fetch("http://api:4000/api/auth", {
        headers: {
            Authorization: `Bearer ${tokenX}`
        }
    })
    console.log("respone -> ", respone.status);
    const apiData = await respone.json()
    console.log("error: ", apiData.error)
    if (!respone.ok) {
        if ( respone.status == "401" || respone.status == "403" ) {
            cookies.delete("tokenX", { path: '/'})
            redirect(303, "/login")
        }
        return
    }
    const user = apiData.user
    console.log("user from load server dashboard: ---> ", user)
    return { user, tokenX }
}