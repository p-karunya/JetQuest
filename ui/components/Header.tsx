'use client';

import { AppShell, Group, Title, Button, Container } from '@mantine/core';
import { motion } from 'framer-motion';
import { MapIcon, Trophy, User, Home, Building2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <AppShell.Header className="border-b border-blue-100 bg-white">
      <Container size="xl">
        <Group h={60} px="md" justify="space-between">
          <Group>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push('/dashboard')}
              className="cursor-pointer"
            >
              <MapIcon size={48} className="text-blue-600" />
            </motion.div>
          </Group>
          <Group>
            <Button
              variant={isActive('/dashboard') ? 'filled' : 'subtle'}
              onClick={() => router.push('/dashboard')}
              leftSection={<Home size={16} />}
              className={isActive('/dashboard') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-50'}
            >
              Home
            </Button>
            <Button
              variant={isActive('/leaderboard') ? 'filled' : 'subtle'}
              onClick={() => router.push('/leaderboard')}
              leftSection={<Trophy size={16} />}
              className={isActive('/leaderboard') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-50'}
            >
              Leaderboard
            </Button>
            <Button
              variant={isActive('/profile') ? 'filled' : 'subtle'}
              onClick={() => router.push('/profile')}
              leftSection={<User size={16} />}
              className={isActive('/profile') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-50'}
            >
              Profile
            </Button>
            <Button
              variant={isActive('/business') ? 'filled' : 'subtle'}
              onClick={() => router.push('/business')}
              leftSection={<Building2 size={16} />}
              className={isActive('/business') ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-50'}
            >
              Business Owner?
            </Button>
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}