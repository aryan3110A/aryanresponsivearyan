interface ImageRoute {
    [key: string]: string;
}

interface FolderImageRoutes {
    [folderName: string]: ImageRoute;
}

export const imageRoutes: FolderImageRoutes = {
    core: {
        logo: '/Core/logomain.png',
        favicon: '/images/core/favicon.ico',
        defaultAvatar: '/images/core/default-avatar.png',
    },
    auth: {
        loginBg: '/images/auth/login-background.jpg',
        signupBg: '/images/auth/signup-background.jpg',
    },
    dashboard: {
        // Dashboard specific images
        welcomeBanner: '/images/dashboard/welcome-banner.jpg',
        statsIcon: '/images/dashboard/stats-icon.svg',
    },
    // Add more folders as needed
    // profile: {
    //     avatar: '/images/profile/avatar.jpg',
    //     cover: '/images/profile/cover.jpg',
    // },
};

// Helper function to get image URL by folder and name
export const getImageUrl = (folder: string, imageName: string): string => {
    const folderImages = imageRoutes[folder];
    if (!folderImages) {
        console.warn(`Folder not found: ${folder}`);
        return '';
    }
    
    const url = folderImages[imageName];
    if (!url) {
        console.warn(`Image route not found for name: ${imageName} in folder: ${folder}`);
        return '';
    }
    return url;
};
