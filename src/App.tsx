import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { getNasaData, NasaEndpoint } from './api/nasa';
import './App.css';

interface NasaContentProps {
    data: {
        title: string;
        image: string;
        description: string;
        fallback_image: string;
        date?: string;
    };
}

interface ErrorViewProps {
    error: string;
    onRetry: () => void;
}

const NasaContent = ({ data }: NasaContentProps) => (
    <div className="nasa-content">
        <h2>{data.title}</h2>
        <img 
            src={data.image} 
            alt={data.title} 
            className="nasa-image"
            onError={(e) => {
                (e.target as HTMLImageElement).src = data.fallback_image;
            }}
        />
        <p className="description">{data.description}</p>
        {data.date && <p className="date">Дата: {new Date(data.date).toLocaleDateString()}</p>}
    </div>
);

const ErrorView = ({ error, onRetry }: ErrorViewProps) => (
    <div className="error-view">
        <p>Ошибка: {error}</p>
        <button className="retry-button" onClick={onRetry}>
            Попробовать снова
        </button>
    </div>
);

const Loading = ({ message = 'Загрузка данных NASA...' }: { message?: string }) => (
    <div className="loading">
        <div className="loading-spinner"></div>
        <p>{message}</p>
    </div>
);

const getButtonLabel = (topic: NasaEndpoint): string => {
    switch (topic) {
        case 'apod': return 'Фото дня';
        case 'mars': return 'Марс';
        case 'earth': return 'Земля';
        case 'epic': return 'EPIC';
        default: return topic;
    }
};

export default function App() {
    const [content, setContent] = useState<JSX.Element>(
        <Loading message="Выберите категорию для просмотра снимков NASA" />
    );
    const [currentTopic, setCurrentTopic] = useState<NasaEndpoint | null>(null);

    useEffect(() => {
        bridge.send('VKWebAppInit');
    }, []);

    const loadData = async (topic: NasaEndpoint) => {
        setCurrentTopic(topic);
        setContent(<Loading />);
        
        try {
            const data = await getNasaData(topic);
            setContent(<NasaContent data={data} />);
        } catch (error) {
            setContent(
                <ErrorView 
                    error={error instanceof Error ? error.message : 'Неизвестная ошибка'} 
                    onRetry={() => loadData(topic)} 
                />
            );
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>NASA VK App</h1>
            </header>

            <div className="endpoint-selector">
                {(['apod', 'mars', 'earth', 'epic'] as NasaEndpoint[]).map((topic) => (
                    <button
                        key={topic}
                        className={`endpoint-button ${currentTopic === topic ? 'active' : ''}`}
                        onClick={() => loadData(topic)}
                    >
                        {getButtonLabel(topic)}
                    </button>
                ))}
            </div>

            <main className="content">
                {content}
            </main>

            <footer className="app-footer">
                <p>Данные предоставлены NASA API</p>
            </footer>
        </div>
    );
}