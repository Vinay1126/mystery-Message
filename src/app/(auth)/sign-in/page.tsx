'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const page = () => {

  const [isSubmitting, setIsSubmiting] = useState(false);
  const { toast } = useToast()
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver : zodResolver(signInSchema),
    defaultValues : {
        identifier : '',
        password : ''
    },
  })

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    setIsSubmiting(true);

    const result = await signIn('credentials', {
      redirect : false,
      identifier : data.identifier,
      password : data.password
    })

    if(result?.error){
      toast({
        title : "Login failed",
        description : "Incorrect username or password",
        variant : "destructive"
      })
    } 

    setIsSubmiting(false);

    if(result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join True Feedback
        </h1>
        <p className="mb-4">Sign in to start your anonymous adventure</p>
      </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 animate-spin" /> Please Wait
                  </>
                ) : ('Signin')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
