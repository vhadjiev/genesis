"use client";

import { Icon as IconifyIcon } from "@iconify/react";

export interface IconProps {
  /** Iconify icon name (e.g., "lucide:cloud", "lucide:arrow-right") */
  name: string;
  /** Size in pixels */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Icon primitive using Iconify.
 * Renders any icon from the Iconify ecosystem by name.
 *
 * @example
 * <Icon name="lucide:cloud" size={28} />
 * <Icon name="lucide:arrow-right" size={16} />
 */
export function Icon({ name, size = 24, className, style }: IconProps) {
  return (
    <IconifyIcon
      icon={name}
      width={size}
      height={size}
      className={className}
      style={style}
    />
  );
}
