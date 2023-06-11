import { Genre } from './Genre'

export interface EventGenre {
    id: number;
    event_id: number;
    genre_id: number;
    genre: Genre
}
