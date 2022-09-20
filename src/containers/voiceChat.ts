import { useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { OvenStreamContainer } from "./oven"

export const VoiceChatContainer = createContainer(() => {
    // initialize oven live kit
    const ovenLiveKit = useRef<any>()

    const [] = useState()

    return {
        ovenLiveKit,
    }
})

export const VoiceChatProvider = VoiceChatContainer.Provider
export const useVoiceChat = VoiceChatContainer.useContainer
