'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Box, em } from '@mantine/core';
import { motion } from 'framer-motion';
import { MapIcon, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Account, ID, Storage } from 'appwrite';
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
      name
    );

    const storage = new Storage(AppClient);

    function transformToValidString(input: string) {
      // Remove invalid characters
      let transformed = input.replace(/[^a-zA-Z0-9._-]/g, '');
    
      // Trim to max 36 characters
      transformed = transformed.slice(0, 36);
    
      // Ensure it doesn't start with a special character
      if (/^[._-]/.test(transformed)) {
        transformed = transformed.replace(/^[._-]+/, '');
      }
    
      // If empty after cleaning, default to 'default_name'
      if (transformed.length === 0) {
        transformed = 'default_name';
      }
    
      return transformed;
    }
    interface UserJSON {
      name: string;
      avatar: string;
      totalPoints: number;
      rank: string;
      completedChallenges: number;
      stats: {
        adventure: number;
        cultural: number;
        food: number;
        nature: number;
      };
      RecentEvents: {
        id: number;
        name: string;
        description: string;
        date: string;
      }[];
    }

    const userData: UserJSON = {
      name: user.name,
      avatar: 'data:image/jpeg;base64,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',
      totalPoints: 0,
      rank: 'Explorer',
      completedChallenges: 0,
      stats: {
        adventure: 0,
        cultural: 0,
        food: 0,
        nature: 0
      },
      RecentEvents: []
    };

    // Convert userData to a Blob
    const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });

    // Create a File object from the Blob
    const userJSONFile = new File([userBlob], `${user.name}.json`, { type: 'application/json' });


    const userFile = await storage.createFile(
      '67b227840031b7167827', // bucketId
      transformToValidString(user.name), // fileId
      userJSONFile, // file
      ["read(\"any\")"] // permissions (optional)
    );

    try{
      account.deleteSession('current')
    } catch {}

    try {
      const session = await account.createEmailPasswordSession(
      email, 
      password
      );
      sessionStorage.setItem('user', JSON.stringify(user));
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