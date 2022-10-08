class Part {
    name: string = ""
    health: number = 0
    max_health: number = 0
    shield: number = 0

    constructor (name: string, health: number, max_health: number, shield: number){
        this.name = name
        this.health = health
        this.max_health = max_health
        this.shield = shield
    }
    
    get get_health() {
        return this.health
    }
    
    get get_shield() {
        return this.shield
    }
}
