import React from 'react';
import { cn } from '../../types/utilis';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  className,
  size = 'md',
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-gray-200',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Replace with fallback on error
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-white border-2 border-gray-300 rounded-full">
          <User size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 32 : 48} className="text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default Avatar;