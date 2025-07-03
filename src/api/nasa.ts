const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const FALLBACK_IMAGE = 'https://api.nasa.gov/assets/img/favicons/favicon-192.png';

export type NasaEndpoint = 'apod' | 'mars' | 'earth' | 'epic';

interface NasaResponse {
    title: string;
    image: string;
    description: string;
    fallback_image: string;
    date?: string;
}

const endpoints: Record<NasaEndpoint, string> = {
    apod: `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&thumbs=true`,
    mars: `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_API_KEY}`,
    earth: `https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_API_KEY}`,
    epic: `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`
};

export async function getNasaData(topic: NasaEndpoint): Promise<NasaResponse> {
    if (!(topic in endpoints)) {
        throw new Error('Invalid topic');
    }

    const response = await fetch(endpoints[topic]);
    if (!response.ok) {
        throw new Error(`NASA API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return formatResponse(topic, data);
}

function formatResponse(topic: NasaEndpoint, data: any): NasaResponse {
    const baseResponse: NasaResponse = {
        title: '',
        image: '',
        description: '',
        fallback_image: FALLBACK_IMAGE
    };

    switch (topic) {
        case 'apod':
            return {
                ...baseResponse,
                title: data.title || 'Astronomy Picture of the Day',
                image: data.media_type === 'video' ? data.thumbnail_url : data.url,
                description: data.explanation || '',
                date: data.date
            };

        case 'mars':
            const photo = data.latest_photos?.[0];
            return {
                ...baseResponse,
                title: `Mars Rover Photo (${photo?.camera.full_name || 'Unknown'})`,
                image: photo?.img_src || '',
                description: photo ? `Camera: ${photo.camera.full_name}` : '',
                date: photo?.earth_date
            };

        case 'earth':
        case 'epic':
            const image = Array.isArray(data) ? data[0] : data;
            const imageUrl = topic === 'earth' 
                ? `https://epic.gsfc.nasa.gov/archive/natural/${image.date.split(' ')[0].replace(/-/g, '/')}/png/${image.image}.png`
                : image.url;
            return {
                ...baseResponse,
                title: topic === 'earth' ? 'Earth Image' : 'EPIC Earth Image',
                image: imageUrl,
                description: topic === 'earth' 
                    ? 'Earth image from DSCOVR satellite' 
                    : 'Earth Polychromatic Imaging Camera',
                date: image.date
            };

        default:
            return baseResponse;
    }
}