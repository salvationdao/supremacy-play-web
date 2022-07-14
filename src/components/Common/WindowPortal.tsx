import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Box } from "@mui/material"
import React, { ReactNode, useRef, useState } from "react"
import NewWindow, { IWindowFeatures } from "react-new-window"

export interface WindowPortalProps {
    title: string
    onClose: () => void
    children: ReactNode
    features?: IWindowFeatures
}

export const WindowPortal = React.forwardRef(function WindowPortal({ title, children, onClose, features }: WindowPortalProps, ref) {
    const [container, setContainer] = useState<HTMLElement | null>(null)

    return (
        <NewWindow title={title} onUnload={onClose} features={features}>
            <Box ref={(ref: HTMLElement) => setContainer(ref)} sx={{ width: "100%", height: "100%" }}>
                <Box ref={ref} sx={{ width: "100%", height: "100%" }}>
                    {container && <CacheWrapper container={container}>{children}</CacheWrapper>}
                </Box>
            </Box>
        </NewWindow>
    )
})

const CacheWrapper = ({ container, children }: { container: HTMLElement; children: ReactNode }) => {
    const cache = useRef(createCache({ key: "external", container }))

    return <CacheProvider value={cache.current}>{children}</CacheProvider>
}
