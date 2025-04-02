interface ImageRoute {
    [key: string]: string;
}

interface FolderImageRoutes {
    [folderName: string]: ImageRoute;
}

export const imageRoutes: FolderImageRoutes = {
    core: {
        logo: '/Core/logomain.png',  
        coins : '/navigationSetting/coins.png',
        diamond : '/navigationSetting/diamond.png',
        profile:'/navigationSetting/profile.png'
    },
    landingpage:{
        discordimage: '/Landingpage/DiscordView/dc_view.gif',
        discorddark : '/Landingpage/DiscordView/discorddark.svg',
        discord : '/Landingpage/DiscordView/discord.svg',
        usingai:'/Landingpage/AIView/aiview.png'
    },
    contactus:{
        bg_rating:'/contactus/bg_rating7.png',
        rateicon : '/contactus/rateicon.png'
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
    sign:{
        signup: '/signup/Malakai030_11.png'
    }
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
