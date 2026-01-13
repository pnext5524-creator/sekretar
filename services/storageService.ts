import { ArchiveItem } from "../types";

const ARCHIVE_KEY = 'sekretar_archive_v1';

export const saveToArchive = (
  fileName: string, 
  fileType: string, 
  instruction: string, 
  responseText: string
): ArchiveItem => {
  const newItem: ArchiveItem = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    fileName,
    fileType,
    instruction,
    responseText,
    status: 'DRAFT'
  };

  const currentArchive = getArchive();
  const updatedArchive = [newItem, ...currentArchive];
  
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updatedArchive));
  } catch (e) {
    console.error("Failed to save to local storage (quota might be exceeded)", e);
    // In a real app, we would handle quota errors or use IndexedDB
  }

  return newItem;
};

export const getArchive = (): ArchiveItem[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(ARCHIVE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as ArchiveItem[];
  } catch (e) {
    console.error("Failed to parse archive data", e);
    return [];
  }
};

export const deleteFromArchive = (id: string): void => {
  const currentArchive = getArchive();
  const updatedArchive = currentArchive.filter(item => item.id !== id);
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updatedArchive));
};
