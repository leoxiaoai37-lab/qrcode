// src/utils/qrFormatters.ts

interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  address: string;
  website: string;
}

interface EventData {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface GeoData {
  lat: string;
  lon: string;
}

interface SMSData {
  phone: string;
  message: string;
}

interface EmailData {
  email: string;
  subject: string;
  body: string;
}

interface AppData {
  iosUrl: string;
  androidUrl: string;
}

interface PaymentData {
  platform: 'alipay' | 'wechat';
  link: string;
  amount?: string;
  note?: string;
}

export const formatText = (text: string): string => text;

export const formatUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const formatEmail = (data: EmailData): string => {
  let result = `mailto:${data.email}`;
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  if (params.length > 0) result += '?' + params.join('&');
  return result;
};

export const formatPhone = (phone: string): string => `tel:${phone.replace(/\s/g, '')}`;

export const formatSMS = (data: SMSData): string => {
  const phone = data.phone.replace(/\s/g, '');
  return `smsto:${phone}:${data.message}`;
};

export const formatWiFi = (data: WiFiData): string => {
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
};

export const formatVCard = (data: VCardData): string => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`,
  ];
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.address) lines.push(`ADR:;;${data.address};;;`);
  if (data.website) lines.push(`URL:${data.website}`);
  lines.push('END:VCARD');
  return lines.join('\n');
};

export const formatEvent = (data: EventData): string => {
  const lines = [
    'BEGIN:VEVENT',
    `SUMMARY:${data.title}`,
  ];
  if (data.location) lines.push(`LOCATION:${data.location}`);
  if (data.startTime) lines.push(`DTSTART:${data.startTime.replace(/[-:]/g, '').replace('T', 'T')}`);
  if (data.endTime) lines.push(`DTEND:${data.endTime.replace(/[-:]/g, '').replace('T', 'T')}`);
  if (data.description) lines.push(`DESCRIPTION:${data.description}`);
  lines.push('END:VEVENT');
  return lines.join('\n');
};

export const formatGeo = (data: GeoData): string => {
  return `geo:${data.lat},${data.lon}`;
};

export const formatApp = (data: AppData): string => {
  // 使用通用跳转服务格式
  if (data.iosUrl && data.androidUrl) {
    return data.iosUrl; // 默认返回 iOS 链接
  }
  return data.iosUrl || data.androidUrl || '';
};

export const formatPayment = (data: PaymentData): string => {
  if (data.platform === 'alipay') {
    // 支付宝：如果有金额，添加金额参数
    if (data.amount) {
      return `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent(data.link)}&amount=${data.amount}`;
    }
    return data.link;
  }
  // 微信：直接使用原链接
  return data.link;
};
