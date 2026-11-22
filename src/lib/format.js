export const MONTHS = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
export const MONTHS_LONG = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];

const pad = (n) => String(n).padStart(2, '0');

// 12500 -> "12 500 ₾"
export function gel(n) {
  return Math.round(n || 0).toLocaleString('en-US').replace(/,/g, ' ') + ' ₾';
}

export function ago(value) {
  const m = Math.round((Date.now() - new Date(value)) / 6e4);
  if (m < 1) return 'ახლახან';
  if (m < 60) return m + ' წთ წინ';
  const h = Math.round(m / 60);
  if (h < 24) return h + ' სთ წინ';
  const d = Math.round(h / 24);
  return d === 1 ? 'გუშინ' : d + ' დღის წინ';
}

export function fdate(value) {
  const d = new Date(value);
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

export function shortDate(value) {
  const d = new Date(value);
  return d.getDate() + ' ' + MONTHS[d.getMonth()];
}

export function longDate(value = new Date()) {
  const d = new Date(value);
  return d.getDate() + ' ' + MONTHS_LONG[d.getMonth()] + ', ' + d.getFullYear();
}

export function initials(order) {
  return (order.firstName || ' ').charAt(0) + (order.lastName || ' ').charAt(0);
}
