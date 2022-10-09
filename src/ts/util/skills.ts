import { Skills } from "../classes/humanoid/skills";

/**
 * Quickly generate a Skills interface.
 * 
 * @param strength number
 * @param agility number
 * @param fortitude number
 * @param electrical number
 * @param mechanical number
 * @param machinery number
 * @param intelligence number
 * @returns number
 */
export function makeSkills(
    strength: number,
    agility: number,
    fortitude: number,
    electrical: number,
    mechanical: number,
    machinery: number,
    intelligence: number
): Skills {
    return {
        "strength": strength,
        "agility": agility,
        "fortitude": fortitude,
        "electrical": electrical,
        "mechanical": mechanical,
        "machinery": machinery,
        "intelligence": intelligence
    }
}