export type NasaEndpoint = 'apod' | 'mars' | 'earth' | 'epic';

export interface NasaData {
  title: string;
  url: string;
  explanation?: string;
  date?: string;
  media_type?: 'image' | 'video';
  photos?: any[];
}

export interface ErrorViewProps {
  error: string;
  onRetry: () => void;
}