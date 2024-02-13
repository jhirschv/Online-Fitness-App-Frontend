import React from 'react'
import { useTheme } from '@/components/theme-provider';

const Progress = () => {
    const { theme } = useTheme();

    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <div>Progress</div>
        </div>
    )
}

export default Progress