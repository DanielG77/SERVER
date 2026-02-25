// src/components/Avatar.tsx
import React, { useState } from 'react';

interface AvatarProps {
    src?: string;
    alt: string;
    username?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    username = 'anon',
    size = 'md',
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    };

    const fallbackUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`;
    const imageUrl = src || fallbackUrl;

    const handleImageError = () => {
        setImageError(true);
        setIsLoading(false);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200 flex items-center justify-center flex-shrink-0 ${className}`}>
            {isLoading && !imageError && (
                <div className="animate-pulse bg-gray-300 w-full h-full" />
            )}
            {!imageError ? (
                <img
                    src={imageUrl}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
            ) : (
                // Fallback: initials or icon
                <svg className="w-3/5 h-3/5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )}
        </div>
    );
};

export default Avatar;
