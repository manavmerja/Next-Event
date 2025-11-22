"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { toast } = useToast()
  // Use a ref to prevent double-firing in React Strict Mode
  const processedRef = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")
    
    if (!code) {
      router.push("/auth/login")
      return
    }

    if (processedRef.current) return
    processedRef.current = true

    const handleGitHubLogin = async () => {
      try {
        const response = await authAPI.loginWithGitHub(code)
        login(response.user)
        
        toast({
          title: "Success!",
          description: "Logged in with GitHub successfully.",
        })

        if (response.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      } catch (error: any) {
        console.error("GitHub Login Error:", error)
        toast({
          title: "Login Failed",
          description: error.message || "Could not login with GitHub",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
    }

    handleGitHubLogin()
  }, [searchParams, router, login, toast])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-10 w-10 text-[#00F0FF] animate-spin mb-4" />
      <p className="text-gray-400">Authenticating with GitHub...</p>
    </div>
  )
}