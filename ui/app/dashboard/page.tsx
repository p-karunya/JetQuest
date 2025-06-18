'use client';

import { useState } from 'react';
import { AppShell, Group, Stack, Text, Container, Grid, Paper, Title } from '@mantine/core';
import { motion } from 'framer-motion';
import { Compass, Book, Coffee, Mountain } from 'lucide-react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });

const categories = [
  {
    id: 1,
    name: 'Adventure',
    icon: Compass,
    description: 'Explore thrilling outdoor activities',
    points: 500,
    color: '#DC2626' // Red for adventure
  },
  {
    id: 2,
    name: 'Cultural',
    icon: Book,
    description: 'Discover local art and history',
    points: 400,
    color: '#7C3AED' // Purple for cultural
  },
  {
    id: 3,
    name: 'Food & Drink',
    icon: Coffee,
    description: 'Taste Seattle\'s finest cuisine',
    points: 300,
    color: '#059669' // Green for food
  },
  {
    id: 4,
    name: 'Nature',
    icon: Mountain,
    description: 'Connect with the outdoors',
    points: 450,
    color: '#2563EB' // Blue for nature
  }
];

export default function Dashboard() {
  return (
    <>
      <Header />
      <AppShell.Main className="bg-blue-50">
        <Container size="xl" py="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mt-16 mb-16">
              <Grid gutter="lg">
                {categories.map((category, index) => (
                  <Grid.Col key={category.id} span={{ base: 12, sm: 6, md: 3 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Paper
                        p="xl"
                        radius="lg"
                        className="hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${category.color}15` }}>
                          <category.icon size={24} style={{ color: category.color }} />
                        </div>
                        <Title order={3} className="text-xl mb-2">{category.name}</Title>
                        <Text size="sm" c="dimmed" mb="md">{category.description}</Text>
                        <Text size="sm" className="font-semibold" style={{ color: category.color }}>
                          Up to {category.points} points
                        </Text>
                      </Paper>
                    </motion.div>
                  </Grid.Col>
                ))}
              </Grid>
            </div>

            <Paper shadow="sm" p="md" radius="lg" className="bg-white">
              <Map onChallengeClick={() => {}} />
            </Paper>
          </motion.div>
        </Container>
      </AppShell.Main>
    </>
  );
}