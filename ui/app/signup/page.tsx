"use client";

import { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Box
} from "@mantine/core";
import { motion } from "framer-motion";
import { MapIcon, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "../actions/signup";
import { useActionState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [state, action, pending] = useActionState(signup, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);


  return (
    <Box className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-blue-800 fixed inset-0 flex items-center justify-center">
      <Container size="xs">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
                >
                  <MapIcon size={48} className="text-blue-600" />
                </motion.div>
              </div>
              <Title
                order={1}
                className="text-2xl font-bold text-center mb-2 text-gray-800"
              >
                Create Your Account
              </Title>
              <Text c="dimmed" size="sm">
                Start your adventure today
              </Text>
              <form action={action} className="space-y-4" method="post">
                <TextInput
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  leftSection={<User size={16} className="text-blue-600" />}
                  classNames={{
                    input: "focus:border-blue-600",
                    label: "text-gray-700",
                  }}
                  title="Name should have 8 characters and should only contain letters"
                  pattern="^(?=.*[a-zA-Z].*)[a-zA-Z ]{8,}$"
                />

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
                />

                <PasswordInput
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
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

                <Button
                  type="submit"
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700 transition-colors mt-4"
                >
                  Create Account
                </Button>

                <Text size="sm" className="mt-4">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </Link>
                </Text>
              </form>
            </Paper>
          </motion.div>
        </div>
      </Container>
    </Box>
  );
}