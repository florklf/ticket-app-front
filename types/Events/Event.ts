import { EnumEventType } from '../EnumEventType'
import { EventSeatType } from './EventSeatType'
import { Place } from './Place'

export interface Event {
    id: number;
    name: string;
    description: string;
    type: EnumEventType;
    date: string;
    image: string;
    place_id: number;
    place: Place;
    EventSeatType: EventSeatType[];
}
