'use client';

import { useRouter } from 'next/navigation';
import { Group, Title, Button, Container, Box, Stack } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { MapIcon, Trophy, Layout, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback, useLayoutEffect } from 'react';

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
  let CityImage;
  const router = useRouter();
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);

  const preloadNextImage = useCallback((nextIndex: number) => {
    const img = new Image();
    img.src = cities[nextIndex].image;
    setPreloadedImages(prev => [...prev, img.src]);
  }, []);

  const updateCityIndex = useCallback(() => {
    const nextIndex = (currentCityIndex + 1) % cities.length;
    setCurrentCityIndex(nextIndex);
    setIsImageLoading(true);

    // Preload the next image in sequence
    const futureIndex = (nextIndex + 1) % cities.length;
    preloadNextImage(futureIndex);
  }, [currentCityIndex, preloadNextImage]);


  useEffect(() => {
    const interval = setInterval(updateCityIndex, 3000);
    return () => clearInterval(interval);
  }, [updateCityIndex]);

  const currentCity = cities[currentCityIndex];

  CityImage = (
    <img
      src={currentCity.image}
      alt={`${currentCity.name} - ${currentCity.landmark}`}
      className="object-cover w-full h-full"
      onLoad={() => setIsImageLoading(false)}
      style={{
        width: '100%',
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );

  return (
    <Box className="min-h-screen hero-background">
      <header className="bg-white border-b border-gray-200 shadow-sm">
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
              <Title order={1} size={42} className="text-blue-600">
                JetQuest
              </Title>
            </Group>
            <Group>
              <Button
                variant="subtle"
                leftSection={<Trophy size={18} />}
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:bg-blue-50"
                size="lg"
              >
                Leaderboard
              </Button>
              <Button
                variant="subtle"
                leftSection={<Layout size={18} />}
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:bg-blue-50"
                size="lg"
              >
                Dashboard
              </Button>
              <Button
                variant="filled"
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Sign In
              </Button>
            </Group>
          </Group>
        </Container>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-100px)] w-100wh">
        <Container size="xl">
          <Stack align="center" gap={32}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10 mt-8"
            >
              <Title className="text-8xl sm:text-[12rem] font-bold text-white leading-tight mb-16 discover-text">
                Discover
              </Title>

              <div className="h-32 sm:h-48 relative mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCity.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-8xl sm:text-[10rem] city-gradient font-bold"
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
              className="w-[60vw] max-w-5xl aspect-[16/9] relative rounded-2xl overflow-hidden shadow-2xl mb-8 h-full"
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
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      {currentCity.landmark}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-white/90"
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