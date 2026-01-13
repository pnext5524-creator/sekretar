
export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  response: string | null;
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
  base64: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface LegalIssue {
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  citation?: string; // Reference to law (e.g., "ст. 12 59-ФЗ")
}

export interface LegalAnalysisResult {
  hasRisks: boolean;
  riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
  issues: LegalIssue[];
  generalComment: string;
  revisedText: string;
}

export enum EdmsType {
  ONEC = '1С:Документооборот',
  DIRECTUM = 'Directum RX',
  DELO = 'СЭД "Дело"'
}

export interface ArchiveItem {
  id: string;
  timestamp: number;
  fileName: string;
  fileType: string;
  instruction: string;
  responseText: string;
  status: 'DRAFT' | 'SENT'; // Simplified status
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  position: string;
}

// Extended user type for storage (includes credentials)
export interface StoredUser extends UserProfile {
  id: string;
  username: string;
  password: string; // Storing plain text for demo purposes only
}
