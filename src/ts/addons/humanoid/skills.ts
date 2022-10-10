/**
 * The skills that a humanoid has
 */
const SkillC: {[id: string]: number} = {
    // Physical
    "strength": 0,
    "agility": 0,
    
    // Mental
    "fortitude": 0,
    
    // Engineering    
    "electrical": 0,
    "mechanical": 0,
    
    // Operating machinery and etc
    "machinery": 0,
    "intelligence": 0,
}

export type Skills = typeof SkillC;
