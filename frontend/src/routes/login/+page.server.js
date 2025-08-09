import { redirect } from '@sveltejs/kit'

export async function load({ cookies }) {
    const token = cookies.get("tokenX")
    console.log("load login ---< ")
    console.log("token on load 'login' -> ", token);
    
    // if (token) {
    //     throw redirect("302", "/")
    // }
}

export const actions = {
    login: async ({ cookies, request, event }) => {
        console.log("login action ---< ")
        const data = await request.formData()
        const username = data.get('username')
        // console.log(data.get('username'), data.get('password'))
        const response = await fetch("http://api:4000/api/login", {
            method: "POST",
            body: data
        })
        const apiData = await response.json()
        if (!response.ok) {
            return {
                success: false,
                message: apiData.message,
                username
            }
        }
        let user = apiData.user
        let token = apiData.token
        console.log("user from login", user)
        cookies.set("tokenX", token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
            maxAge: 60 * 60
        })
        return {
            success: true,
            message: "Login successful",
            user
        }
    }
}