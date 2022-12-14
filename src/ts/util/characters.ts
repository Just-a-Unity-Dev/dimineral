import { Character } from "../addons/humanoid/character";
import { Health } from "../addons/humanoid/health";
import { Skills } from "../addons/humanoid/skills";
import { generateName, pickFromArray } from "./rng";
import { makeSkills } from "./skills";

/**
 * You must use 25 skill points only
*/
export const maxSkillPoints = 25;

/**
 * All jobs and their starting skill points.
 */
 export const jobs: {[id: string]: Skills} = {
    // Command
    // "captain": makeSkills(4,4,3,1,1,8,4),

    // Security
    "officer": makeSkills(8,4,3,1,1,4,4),

    // Medical
    "doctor": makeSkills(3,2,3,0,1,4,12),
    "medic": makeSkills(3,5,3,1,1,4,8),
    
    // Cargo
    "quartermaster": makeSkills(4,2,2,1,2,4,10),
    "miner": makeSkills(8,6,3,1,2,4,1),

    // Engineering
    "engineer": makeSkills(3,2,1,3,8,6,2),
    "technician": makeSkills(3,2,1,8,3,6,2)
}

export function getJob(name: string): (string | Skills)[] {
    return [name, jobs[name]]
}

/**
 * Generates a completely random character
 * @returns Character
 */
export function generateCharacter(id: string): Character {
    const keys = Object.keys(jobs);
    const job: (string | Skills)[] = getJob(pickFromArray(keys));
    const member: Character = new Character(
        generateName(),
        <string>job[0],
        "breakroom",
        new Health({"physical": 0, "temperature": 0, "chemical": 0, "psychological": 0, "genetic": 0}),
        <Skills>job[1],
        id
    );

    return member
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
