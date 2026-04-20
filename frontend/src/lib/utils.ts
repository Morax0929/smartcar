export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop";
  
  let baseUrl = "http://localhost:8000"; // default local backend
  if (process.env.NEXT_PUBLIC_API_URL) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
  }

  // Backend lokal bo'lgan vaqtda xato saqlangan rasmlarni fix qilish
  if (url.startsWith('http://localhost:8000')) {
    return url.replace('http://localhost:8000', baseUrl);
  }
  
  // To'g'ri (nisbiy) saqlangan rasmlar uchun base url qo'shish
  if (url.startsWith('/uploads')) {
    return `${baseUrl}${url}`;
  }

  // To'liq tashqi URL yoki to'g'ri backend URL bo'lsa
  return url;
};
