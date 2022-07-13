import { Box } from "@mui/system"
import { ReactNode, useEffect, useRef } from "react"
import { useMoveableResizable } from "./MoveableResizableContainer"

export const MoveableResizablePoppedOut = ({ children }: { children: ReactNode }) => {
    const { isPoppedOut, setCurWidth, setCurHeight } = useMoveableResizable()

    const bodyEl = useRef<HTMLElement | null>(null)
    const resizeObserver = useRef<ResizeObserver>()

    // Popped out logic
    useEffect(() => {
        const cleanup = () => {
            resizeObserver.current && bodyEl.current && resizeObserver.current.unobserve(bodyEl.current)
        }

        if (!isPoppedOut) {
            cleanup()
            return
        }

        console.log("XXXXXX")
        bodyEl.current = document.getElementById("testtt")
        if (!bodyEl.current) return

        console.log(bodyEl.current)
        resizeObserver.current = new ResizeObserver((entries) => {
            console.log("BNNNNNNNNNNNNNNNNNNNNNNNn")
            console.log(entries)
            const rect = entries[0].contentRect
            setCurWidth(rect.width)
            setCurHeight(rect.height)
        })

        console.log("CCCCCCCCCCCCCCc")
        return cleanup
    }, [isPoppedOut, setCurHeight, setCurWidth])

    return <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>
}
