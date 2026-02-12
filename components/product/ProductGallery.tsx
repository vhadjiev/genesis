'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProductGalleryData {
    type: 'productGallery'
    images: string[]
}

interface ProductGalleryProps {
    data: ProductGalleryData
    locale: string
}

export function ProductGallery({ data }: ProductGalleryProps) {
    if (!data.images || data.images.length === 0) {
        return null
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card"
                        >
                            <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
