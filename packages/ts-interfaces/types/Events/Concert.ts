import { Artist } from './Artist'
import { Event } from './Event'
import { Genre } from './Genre'

export interface Concert extends Event {
    genre: Genre;
    artist: Artist;
    artist_id: number;
    genre_id: number;
}
