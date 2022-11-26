import { Item } from "../cargo";

class CoalOre extends Item {
    override id = "coal-ore";
    override price = 8;
}

class IronOre extends Item {
    override id = "iron-ore";
    override price = 15;
}

class Plastic extends Item {
    override id = "plastic";
    override price = 12;
}

class Steel extends Item {
    override id = "steel";
    override price = 50;
}