export function formatToman(priceInToman: number): string {
  if (isNaN(priceInToman)) return '۰ تومان';
  const formatted = priceInToman.toLocaleString('fa-IR');
  return `${formatted} تومان`;
}

export function toPersianDigits(str: string | number): string {
  if (str === undefined || str === null) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

export function calculateDiscountPrice(originalPrice: number, discountPercent: number): number {
  return Math.round(originalPrice * (1 - discountPercent / 100));
}
