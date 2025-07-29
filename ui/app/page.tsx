'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Group, Title, Button, Container, Box, Stack } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { MapIcon, Trophy, Layout, ChevronRight, Menu } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const cities = [
  {
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&w=1920&q=80',
    landmark: 'Tokyo Tower'
  },
  {
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&w=1920&q=80',
    landmark: 'Times Square'
  },
  {
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&w=1920&q=80',
    landmark: 'Burj Khalifa'
  },
  {
    name: 'Rome',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&w=1920&q=80',
    landmark: 'Colosseum'
  },
  {
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&w=1920&q=80',
    landmark: 'Opera House'
  },
  {
    name: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&w=1920&q=80',
    landmark: 'Sagrada Familia'
  },
  {
    name: 'Singapore',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&w=1920&q=80',
    landmark: 'Marina Bay Sands'
  }
];


export default function Home() {
  const router = useRouter();
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const preloadNextImage = useCallback((nextIndex: number) => {
    const img = new Image();
    img.src = cities[nextIndex].image;
  }, []);

  const updateCityIndex = useCallback(() => {
    const nextIndex = (currentCityIndex + 1) % cities.length;
    setCurrentCityIndex(nextIndex);

    // Preload the next image in sequence
    const futureIndex = (nextIndex + 1) % cities.length;
    preloadNextImage(futureIndex);
  }, [currentCityIndex, preloadNextImage]);

  useEffect(() => {
    const interval = setInterval(updateCityIndex, 3000);
    return () => clearInterval(interval);
  }, [updateCityIndex]);

  const currentCity = cities[currentCityIndex];

  const CityImage = (
    <img
      src={currentCity.image}
      alt={`${currentCity.name} - ${currentCity.landmark}`}
      className="object-cover w-full h-full"
      style={{
        width: '100%',
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );

  return (
    <Box className="min-h-screen hero-background">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <Container size="xl">
          <Group h={100} px="md" justify="space-between" className="nav-container">
            <Group>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="bg-blue-50 p-2 rounded-lg"
              >
                <MapIcon className="text-blue-600" size={40} />
              </motion.div>
              <Title order={1} size={42} className="text-blue-600 hidden sm:block">
                JetQuest
              </Title>
            </Group>
            
            {/* Desktop Navigation */}
            <Group gap="xs" className="hidden md:flex">
              <Button
                variant="subtle"
                leftSection={<Trophy size={18} />}
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-blue-200"
                size="lg"
              >
                Leaderboard
              </Button>
              <Button
                variant="subtle"
                leftSection={<Layout size={18} />}
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-blue-200"
                size="lg"
              >
                Dashboard
              </Button>
              <Button
                variant="filled"
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                size="lg"
              >
                Sign In
              </Button>
            </Group>

            {/* Mobile Navigation */}
            <Group className="md:hidden">
              <Button
                variant="filled"
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                size="md"
              >
                Sign In
              </Button>
              <Button
                variant="subtle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-blue-200 p-2"
                size="md"
              >
                <Menu size={20} />
              </Button>
            </Group>
          </Group>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4 px-md"
            >
              <Stack gap="xs">
                <Button
                  variant="subtle"
                  leftSection={<Trophy size={18} />}
                  onClick={() => {
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-blue-200 justify-start"
                  size="md"
                  fullWidth
                >
                  Leaderboard
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<Layout size={18} />}
                  onClick={() => {
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-blue-200 justify-start"
                  size="md"
                  fullWidth
                >
                  Dashboard
                </Button>
              </Stack>
            </motion.div>
          )}
        </Container>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-100px)] w-full px-4">
        <Container size="xl">
          <Stack align="center" gap={32}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10 mt-8"
            >
              <Title className="text-6xl sm:text-8xl lg:text-[12rem] font-bold text-white leading-tight mb-8 sm:mb-16 discover-text">
                Discover
              </Title>

              <div className="h-24 sm:h-32 lg:h-48 relative mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCity.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl sm:text-8xl lg:text-[10rem] city-gradient font-bold"
                  >
                    {currentCity.name}
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mb-4"
              >
                <Button
                  size="xl"
                  rightSection={<ChevronRight size={24} className="text-white" />}
                  onClick={() => router.push('/login')}
                  className="explore-button text-white"
                >
                  <span className="text-lg sm:text-2xl font-semibold">Explore Now</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-[60vw] max-w-5xl aspect-[16/9] relative rounded-2xl overflow-hidden shadow-2xl mb-8 h-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCity.image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >

                  {CityImage}

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl sm:text-3xl font-bold mb-2"
                    >
                      {currentCity.landmark}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm sm:text-lg text-white/90"
                    >
                      Explore the wonders of {currentCity.name}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
            </motion.div>
          </Stack>
        </Container>
      </main>
    </Box>
  );
}