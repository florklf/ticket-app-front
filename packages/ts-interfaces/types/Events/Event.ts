import { EnumEventStatus } from '../EnumEventStatus'
import { EventSeatType } from './EventSeatType'
import { Place } from './Place'
import { Type } from './Type'

export interface Event {
    id: number;
    name: string;
    description: string;
    type: Type;
    date: string|Date;
    image: string;
    place_id: number;
    place: Place;
    EventSeatType: EventSeatType[];
    status: EnumEventStatus;
}
