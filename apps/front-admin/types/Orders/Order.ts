import { EnumEventStatus } from '../EnumEventStatus'
import { EnumEventType } from '../EnumEventType'
import { Place } from '../Events/Place'

export interface Order {
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
