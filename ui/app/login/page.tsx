"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Box,
} from "@mantine/core";
import { motion } from "framer-motion";
import { MapIcon, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppClient from "@/components/Apwr";
import { Account } from "appwrite";

// Separate function to check sessionStorage safely
function checkUserSession() {
  if (typeof window !== "undefined") {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Check user session on component mount
  useEffect(() => {
    const user = checkUserSession();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const account = new Account(AppClient);
      // Authenticate user
      await account.createEmailPasswordSession(email, password);
      // Get the authenticated user's object
      const user = await account.get();
      // Store the user object in sessionStorage (client-side only)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      console.log("User object saved:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create session or get user:", error);
    }
  };

  return (
    <Box className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-blue-800 fixed inset-0 flex items-center justify-center">
      <Container size="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Paper
            radius="lg"
            p="xl"
            withBorder
            className="bg-white/95 backdrop-blur-sm shadow-xl"
          >
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 p-4 rounded-full mb-4"
              >
                <MapIcon size={48} className="text-blue-600" />
              </motion.div>
              <Title
                order={1}
                className="text-2xl font-bold text-center mb-2 text-gray-800"
              >
                Welcome Back
              </Title>
              <Text c="dimmed" size="sm">
                Sign in to continue your journey
              </Text>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <TextInput
                type="email"
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftSection={<Mail size={16} className="text-blue-600" />}
                classNames={{
                  input: "focus:border-blue-600",
                  label: "text-gray-700",
                }}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              />

              <PasswordInput
                type="password"
                label="Password"
                title="Minimum of 8 characters"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftSection={<Lock size={16} className="text-blue-600" />}
                classNames={{
                  input: "focus:border-blue-600",
                  label: "text-gray-700",
                }}
                pattern="^.{8,}$"
              />

              <div className="flex items-center justify-between mt-2">
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.currentTarget.checked)}
                  classNames={{
                    input: "checked:bg-blue-600 checked:border-blue-600",
                  }}
                />
                <Button
                  variant="subtle"
                  size="sm"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sign in
              </Button>

              <Text align="center" size="sm" className="mt-4">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create one
                </Link>
              </Text>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
