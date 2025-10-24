export interface ExitPopupTranslations {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

export const exitPopupTranslations: Record<string, ExitPopupTranslations> = {
    'vi-VN': {
        title: 'Thông báo',
        message: 'Bạn có muốn thoát game không?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy'
    },
    'en-US': {
        title: 'Alert',
        message: 'Do you want to leave the game?',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    },
    'zh-CN': {
        title: '提示',
        message: '您要离开游戏吗？',
        confirmText: '确认',
        cancelText: '取消'
    },
    'zh-TW': {
        title: '提示',
        message: '是否要離開遊戲？',
        confirmText: '確定',
        cancelText: '取消'
    },
    'th-TH': {
        title: 'แจ้งเตือน',
        message: 'คุณต้องการออกจากเกมหรือไม่?',
        confirmText: 'ยืนยัน',
        cancelText: 'ยกเลิก'
    },
    'id-ID': {
        title: 'Peringatan',
        message: 'Apakah Anda ingin keluar dari permainan?',
        confirmText: 'Konfirmasi',
        cancelText: 'Batal'
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
