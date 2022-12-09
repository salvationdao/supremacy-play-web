import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Box } from "@mui/material"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import NewWindow, { IWindowFeatures } from "react-new-window"
import { WindowPortalProvider } from "./WindowPortalContainer"

export interface WindowPortalProps {
    title: string
    backgroundColor?: string
    onClose: () => void
    children: ReactNode
    features?: IWindowFeatures
}

export const WindowPortal = React.forwardRef(function WindowPortal({ title, backgroundColor, children, onClose, features }: WindowPortalProps, ref) {
    const [container, setContainer] = useState<HTMLElement | null>(null)

    return (
        <NewWindow title={title} onUnload={onClose} features={features}>
            <WindowPortalProvider initialState={{ features, container }}>
                <Box
                    ref={(ref: HTMLElement) => setContainer(ref)}
                    sx={{ width: "100%", height: "100%", backgroundColor: (theme) => backgroundColor || theme.factionTheme.u800 }}
                >
                    <Box ref={ref} sx={{ width: "100%", height: "100%" }}>
                        {container && <CacheWrapper container={container}>{children}</CacheWrapper>}
                    </Box>
                </Box>
            </WindowPortalProvider>
        </NewWindow>
    )
})

const CacheWrapper = ({ container, children }: { container: HTMLElement; children: ReactNode }) => {
    const cache = useRef(createCache({ key: "external", container }))

    useEffect(() => {
        const htmls = container.ownerDocument.getElementsByTagName("html")
        if (htmls.length > 0) {
            htmls[0].style.fontSize = window.getComputedStyle(document.body).fontSize
        }
    }, [container.ownerDocument])

    return <CacheProvider value={cache.current}>{children}</CacheProvider>
}
