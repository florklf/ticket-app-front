import { Artist } from './Artist'

export interface EventArtist {
    id: number;
    event_id: number;
    artist_id: number;
    artist: Artist;
}
