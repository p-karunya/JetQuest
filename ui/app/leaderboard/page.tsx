"use client";

import { useState } from "react";
import {
  AppShell,
  Container,
  Tabs,
  Paper,
  Avatar,
  Text,
  Group,
  Badge,
  Progress,
} from "@mantine/core";
import { motion } from "framer-motion";
import { Trophy, Clock, Calendar, Star } from "lucide-react";
import Header from "@/components/Header";

const leaderboardData = [
  {
    id: 1,
    name: "You",
    avatar:
      "data:image/jpeg;base64,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",
    points: 300,
    badges: ["Explorer"],
    activities: {
      adventure: 0,
      cultural: 100,
      food: 0,
      nature: 0,
    },
  },
  {
    id: 2,
    name: "Test User",
    avatar:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAACUCAMAAAAAoYNxAAAAA1BMVEUAAACnej3aAAAAMUlEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgywBnfAABIm7MIAAAAABJRU5ErkJggg==",
    points: 5,
    badges: ["Tester"],
    activities: {
      adventure: 0,
      cultural: 0,
      food: 0,
      nature: 100,
    },
  },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("daily");

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
              <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as string)}
              >
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
                            <Text
                              size="xl"
                              weight={700}
                              className="w-8 text-blue-600"
                            >
                              #{index + 1}
                            </Text>
                            <Avatar src={user.avatar} size="md" radius="xl" />
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
                          <Text
                            size="xl"
                            weight={700}
                            className="text-blue-600"
                          >
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
