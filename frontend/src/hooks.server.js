export async function handle({ event, resolve }){
    // console.log('Origin:', event.url.origin);
    console.log("hooks.server.js ----< ");
    console.log(event.cookies.get("tokenX"));
    event.locals.user = { name: 'Adolphus' }
    // const token = event.cookies.get('tokenX')
    // if (token) {
    //     console.log(token)
    // } else {
    //     console.log("No token")
    // }
    return resolve(event)
}