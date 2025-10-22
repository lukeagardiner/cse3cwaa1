//app/api/player/models.ts
import path from "node:path";
import "server-only";
import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

// absolute path to the sqlite file in the project root
// adding a switch for test
const DB_FILE =
    process.env.NODE_ENV === "test"
        ? ":memory:"
        : path.join(process.cwd(), "playerdata.sqlite");

export const sequelize = new Sequelize({
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
    {
        sequelize,
        modelName: "Player",
        timestamps: true,
    }
);

// Handle player progress
export class Progress extends Model {
    declare id: number;
    declare playerId: string;
    declare safe:  boolean;
    declare key:  boolean;
    declare door: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Progress.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        playerId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true, // control to make sure there is only one progress row per player
        },
        safe: { type: DataTypes.BOOLEAN, defaultValue: false },
        key: { type: DataTypes.BOOLEAN, defaultValue: false },
        door: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        sequelize,
        modelName: "Progress",
        timestamps: true,
        indexes: [{ fields: ["playerId"], unique: true }],
    }
);

// Relationship definition
Player.hasOne(Progress, { foreignKey: "playerId" , onDelete: "CASCADE" });
Progress.belongsTo(Player, {foreignKey: "playerId"});

//sequelize.sync();
// ----- UPDATE TO MAKE SURE SYNC ISN'T AT IMPORT TIME ----
let _synced = false;
export async function ensureDbSynced(opts?:{force? : boolean}) {
    if (opts?.force) {
        await sequelize.sync({ force: true });
        _synced = true;
        return;
    }
    if (_synced) return;
    await sequelize.sync();
    _synced = true;
}
