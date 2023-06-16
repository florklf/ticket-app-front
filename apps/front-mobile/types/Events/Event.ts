import { EventArtist } from './EventArtist'
import { EventGenre } from './EventGenre'
import { EventSeatType } from './EventSeatType'
import { Place } from './Place'
import { Type } from './Type'

export interface Event {
    id: number;
    name: string;
    description: string;
    type: Type;
    date: string;
    image: string;
    place_id: number;
    place: Place;
    EventSeatType: EventSeatType[];
    eventArtists: EventArtist[];
    eventGenres: EventGenre[];
}
