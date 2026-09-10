import { OPENWIKI_REASONING_EFFORT_ENV_KEY, } from "./constants.js";
export const REASONING_EFFORT_VALUES = [
    "none",
    "low",
    "medium",
    "high",
    "xhigh",
    "max",
];
const OPENAI_GPT_56_REASONING_CAPABILITY = {
    transport: "responses-reasoning",
    values: REASONING_EFFORT_VALUES,
};
const REASONING_CAPABILITIES = {
    openai: {
        "gpt-5.6-terra": OPENAI_GPT_56_REASONING_CAPABILITY,
        "gpt-5.6-luna": OPENAI_GPT_56_REASONING_CAPABILITY,
        "gpt-5.6-sol": OPENAI_GPT_56_REASONING_CAPABILITY,
    },
    "openai-chatgpt": {
        "gpt-5.6-terra": OPENAI_GPT_56_REASONING_CAPABILITY,
        "gpt-5.6-luna": OPENAI_GPT_56_REASONING_CAPABILITY,
        "gpt-5.6-sol": OPENAI_GPT_56_REASONING_CAPABILITY,
    },
    nvidia: {
        "nvidia/nemotron-3-super-120b-a12b": {
            transport: "chat-completions-reasoning-effort",
            values: ["none", "low", "high"],
        },
    },
};
export function getReasoningCapability(provider, modelId) {
    return REASONING_CAPABILITIES[provider]?.[modelId];
}
export function isReasoningEffort(value) {
    return REASONING_EFFORT_VALUES.includes(value);
}
export function resolveReasoningConfig(provider, modelId, env = process.env) {
    const rawEffort = env[OPENWIKI_REASONING_EFFORT_ENV_KEY];
    if (rawEffort === undefined) {
        return undefined;
    }
    const effort = rawEffort.trim();
    if (!isReasoningEffort(effort)) {
        throw new Error(`Invalid ${OPENWIKI_REASONING_EFFORT_ENV_KEY}. Expected one of: ${REASONING_EFFORT_VALUES.join(", ")}.`);
    }
    const capability = getReasoningCapability(provider, modelId);
    if (capability === undefined) {
        throw new Error(`${OPENWIKI_REASONING_EFFORT_ENV_KEY} is not supported for provider "${provider}" and model "${modelId}".`);
    }
    if (!capability.values.includes(effort)) {
        throw new Error(`Invalid ${OPENWIKI_REASONING_EFFORT_ENV_KEY} value "${effort}" for provider "${provider}" and model "${modelId}". Supported values: ${capability.values.join(", ")}.`);
    }
    return { effort, transport: capability.transport };
}
