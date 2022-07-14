import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Box } from "@mui/material"
import React from "react"
import { ReactNode, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import "../../theme/global.css"

export interface WindowPortalProps {
    title: string
    onClose: () => void
    children: ReactNode
    config?: { top?: number; left?: number; width?: number; height?: number }
}

export const WindowPortal = React.forwardRef(function WindowPortal({ title, children, onClose, config }: WindowPortalProps, ref) {
    const containerEl = useRef(document.createElement("div"))
    const titleEl = useRef(document.createElement("title"))
    const cache = useRef(createCache({ key: "external", container: containerEl.current }))
    const [isOpened, setOpened] = useState(false)

    // Update the title if changed
    useEffect(() => {
        titleEl.current.innerText = title
    }, [title])

    // Create the new window
    useEffect(() => {
        const externalWindow = window.open(
            "",
            "",
            `width=${config?.width || 600},height=${config?.height || 400},left=${config?.left || 200},top=${
                config?.top || 200
            },scrollbars=on,resizable=on,dependent=on,menubar=off,toolbar=off,location=off`,
        )

        // if window.open fails
        if (!externalWindow) return onClose()

        externalWindow.addEventListener("beforeunload", onClose)
        externalWindow.document.head.appendChild(titleEl.current)
        containerEl.current.id = "testtt"
        externalWindow.document.body.appendChild(containerEl.current)

        setOpened(true)

        return () => {
            externalWindow.close()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!isOpened) return null

    return ReactDOM.createPortal(
        <CacheProvider value={cache.current}>
            <Box ref={ref} sx={{ width: "100%", height: "100%" }}>
                {children}
            </Box>
        </CacheProvider>,
        containerEl.current,
    )
})
