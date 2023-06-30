import { Artist } from "./Artist";
import { Genre } from "./Genre";

export interface EventArtist {
    id: Number;
    event_id: Number;
    event: Event;
    artist_id: Number;
    artist: Artist;
}