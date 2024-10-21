"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginForm() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useState<{
        loading: boolean;
        error: string | null;
        message: string | null;
    }>({
        loading: false,
        error: null,
        message: null,
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({ loading: true, error: null, message: null });

        try {
            const response = await axios.post("/api/auth/login", {
                emailOrUsername,
                password,
            });

            if (response.data.success) {
                setState({ loading: false, error: null, message: "Logged in successfully" });
                router.push("/manager");
            } else {
                setState({ loading: false, error: response.data.error, message: null });
            }
        } catch (e) {
            console.error(e);
            setState({ loading: false, error: "An unknown error occurred", message: null });
        }
    };


    return (
        <div className="flex items-center justify-center w-96">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to login
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="emailOrUsername"
                                    type="text"
                                    placeholder="johndoe"
                                    required
                                    value={emailOrUsername}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={state.loading || !emailOrUsername || !password || state.message != null}>
                                {state.loading ? "Loading..." : "Login"}
                            </Button>
                            {state.error && (
                                <p className="text-red-500 text-sm">{state.error}</p>
                            )}
                            {state.message && (
                                <p className="text-green-500 text-sm">{state.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}