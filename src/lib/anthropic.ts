import Anthropic from "@anthropic-ai/sdk"

export function getAnthropic() {
    const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY ?? ""
    if (!apiKey) {
        throw new Error("Missing Anthropic API key. Set ANTHROPIC_API_KEY or CLAUDE_API_KEY in the environment.")
    }
    return new Anthropic({ apiKey })
}

export default getAnthropic
