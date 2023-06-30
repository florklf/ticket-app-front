import { Genre } from "./Genre";

export interface EventGenre {
    id: Number;
    event_id: Number;
    event: Event;
    genre_id: Number;
    genre: Genre;
}