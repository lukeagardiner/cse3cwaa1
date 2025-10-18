//app/api/player/models.ts
import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./playerdata.sqlite",
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
        safe: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        key: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        door: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { sequelize, modelName: "Progress" }
);

// Relationship definition
Player.hasOne(Progress, { foreignKey: "playerId" , onDelete: "CASCADE" });
Progress.belongsTo(Player, {foreignKey: "playerId"});

sequelize.sync();

export default sequelize;