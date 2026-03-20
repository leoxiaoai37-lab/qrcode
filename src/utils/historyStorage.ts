// src/utils/historyStorage.ts

const STORAGE_KEY = 'qr-toolbox-history';
const MAX_RECORDS = 30;

export interface HistoryRecord {
  id: string;
  createdAt: number;
  contentType: string;
  contentData: Record<string, string>;
  options: Record<string, unknown>;
  previewImage: string;  // Base64 图片
}

export const getHistory = (): HistoryRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecord = (record: Omit<HistoryRecord, 'id' | 'createdAt'>): HistoryRecord => {
  const history = getHistory();
  const newRecord: HistoryRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  // 添加到开头，最新的在前
  history.unshift(newRecord);

  // 超出限制时删除最旧的
  while (history.length > MAX_RECORDS) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newRecord;
};

export const deleteRecord = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
