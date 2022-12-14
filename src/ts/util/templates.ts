import { Part } from "../addons/ship/part";

export type RoomTemplate = (string | number | boolean)[];
export const Bridge: RoomTemplate = ["Bridge", "bridge", 100];
export const Breakroom: RoomTemplate = ["Breakroom", "breakroom", 75];
export const Medbay: RoomTemplate = ["Medical Bay", "medbay", 50];
export const CargoBay: RoomTemplate = ["Cargo Bay", "cargobay", 125];
export const LifeSupport: RoomTemplate = ["Life Support Generators", "life", 75];
export const Engines: RoomTemplate = ["Engines", "engine", 75];
export const Airlock: RoomTemplate = ["Airlock", "airlock", 200];
export const Shields: RoomTemplate = ["Shields", "shields", 75];

/**
 * Creates a Part from a RoomTemplate
 * @param room RoomTemplate
 * @param id id
 * @returns Part
 */
export function createFromRoomTemplate(room: RoomTemplate, id: string) {
    return new Part(
        <string>room[0],
        <string>room[1],
        <number>room[2],
        id
    )
}
