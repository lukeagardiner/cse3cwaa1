//app/api/player/models.ts
import "server-only";
import { Sequelize, DataTypes, Model } from "sequelize";
import path from "node:path";
import bcrypt from "bcrypt";

// absolute path to the sqlite file in the project root
const DB_FILE = path.join(process.cwd(), "playerdata.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: DB_FILE,
    logging: false,
});

export class Player extends Model {
    declare playerId: string;
    declare email: string | null;
    declare passwordHash: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    async validPassword(password: string) {
        // db stores hash but not password for protection
        return bcrypt.compare(password, this.passwordHash);
    }
}

// Mandatory Player field controls
Player.init(
    {
        playerId: {
          type: DataTypes.STRING(255),
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: false,
            validate: {
                isEmailOrNull(value: string | null) {
                    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        throw new Error("Invalid email format");
                    }
                },
            },
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    { sequelize, modelName: "Player" }
);

// Handle player progress
export class Progress extends Model {
    declare id: number;
    declare playerId: string;
    declare safe:  boolean;
    declare key:  boolean;
    declare door: boolean;
    declare updatedAt: Date;
}

Progress.init(
    {
        playerId: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        safe: { type: DataTypes.BOOLEAN, defaultValue: false },
        key: { type: DataTypes.BOOLEAN, defaultValue: false },
        door: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "Progress" }
);

// Relationship definition
Player.hasOne(Progress, { foreignKey: "playerId" , onDelete: "CASCADE" });
Progress.belongsTo(Player, {foreignKey: "playerId"});

//sequelize.sync();
// ----- UPDATE TO MAKE SURE SYNC ISN'T AT IMPORT TIME ----
let _synced = false;
export async function ensureDbSynced() {
    if (_synced) return;
    await sequelize.sync();
    _synced = true;
}

//export default sequelize;