export interface ExitPopupTranslations {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

export const exitPopupTranslations: Record<string, ExitPopupTranslations> = {
    'vi-VN': {
        title: 'Thông báo',
        message: 'Bạn có muốn thoát khỏi trò chơi?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy'
    },
    'en-US': {
        title: 'Notice',
        message: 'Do you want to exit the game?',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    },
    'zh-CN': {
        title: '提示',
        message: '是否要退出游戏？',
        confirmText: '确定',
        cancelText: '取消'
    },
    'zh-TW': {
        title: '提示',
        message: '是否要離開遊戲？',
        confirmText: '確定',
        cancelText: '取消'
    }
};

export const getExitPopupTranslations = (language: string): ExitPopupTranslations => {
    // Extract base language (e.g., 'zh' from 'zh-CN')
    const baseLanguage = language.split('-')[0];
    
    // Try exact match first, then fallback to base language, then default to zh-TW
    return exitPopupTranslations[language] || 
           exitPopupTranslations[baseLanguage] || 
           exitPopupTranslations['zh-TW'];
};
