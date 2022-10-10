/**
 * The `DamageSpecifier` specifies how much damage a humanoid has taken.
 * If you want to use this for Health, please use `Health`
 */
export interface DamageSpecifier {
    physical: number
    temperature: number
    psychological: number
    chemical: number
    genetic: number
}

/**
 * The State of a humanoid, whether they are alive or dead.
 * This will support unconsciousness and others soon, whenever you code it.
 */
export enum State {
    ALIVE,
    DEAD
}

/**
 * The Health of a humanoid, containing functions and states all health-related.
 */
export class Health {
    public readonly maxHealth = 200;
    public damage: DamageSpecifier;
    public state: State = State.ALIVE;

    constructor(damage: DamageSpecifier) {
        this.damage = damage;
    }

    /**
     * Returns the total damage that the humanoid has sustained
     * @returns number
     * @example
     * // returns 0
     * Character.health.getTotalDamage()
     */
    public getTotalDamage(): number {
        return this.damage.physical + this.damage.temperature + this.damage.chemical + this.damage.psychological + this.damage.genetic;
    }

    /**
     * Returns the total health that the humanoid has left
     * @returns number
     * @example
     * // returns 200
     * Character.health.getTotalHealth()
     */
    public getTotalHealth(): number {
        return this.maxHealth - this.getTotalDamage();
    }

    /**
     * Deals damage to the humanoid in a `DamageSpecifier`
     * @param taken DamageSpecifier
     */
    public dealDamage(taken: DamageSpecifier) {
        this.damage.physical += taken.physical;
        this.damage.temperature += taken.temperature;
        this.damage.psychological += taken.psychological;
        this.damage.chemical += taken.chemical;
        this.damage.genetic += taken.genetic;

        this.state = State.ALIVE;

        if (this.getTotalDamage() >= 200) {
            this.state = State.DEAD;
        }
    }

    /**
     * Returns a percentage from 1 to 0
     * @returns number
     */
    public getHealthPercentage(): number {
        return this.getTotalHealth() / this.maxHealth
    }

}
