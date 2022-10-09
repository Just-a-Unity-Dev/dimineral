import { Part } from "../classes/ship/part";

export type RoomTemplate = (string | number)[];
export const Bridge: RoomTemplate = ["Bridge", "bridge", 100, 100, 0];
export const Breakroom: RoomTemplate = ["Breakroom", "breakroom", 75, 75, 0];
export const CargoBay: RoomTemplate = ["Cargo Bay", "cargobay", 125, 125, 0];
export const LifeSupport: RoomTemplate = ["Life Support Generators", "life", 75, 75, 25];
export const Engines: RoomTemplate = ["Engines", "engine", 75, 75, 0];
export const Shields: RoomTemplate = ["Shields", "shields", 75,75,100]

export function createFromRoomTemplate(room: RoomTemplate) {
    return new Part(
        <string>room[0],
        <string>room[1],
        <number>room[2],
        <number>room[3],
        <number>room[4]
    )
}
