/**
 * Dil koduna göre bayrak görüntüsünü döndüren yardımcı fonksiyon
 * @param langCode Dil kodu (eng, tr, gr, spn vb.)
 * @returns Bayrak görüntüsü
 */
export const getFlagImage = (langCode: string) => {
  try {
    switch (langCode.toLowerCase()) {
      case 'eng':
        return require('@/assets/images/flags/eng.png');
      case 'tr':
        return require('@/assets/images/flags/tr.png');
      case 'gr':
        return require('@/assets/images/flags/gr.png');
      case 'spn':
        return require('@/assets/images/flags/spn.png');
      default:
        return require('@/assets/images/flags/eng.png'); // Varsayılan
    }
  } catch (error) {
    console.log('Flag image yükleme hatası:', error);
    // Hata durumunda boş object döndür
    return null;
  }
};

/**
 * Dil kodundan tam dil adını döndüren yardımcı fonksiyon
 * @param langCode Dil kodu
 * @returns Tam dil adı
 */
export const getLanguageName = (langCode: string) => {
  switch (langCode.toLowerCase()) {
    case 'eng':
      return 'English';
    case 'tr':
      return 'Turkish';
    case 'gr':
      return 'German';
    case 'spn':
      return 'Spanish';
    default:
      return 'Unknown';
  }
}; 