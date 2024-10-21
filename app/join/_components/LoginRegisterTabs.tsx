"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

export const LoginRegisterTabs = () => {
    return (
        <div className="flex h-screen">
            {/* Left side - Background Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="/registerbanner.png"
                    alt="Background"
                    className="h-full w-full object-cover"
                    layout="fill"
                />
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <Tabs defaultValue="loginForm">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="loginForm">Login</TabsTrigger>
                        <TabsTrigger value="registerForm">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="loginForm">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="registerForm">
                        <RegisterForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>

    )
}

