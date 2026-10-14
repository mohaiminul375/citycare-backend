import config from "../config"

export const getBkashIdToken = async () => {
    const res = await fetch(`${config.bkash_base_url}/tokenized-checkout/auth/grant-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config.bkash_username,
            password: config.bkash_password
        },
        body: JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secret
        })
    })

    const result = res.json()
    return result
}