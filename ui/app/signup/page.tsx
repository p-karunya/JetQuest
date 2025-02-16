'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Box, em } from '@mantine/core';
import { motion } from 'framer-motion';
import { MapIcon, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Account, ID } from 'appwrite';
import AppClient from '@/components/Apwr';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
    const account = new Account(AppClient);

    const user = await account.create(
      ID.unique(), 
      email, 
      password,
    );

    try{
      account.deleteSession('current')
    } catch {
    
    }

    try {
      const account = new Account(AppClient);
      const session = await account.createEmailPasswordSession(
      email, 
      password
      );
      sessionStorage.setItem('session', JSON.stringify(session));
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to login:', error);
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
          <Paper radius="lg" p="xl" withBorder className="bg-white/95 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 p-4 rounded-full mb-4"
              >
                <MapIcon size={48} className="text-blue-600" />
              </motion.div>
              <Title order={1} className="text-2xl font-bold text-center mb-2 text-gray-800">
                Create Your Account
              </Title>
              <Text c="dimmed" size="sm">
                Start your adventure today
              </Text>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftSection={<User size={16} className="text-blue-600" />}
                classNames={{
                  input: "focus:border-blue-600",
                  label: "text-gray-700"
                }}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftSection={<Mail size={16} className="text-blue-600" />}
                classNames={{
                  input: "focus:border-blue-600",
                  label: "text-gray-700"
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftSection={<Lock size={16} className="text-blue-600" />}
                classNames={{
                  input: "focus:border-blue-600",
                  label: "text-gray-700"
                }}
              />

              <Button
                type="submit"
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 transition-colors mt-4"
              >
                Create Account
              </Button>

              <Text align="center" size="sm" className="mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </Text>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}