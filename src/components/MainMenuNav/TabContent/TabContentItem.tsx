import { Box, Typography } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { useHistory } from "react-router-dom"
import { useUI } from "../../../containers"
import { RouteSingle } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { KeyboardKey } from "../../Common/KeyboardKey"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const TabContentItem = React.memo(function TabContentItem({ route, index, totalItems }: { route: RouteSingle; index: number; totalItems: number }) {
    const history = useHistory()
    const { toggleShowMainMenu } = useUI()

    const keyboardKey = useMemo(() => index + 1, [index])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return
            if (e.key === `${keyboardKey}`) {
                history.push(route.path)
                toggleShowMainMenu(false)
            }
        }

        const cleanup = () => document.removeEventListener("keydown", onKeyDown)
        cleanup()
        document.addEventListener("keydown", onKeyDown)

        return cleanup
    }, [history, keyboardKey, route.path, toggleShowMainMenu])

    let spanColumn = 1
    if (index === 0) {
        // First one always span 2
        spanColumn = 2
    } else if (totalItems % 2 === 0 && index === 1) {
        // If even number of things, then also span the 2nd item
        spanColumn = 2
    } else if (totalItems % 2 !== 0 && index === 3) {
        // If odd number of things, span 4th item
        spanColumn = 2
    }

    return (
        <NiceButton
            route={{ to: route.path }}
            onClick={() => toggleShowMainMenu(false)}
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF30",
                border: "none",
                background: `url(${route.showInMainMenu?.image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top center",
                backgroundSize: "cover",
                gridColumn: `span ${spanColumn}`,
            }}
        >
            <Typography sx={{ position: "absolute", top: "1.2rem", left: "1.3rem", fontFamily: fonts.nostromoBlack }}>{route.showInMainMenu?.label}</Typography>
            <KeyboardKey variant="body2" sx={{ position: "absolute", top: "1.1rem", right: "1.3rem" }} label={`${keyboardKey}`} />

            {/* Gradient overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: `linear-gradient(to top, #00000000 26%, #000000AA)`,
                    zIndex: -1,
                }}
            />
        </NiceButton>
    )
})
