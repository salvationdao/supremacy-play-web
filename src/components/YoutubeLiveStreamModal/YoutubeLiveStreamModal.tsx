import React, { useState } from "react"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { NiceModal } from "../Common/Nice/NiceModal"

export const YoutubeLiveStreamModal = React.memo(function YoutubeLiveStreamModal() {
    const [liveStreamPath, setLiveStreamPath] = useState("")

    useGameServerSubscription<string>(
        {
            URI: "public/livestream",
            key: GameServerKeys.SubYoutubeLiveStream,
        },
        (payload) => {
            setLiveStreamPath(payload)
        },
    )

    if (!liveStreamPath) {
        return null
    }

    return (
        <NiceModal
            open
            key={liveStreamPath}
            onClose={() => setLiveStreamPath("")}
            disableBackdropClose
            sx={{
                width: "100rem",
                height: "60rem",
                maxWidth: "90vh",
                maxHeight: "90vh",
            }}
        >
            <iframe
                width="100%"
                height="100%"
                src={liveStreamPath}
                title="Supremacy Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </NiceModal>
    )
})
