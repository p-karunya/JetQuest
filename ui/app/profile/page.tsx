'use client';

import { useState } from 'react';
import { AppShell, Container, Paper, Title, Text, Avatar, Group, Stack, Progress, Badge } from '@mantine/core';
import { motion } from 'framer-motion';
import { MapPin, Trophy, Target, Calendar } from 'lucide-react';
import Header from '@/components/Header';

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

const userProfile: UserJSON = {
  name: 'Sarah Johnson',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  totalPoints: 2500,
  rank: 'Explorer',
  completedChallenges: 15,
  stats: {
    adventure: 30,
    cultural: 25,
    food: 35,
    nature: 10,
  },
  RecentEvents: [
    { id: 1, name: 'First Challenge', description: 'Complete your first challenge', date: '2024-01-15' },
    { id: 2, name: 'Cultural Explorer', description: 'Complete 5 cultural challenges', date: '2024-01-20' },
    { id: 3, name: 'Foodie', description: 'Complete 10 food challenges', date: '2024-02-01' },
  ],
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <AppShell.Main className="bg-blue-50">
        <Container size="xl" py="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <Paper p="xl" radius="lg" className="md:col-span-1 bg-white">
                <div className="text-center">
                  <Avatar
                    src={userProfile.avatar}
                    size={120}
                    radius={120}
                    mx="auto"
                    className="border-4 border-blue-100"
                  />
                  <Title order={2} className="mt-4 mb-1">
                    {userProfile.name}
                  </Title>
                  <Group justify="center" gap={8}>
                    <MapPin size={16} className="text-blue-600" />
                    <Text size="sm" c="dimmed">Location Unknown</Text>
                  </Group>
                  <Badge size="lg" radius="md" className="mt-4 bg-blue-100 text-blue-600">
                    {userProfile.rank}
                  </Badge>

                  <div className="mt-6 space-y-4">
                    <div>
                      <Text size="sm" c="dimmed" mb={2}>Total Points</Text>
                      <Title order={3} className="text-blue-600">{userProfile.totalPoints}</Title>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed" mb={2}>Completed Challenges</Text>
                      <Title order={3} className="text-blue-600">{userProfile.completedChallenges}</Title>
                    </div>
                  </div>
                </div>
              </Paper>

              {/* Progress and Achievements */}
              <div className="md:col-span-2 space-y-6">
                <Paper p="xl" radius="lg" className="bg-white">
                  <Title order={3} mb="lg" className="flex items-center gap-2">
                    <Target size={24} className="text-blue-600" />
                    Progress
                  </Title>

                  <Stack spacing="lg">
                    {Object.entries(userProfile.stats).map(([key, value]) => (
                      <div key={key}>
                        <Group justify="space-between" mb={4}>
                          <Text size="sm" fw={500}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                          <Text size="sm" c="dimmed">{value}%</Text>
                        </Group>
                        <Progress value={value} color="blue" size="md" radius="xl" />
                      </div>
                    ))}
                  </Stack>
                </Paper>

                {/* Recent Challenges */}
                <Paper p="xl" radius="lg" className="bg-white">
                  <Title order={3} mb="lg" className="flex items-center gap-2">
                    <Trophy size={24} className="text-blue-600" />
                    Recent Challenges
                  </Title>

                  <Stack spacing="md">
                    {userProfile.RecentEvents.map(({ id, name, description, date }) => (
                      <Paper key={id} p="md" radius="md" className="border border-gray-100">
                        <Group position="apart">
                          <div>
                            <Text fw={500} mb={1}>{name}</Text>
                            <Text size="sm" c="dimmed">{description}</Text>
                          </div>
                          <Text size="sm" c="dimmed">{date}</Text>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </div>
            </div>
          </motion.div>
        </Container>
      </AppShell.Main>
    </>
  );
}
