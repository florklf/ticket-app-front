import { EnumEventStatus } from '../EnumEventStatus'
import { EnumEventType } from '../EnumEventType'
import { EventSeatType } from './EventSeatType'
import { Place } from './Place'

export interface Event {
    id: number;
    name: string;
    description: string;
    type: EnumEventType;
    date: string|Date;
    image: string;
    place_id: number;
    place: Place;
    EventSeatType: EventSeatType[];
    status: EnumEventStatus;
}
