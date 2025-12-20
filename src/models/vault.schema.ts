import { Schema, SchemaTypes } from "mongoose";

export interface IVaultItem {
    id: string;
    nonce: string;
    ciphertext: string;
}

export interface IVault {
    salt: string;
    meta: {
        version: string;
    };
    settings: unknown;
    unlock: unknown;
    items: Array<IVaultItem>;
    createdAt: Date;
    updatedAt: Date;
}

export const VaultSchema = new Schema<IVault>(
    {
        salt: {
            type: String,
            required: true,
        },
        meta: {
            version: {
                type: String,
                required: true,
            },
        },
        settings: {
            type: SchemaTypes.Mixed,
        },
        unlock: {
            type: SchemaTypes.Mixed,
        },
        items: [
            {
                id: {
                    type: String,
                    required: true,
                },
                ciphertext: {
                    type: String,
                    required: true,
                },
                nonce: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);
