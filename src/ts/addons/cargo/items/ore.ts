import { Item } from "../cargo";

export class CoalOre extends Item {
    public override name = "Coal Ore";
    override id = "coal-ore";
    override price = 8;
}

export class IronOre extends Item {
    public override name = "Iron Ore";
    override id = "iron-ore";
    override price = 15;
}

export class Plastic extends Item {
    public override name = "Plastic";
    override id = "plastic";
    override price = 12;
}

export class Steel extends Item {
    public override name = "Steel";
    override id = "steel";
    override price = 50;
}