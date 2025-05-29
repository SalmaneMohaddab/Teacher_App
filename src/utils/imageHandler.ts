const ORIGINAL_IMAGE_URL = 'https://assafir24.ma/wp-content/uploads/2022/05/1635097783_161_%D8%AC%D9%85%D9%8A%D8%B9-%D8%B4%D8%B9%D8%A7%D8%B1%D8%A7%D8%AA-%D9%88%D8%B2%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D9%8A%D8%A9-%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%D8%A9-%D9%88%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85-%D8%A7%D9%84%D8%A3%D9%88%D9%84%D9%8A-%D9%88%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9-%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-%D9%88%D9%81%D8%B1%D9%86%D8%B3%D9%8A%D8%A9.jpeg';
export const IMAGE_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(ORIGINAL_IMAGE_URL)}`;

export const checkOnlineStatus = async (): Promise<boolean> => {
  if (!navigator.onLine) {
    return false;
  }
  
  try {
    const response = await fetch(IMAGE_URL, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const getImage = async (): Promise<string | null> => {
  const isOnline = await checkOnlineStatus();
  
  if (!isOnline) {
    return null;
  }

  try {
    const response = await fetch(IMAGE_URL);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
}; 