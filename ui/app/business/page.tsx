"use client";

import { useState, useCallback } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Box,
  NumberInput,
  Select,
  Stack,
  Notification,
  Group,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Trophy,
  Clock,
  Target,
  Check,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function BusinessPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/submit-business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          estimatedTime: Number(data.estimatedTime),
          points: Number(data.points),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit challenge");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the challenge",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setError(null);
    setLoading(false);
  }, []);

  if (submitted) {
    return (
      <>
        <Header />
        <Box className="min-h-screen bg-blue-50">
          <Container size="md" py="xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <Paper p="xl" radius="lg" className="bg-white text-center">
                <Check size={48} className="text-green-600 mx-auto mb-4" />
                <Title order={2} className="mb-4">
                  Thank You for Your Submission!
                </Title>
                <Text c="dimmed" mb="lg">
                  We'll review your challenge proposal and get back to you soon.
                </Text>
                <Group justify="center">
                  <Button
                    onClick={handleReset}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Another Challenge
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => router.push("/dashboard")}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Return to Dashboard
                  </Button>
                </Group>
              </Paper>
            </motion.div>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box className="min-h-screen bg-blue-50">
        <Container size="md" py="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            {error && (
              <Notification
                icon={<X size={18} />}
                color="red"
                title="Error"
                onClose={() => setError(null)}
                mb="md"
              >
                {error}
              </Notification>
            )}

            <Paper p="xl" radius="lg" className="bg-white">
              <div className="text-center mb-6">
                <Building2 size={48} className="text-blue-600 mx-auto mb-4" />
                <Title order={2} className="mb-2">
                  Add Your Business Challenge
                </Title>
                <Text c="dimmed">
                  Partner with us to create exciting challenges for our users at
                  your location
                </Text>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Stack spacing="md">
                  <Title order={4} className="flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Business Information
                  </Title>

                  <TextInput
                    name="businessName"
                    label="Business Name"
                    placeholder="Your business name"
                    required
                  />

                  <TextInput
                    name="contactName"
                    label="Contact Name"
                    placeholder="Your full name"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="your@email.com"
                      required
                    />

                    <TextInput
                      name="phone"
                      label="Phone Number"
                      placeholder="(555) 555-5555"
                      required
                    />
                  </div>

                  <TextInput
                    name="address"
                    label="Business Address"
                    placeholder="Full address"
                    required
                    leftSection={<MapPin size={16} />}
                  />

                  <Title order={4} className="flex items-center gap-2 mt-6">
                    <Trophy size={20} className="text-blue-600" />
                    Challenge Details
                  </Title>

                  <TextInput
                    name="challengeTitle"
                    label="Challenge Title"
                    placeholder="Give your challenge a catchy name"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      name="category"
                      label="Category"
                      required
                      data={[
                        { value: "adventure", label: "Adventure" },
                        { value: "cultural", label: "Cultural" },
                        { value: "food", label: "Food & Drink" },
                        { value: "nature", label: "Nature" },
                      ]}
                    />

                    <Select
                      name="difficulty"
                      label="Difficulty Level"
                      required
                      data={[
                        { value: "Easy", label: "Easy (100 points)" },
                        { value: "Medium", label: "Medium (200 points)" },
                        { value: "Hard", label: "Hard (300 points)" },
                        { value: "Expert", label: "Expert (400 points)" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NumberInput
                      name="estimatedTime"
                      label="Estimated Time (minutes)"
                      placeholder="60"
                      required
                      min={1}
                      leftSection={<Clock size={16} />}
                    />

                    <NumberInput
                      name="points"
                      label="Suggested Points"
                      placeholder="100"
                      required
                      min={100}
                      max={400}
                      step={50}
                      leftSection={<Target size={16} />}
                    />
                  </div>

                  <Textarea
                    name="description"
                    label="Challenge Description"
                    placeholder="Describe what users will do in this challenge"
                    required
                    minRows={3}
                  />

                  <Textarea
                    name="tasks"
                    label="Required Tasks"
                    placeholder="List the specific tasks users need to complete (one per line)"
                    description="Enter each task on a new line"
                    required
                    minRows={4}
                  />

                  <Textarea
                    name="notes"
                    label="Additional Notes"
                    placeholder="Any other information you'd like to share"
                    minRows={2}
                  />

                  <Group justify="flex-end">
                    <Button
                      variant="light"
                      onClick={() => router.push("/dashboard")}
                      size="lg"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      Submit Challenge
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
