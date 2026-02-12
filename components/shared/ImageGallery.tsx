'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getLocalizedContent } from '@/utils/data'
import type { LocalizedContent } from '@/types'

interface GalleryImage {
    url: string
    alt: LocalizedContent<string>
}

interface ImageGalleryData {
    type: 'imageGallery'
    columns?: number
    images: GalleryImage[]
}

interface ImageGalleryProps {
    data: ImageGalleryData
    locale: string
}

// Bento grid pattern - defines which cells span multiple columns/rows
const getBentoPattern = (index: number, total: number): string => {
    // Pattern optimized for 15 images in a 4-column grid with dense packing
    const patterns = [
        'col-span-2 row-span-2', // 0: Large featured
        'col-span-1 row-span-1', // 1: Small
        'col-span-1 row-span-1', // 2: Small
        'col-span-1 row-span-1', // 3: Small
        'col-span-1 row-span-1', // 4: Small
        'col-span-2 row-span-1', // 5: Wide
        'col-span-1 row-span-1', // 6: Small
        'col-span-1 row-span-1', // 7: Small
        'col-span-2 row-span-2', // 8: Large featured
        'col-span-1 row-span-1', // 9: Small
        'col-span-1 row-span-1', // 10: Small
        'col-span-1 row-span-1', // 11: Small
        'col-span-1 row-span-1', // 12: Small
        'col-span-2 row-span-1', // 13: Wide
        'col-span-2 row-span-1', // 14: Wide
    ]
    return patterns[index % patterns.length]
}

// Individual gallery card with parallax effect
function GalleryCard({
    image,
    index,
    locale,
    onClick,
    pattern,
}: {
    image: GalleryImage
    index: number
    locale: string
    onClick: () => void
    pattern: string
}) {
    const cardRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring animation for parallax
    const springConfig = { damping: 25, stiffness: 150 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig)
    const scale = useSpring(1, springConfig)

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!cardRef.current) return
            const rect = cardRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5
            mouseX.set(x)
            mouseY.set(y)
        },
        [mouseX, mouseY]
    )

    const handleMouseEnter = useCallback(() => {
        scale.set(1.02)
    }, [scale])

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0)
        mouseY.set(0)
        scale.set(1)
    }, [mouseX, mouseY, scale])

    const isLarge = pattern.includes('span-2')

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${pattern} relative overflow-hidden cursor-pointer group rounded-2xl`}
            style={{
                perspective: 1000,
                minHeight: pattern.includes('row-span-2') ? '400px' : '200px',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${image.url})` }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Glassmorphism info panel */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <span className="text-white text-sm font-medium">
                                {getLocalizedContent(image.alt, locale)}
                            </span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-75">
                            <Icon
                                icon="mdi:arrow-expand"
                                className="w-5 h-5 md:w-6 md:h-6 text-white"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Corner accent */}
                {isLarge && (
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
            </motion.div>
        </motion.div>
    )
}

export function ImageGallery({ data, locale }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)
    const touchStartX = useRef<number | null>(null)
    const touchEndX = useRef<number | null>(null)

    const openLightbox = useCallback((index: number) => setSelectedImage(index), [])
    const closeLightbox = useCallback(() => setSelectedImage(null), [])
    const nextImage = useCallback(
        () => setSelectedImage((prev) => (prev !== null ? (prev + 1) % data.images.length : null)),
        [data.images.length]
    )
    const prevImage = useCallback(
        () => setSelectedImage((prev) => (prev !== null ? (prev - 1 + data.images.length) % data.images.length : null)),
        [data.images.length]
    )

    // Handle touch swipe for mobile
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchEndX.current = null
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (touchStartX.current === null || touchEndX.current === null) return

        const swipeDistance = touchStartX.current - touchEndX.current
        const minSwipeDistance = 50 // Minimum distance to trigger swipe

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swiped left - go to next image
                nextImage()
            } else {
                // Swiped right - go to previous image
                prevImage()
            }
        }

        // Reset touch positions
        touchStartX.current = null
        touchEndX.current = null
    }, [nextImage, prevImage])

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage === null) return
            if (e.key === 'ArrowRight') nextImage()
            if (e.key === 'ArrowLeft') prevImage()
            if (e.key === 'Escape') closeLightbox()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedImage, nextImage, prevImage, closeLightbox])

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] grid-flow-dense">
                    {data.images.map((image, index) => (
                        <GalleryCard
                            key={image.url}
                            image={image}
                            index={index}
                            locale={locale}
                            onClick={() => openLightbox(index)}
                            pattern={getBentoPattern(index, data.images.length)}
                        />
                    ))}
                </div>
            </div>

            {/* Enhanced Lightbox */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl flex flex-col"
                        onClick={closeLightbox}
                    >
                        {/* Top bar */}
                        <div className="flex items-center justify-between p-4 md:p-6">
                            <div className="text-white/50 text-sm font-medium">
                                <span className="text-white">{selectedImage + 1}</span>
                                <span className="mx-2">/</span>
                                <span>{data.images.length}</span>
                            </div>
                            <button
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                onClick={closeLightbox}
                                aria-label="Close"
                            >
                                <Icon
                                    icon="mdi:close"
                                    className="w-5 h-5 text-white"
                                />
                            </button>
                        </div>

                        {/* Main image area */}
                        <div
                            className="flex-1 flex items-center justify-center px-4 md:px-20 relative"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Navigation - Previous */}
                            <button
                                className="absolute left-4 md:left-8 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:scale-110 z-10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    prevImage()
                                }}
                                aria-label="Previous image"
                            >
                                <Icon
                                    icon="mdi:chevron-left"
                                    className="w-7 h-7 md:w-8 md:h-8 text-white"
                                />
                            </button>

                            {/* Image */}
                            <motion.div
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="max-w-[85vw] max-h-[70vh] md:max-h-[75vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={data.images[selectedImage].url}
                                    alt={getLocalizedContent(data.images[selectedImage].alt, locale)}
                                    className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-lg shadow-2xl"
                                />
                            </motion.div>

                            {/* Navigation - Next */}
                            <button
                                className="absolute right-4 md:right-8 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:scale-110 z-10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    nextImage()
                                }}
                                aria-label="Next image"
                            >
                                <Icon
                                    icon="mdi:chevron-right"
                                    className="w-7 h-7 md:w-8 md:h-8 text-white"
                                />
                            </button>
                        </div>

                        {/* Thumbnail strip */}
                        <div className="p-4 md:p-6">
                            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-hide">
                                {data.images.map((image, index) => (
                                    <motion.button
                                        key={image.url}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedImage(index)
                                        }}
                                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                                            index === selectedImage
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-black scale-110'
                                                : 'opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${image.url})` }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
