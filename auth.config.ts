import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./fetch/user"
import github from "next-auth/providers/github"
import google from "next-auth/providers/google"

export default{
    providers:[
        google({
            clientId:process.env.GOOGLE_ID,
            clientSecret:process.env.GOOGLE_SECRET
        }),
        github({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            credentials: {
                name:{
                    label:"Name",
                    type:'text',
                    placeholder:'Name'
                },
                phoneNumber:{
                    label:"Phone Number",
                    type:"text",
                    placeholder:":Phone Number"
                },
                email: { 
                    label: 'Email', 
                    type: 'email', 
                    placeholder: 'Email' 
                },
                password: {
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Password',
                },
              },
            async authorize(credentials){
                const {phoneNumber , name, email, password } = credentials;
                let userIdentifier: string | undefined;

                // Determine the user identifier based on provided credentials
                if (typeof phoneNumber === 'string') {
                    userIdentifier = phoneNumber;
                } else if (typeof email === 'string') {
                    userIdentifier = email;
                } else if (typeof name === 'string') {
                    userIdentifier = name;
                }

                // If no valid user identifier is provided, return null
                if (userIdentifier === undefined) {
                    return null;
                }

                // Fetch user data based on the user identifier
                const user = await getUserByEmail(userIdentifier);

                console.log(user , userIdentifier)
                // If user is not found or required fields are missing, return null
                if (!user) { /////|| !user.email || !user.phoneNumber || !user.name
                    console.log('error email name and phone')
                    return null;
                }

                // Check if the provided password matches the user's password
                if (password === user.password) {
                    return user;
                }

                // If password doesn't match, return null
                return null;
                                
                /////////////////////////////////const {name, email , password} = credentials
                 /////////////////////////////////if(name && password || email && password){
                /////////////////////////////////    console.log(name , email , password)
               ///////////////////////////////// } 
                /////////////////////////////////return null
                /////////////////////////////////
                ///////////////////////////////
                /////////////////////////////
                //////////////////////////////
            }
        })
    ]
}satisfies NextAuthConfig