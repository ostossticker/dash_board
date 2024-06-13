"use client"

import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const user = useCurrentUser()
  if(!user){
    router.push('/auth/login')
  }
  return (
    <div>
      Welcome :D!
    </div>
  );
}
