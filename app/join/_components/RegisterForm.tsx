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

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
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

        if (password !== confirmPassword) {
            setState({ loading: false, error: "Passwords do not match", message: null });
            return;
        }

        try {
            const response = await axios.post("/api/auth/register", {
                name,
                lastName,
                email,
                username,
                password,
                confirmPassword,
            });

            if (response.data.success) {
                setState({ loading: false, error: null, message: "Account created successfully" });
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
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="flex gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={state.loading}>
                                {state.loading ? "Loading..." : "Register"}
                            </Button>
                            {state.error && (
                                <p className="text-red-500 text-sm">{state.error}</p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}