import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = async (email:string, token:string) =>{
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"2FA Code",
        html:`<p>Your 2FA code: ${token}</p>`
    })
}

export const sendVerificationEmail = async (
    email:string,
    token:string
) =>{
    const confirmLink = `/auth/new-verification?token=${token}`
    await resend.emails.send({
        from:"info755755@gmail.com",
        to:email,
        subject:"Confirm you email",
        html:`<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    })
}

export const sendPasswordResetEmail = async (
    email:string,
    token:string
) =>{
    const resetLink = `/auth/new-password?token=${token}`
    await resend.emails.send({
        from:"info755755@gmail.com",
        to:email,
        subject:"Reset your password",
        html:`<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    })
}