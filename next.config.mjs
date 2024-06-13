/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:["openweathermap.org","lh3.googleusercontent.com","avatars.githubusercontent.com","bankerjobs.asia","ostospos.s3.ap-southeast-1.amazonaws.com","ostoss3.s3.ap-southeast-2.amazonaws.com"]
    },
    experimental:{
        serverActions:true
    }
};

export default nextConfig;
