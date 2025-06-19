"use client";

import React, { useState, useEffect } from "react";
import {
  AppShell,
  Container,
  Paper,
  Title,
  Text,
  Avatar,
  Group,
  Stack,
  Progress,
  Badge,
} from "@mantine/core";
import { motion } from "framer-motion";
import { MapPin, Trophy, Target, Route } from "lucide-react";
import Header from "@/components/Header";
import { Storage } from "appwrite";
import AppClient from "@/components/Apwr";
import { Router, useRouter } from "next/router";

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

function transformToValidString(input: string) {
  // Remove invalid characters
  let transformed = input.replace(/[^a-zA-Z0-9._-]/g, "");

  // Trim to max 36 characters
  transformed = transformed.slice(0, 36);

  // Ensure it doesn't start with a special character
  if (/^[._-]/.test(transformed)) {
    transformed = transformed.replace(/^[._-]+/, "");
  }

  // If empty after cleaning, default to 'default_name'
  if (transformed.length === 0) {
    transformed = "default_name";
  }

  return transformed;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      let userName = "";
      try {
        const userString = sessionStorage.getItem("user");

        if (userString) {
          // Parse the JSON string to an object
          const user = JSON.parse(userString);
          userName = user.name;
        } else {
          const router = useRouter();
          router.push("/login");
        }
        // Initialize Appwrite storage with your AppClient instance
        const storage = new Storage(AppClient);

        // Replace these placeholders with your actual bucket ID and file ID
        const bucketId = "67b227840031b7167827";
        const fileId = transformToValidString(userName);

        // Retrieve the download URL for the JSON file
        const fileUrl = storage.getFileDownload(bucketId, fileId);

        console.log("Fetching user profile from:", fileUrl);

        // Fetch the JSON file from Appwrite storage
        const response = await fetch(fileUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file: ${response.status} ${response.statusText}`,
          );
        }

        // Parse the JSON data
        const data: UserJSON = await response.json();
        setUserProfile(data);
        console.log("User profile data:", data);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <AppShell.Main className="bg-blue-50">
          <Container size="xl" py="xl">
            <Text>Loading user profile...</Text>
          </Container>
        </AppShell.Main>
      </>
    );
  }

  if (error || !userProfile) {
    return (
      <>
        <Header />
        <AppShell.Main className="bg-blue-50">
          <Container size="xl" py="xl">
            <Text color="red">Error: {error || "User profile not found"}</Text>
          </Container>
        </AppShell.Main>
      </>
    );
  }

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
                    <Text size="sm" c="dimmed">
                      Location Unknown
                    </Text>
                  </Group>
                  <Badge
                    size="lg"
                    radius="md"
                    className="mt-4 bg-blue-100 text-blue-600"
                  >
                    {userProfile.rank}
                  </Badge>

                  <div className="mt-6 space-y-4">
                    <div>
                      <Text size="sm" c="dimmed" mb={2}>
                        Total Points
                      </Text>
                      <Title order={3} className="text-blue-600">
                        {userProfile.totalPoints}
                      </Title>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed" mb={2}>
                        Completed Challenges
                      </Text>
                      <Title order={3} className="text-blue-600">
                        {userProfile.completedChallenges}
                      </Title>
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
                          <Text size="sm" fw={500}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {value}%
                          </Text>
                        </Group>
                        <Progress
                          value={value}
                          color="blue"
                          size="md"
                          radius="xl"
                        />
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
                    {userProfile.RecentEvents.map(
                      ({ id, name, description, date }) => (
                        <Paper
                          key={id}
                          p="md"
                          radius="md"
                          className="border border-gray-100"
                        >
                          <Group position="apart">
                            <div>
                              <Text fw={500} mb={1}>
                                {name}
                              </Text>
                              <Text size="sm" c="dimmed">
                                {description}
                              </Text>
                            </div>
                            <Text size="sm" c="dimmed">
                              {date}
                            </Text>
                          </Group>
                        </Paper>
                      ),
                    )}
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
