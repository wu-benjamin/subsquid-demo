function required({
    value,
    label,
    defaultValue,
}: {
    value: string | undefined,
    label?: string
    defaultValue?: string
}): string {
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Value is required${label ? ` for ${label}` : ''}.`);
    }
    return value;
}

function requiredInt({
    value,
    label,
    defaultValue,
}: {
    value: string | undefined,
    label?: string
    defaultValue?: number
}): number {
    const parsedValue = parseInt(required({ value, label, defaultValue: defaultValue?.toString() }));
    if (isNaN(parsedValue)) {
        throw new Error(`Value is not a number${label ? ` for ${label}` : ''}.`);
    }
    return parsedValue;
}

function requiredBoolean({
    value,
    label,
    defaultValue,
}: {
    value: string | undefined,
    label?: string
    defaultValue?: boolean
}): boolean {
    switch (required({ value, label, defaultValue: defaultValue?.toString() })) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throw new Error(`Value is not a boolean${label ? ` for ${label}` : ''}.`);
    }
}

export const RPC_ENDPOINT = required({
    value: process.env.RPC_ENDPOINT,
    label: "[env] RPC_ENDPOINT"
});

export const WALLET_CONTRACT_ADDRESS = required({
    value: process.env.WALLET_CONTRACT_ADDRESS,
    label: "[env] WALLET_CONTRACT_ADDRESS"
});

export const START_BLOCK_NUMBER = requiredInt({
    value: process.env.START_BLOCK_NUMBER,
    label: "[env] START_BLOCK_NUMBER"
});

export const NUMBER_OF_CONFIRMATION_FOR_BLOCK_FINALITY = requiredInt({
    value: process.env.NUMBER_OF_CONFIRMATION_FOR_BLOCK_FINALITY,
    label: "[env] NUMBER_OF_CONFIRMATION_FOR_BLOCK_FINALITY"
});

export const USE_ARCHIVE_GATEWAY = requiredBoolean({
    value: process.env.USE_ARCHIVE_GATEWAY,
    label: "[env] USE_ARCHIVE_GATEWAY"
});

export const GATEWAY_URL = required({
    value: process.env.GATEWAY_URL,
    label: "[env] GATEWAY_URL",
});

export const QUERY_ACCESS_TOKEN = required({
    value: process.env.QUERY_ACCESS_TOKEN,
    label: "[env] QUERY_ACCESS_TOKEN",
});
export const DISABLE_ACCESS_CONTROL = requiredBoolean({
    value: process.env.DISABLE_ACCESS_CONTROL,
    label: "[env] DISABLE_ACCESS_CONTROL",
    defaultValue: false,
});
