export interface DamageSpecifier {
    physical: number
    temperature: number
    psychological: number
    chemical: number
    genetic: number
}

export class Health {
    public readonly maxHealth = 200;
    public damage: DamageSpecifier

    constructor(damage: DamageSpecifier) {
        this.damage = damage
    }

    public getTotalDamage() {
        return this.damage.physical + this.damage.temperature + this.damage.chemical + this.damage.psychological + this.damage.genetic
    }

    public getTotalHealth() {
        return this.maxHealth - this.getTotalDamage()
    }

    public getHealthPercentage() {
        return this.getTotalHealth() / this.maxHealth
    }

}
