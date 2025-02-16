'use client';

import { useState } from 'react';
import { AppShell, Container, Tabs, Paper, Avatar, Text, Group, Badge, Progress } from '@mantine/core';
import { motion } from 'framer-motion';
import { Trophy, Clock, Calendar, Star } from 'lucide-react';
import Header from '@/components/Header';

const leaderboardData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    points: 2500,
    badges: ['Explorer', 'Food Critic'],
    activities: {
      adventure: 30,
      cultural: 25,
      food: 35,
      nature: 10
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    points: 2200,
    badges: ['Adventurer'],
    activities: {
      adventure: 40,
      cultural: 20,
      food: 25,
      nature: 15
    }
  }
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('daily');

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
            <Paper p="xl" radius="lg" className="bg-white">
              <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
                <Tabs.List grow mb="xl">
                  <Tabs.Tab 
                    value="daily" 
                    leftSection={<Clock size={16} />}
                    className="data-[active]:bg-blue-600 data-[active]:text-white"
                  >
                    Daily
                  </Tabs.Tab>
                  <Tabs.Tab 
                    value="weekly" 
                    leftSection={<Calendar size={16} />}
                    className="data-[active]:bg-blue-600 data-[active]:text-white"
                  >
                    Weekly
                  </Tabs.Tab>
                  <Tabs.Tab 
                    value="monthly" 
                    leftSection={<Star size={16} />}
                    className="data-[active]:bg-blue-600 data-[active]:text-white"
                  >
                    Monthly
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={activeTab}>
                  {leaderboardData.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper
                        p="md"
                        radius="md"
                        className="mb-4 hover:shadow-md transition-shadow"
                        withBorder
                      >
                        <Group position="apart">
                          <Group>
                            <Text size="xl" weight={700} className="w-8 text-blue-600">
                              #{index + 1}
                            </Text>
                            <Avatar
                              src={user.avatar}
                              size="md"
                              radius="xl"
                            />
                            <div>
                              <Text size="lg" weight={500}>
                                {user.name}
                              </Text>
                              <Group spacing={4}>
                                {user.badges.map((badge) => (
                                  <Badge
                                    key={badge}
                                    variant="light"
                                    className="bg-blue-100 text-blue-600"
                                  >
                                    {badge}
                                  </Badge>
                                ))}
                              </Group>
                            </div>
                          </Group>
                          <Text size="xl" weight={700} className="text-blue-600">
                            {user.points} pts
                          </Text>
                        </Group>

                        <div className="mt-4">
                          <Text size="sm" weight={500} mb={4}>
                            Activity Breakdown
                          </Text>
                          <Progress.Root size="sm">
                            <Progress.Section
                              value={user.activities.adventure}
                              color="#DC2626"
                            />
                            <Progress.Section
                              value={user.activities.cultural}
                              color="#7C3AED"
                            />
                            <Progress.Section
                              value={user.activities.food}
                              color="#059669"
                            />
                            <Progress.Section
                              value={user.activities.nature}
                              color="#2563EB"
                            />
                          </Progress.Root>
                        </div>
                      </Paper>
                    </motion.div>
                  ))}
                </Tabs.Panel>
              </Tabs>
            </Paper>
          </motion.div>
        </Container>
      </AppShell.Main>
    </>
  );
}