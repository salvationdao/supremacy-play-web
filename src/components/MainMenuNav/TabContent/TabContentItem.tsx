import { Box, Typography } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { useHistory } from "react-router-dom"
import { useUI } from "../../../containers"
import { isExternalURL } from "../../../helpers"
import { MainMenuStruct } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { KeyboardKey } from "../../Common/KeyboardKey"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const TabContentItem = React.memo(function TabContentItem({
    mainMenuStruct,
    index,
    totalItems,
}: {
    mainMenuStruct: MainMenuStruct
    index: number
    totalItems: number
}) {
    const history = useHistory()
    const { toggleShowMainMenu } = useUI()

    const isExternal = useMemo(() => isExternalURL(mainMenuStruct.path), [mainMenuStruct.path])
    const keyboardKey = useMemo(() => index + 1, [index])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return
            if (e.key === `${keyboardKey}`) {
                if (isExternal) {
                    window.open(mainMenuStruct.path, mainMenuStruct.target)
                } else {
                    history.push(mainMenuStruct.path)
                }
                toggleShowMainMenu(false)
            }
        }

        const cleanup = () => document.removeEventListener("keydown", onKeyDown)
        cleanup()
        document.addEventListener("keydown", onKeyDown)

        return cleanup
    }, [history, isExternal, keyboardKey, mainMenuStruct.path, mainMenuStruct.target, toggleShowMainMenu])

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

    const niceButtonProp = isExternal
        ? { link: { href: mainMenuStruct.path, target: mainMenuStruct.target } }
        : { route: { to: mainMenuStruct.path, target: mainMenuStruct.target } }

    return (
        <NiceButton
            {...niceButtonProp}
            disableAutoColor
            onClick={() => toggleShowMainMenu(false)}
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                gridColumn: `span ${spanColumn}`,
            }}
        >
            <Typography sx={{ position: "absolute", top: "1.2rem", left: "1.3rem", fontFamily: fonts.nostromoBlack }}>{mainMenuStruct.label}</Typography>
            <KeyboardKey variant="body2" sx={{ position: "absolute", top: "1.1rem", right: "1.3rem" }} label={`${keyboardKey}`} />

            {/* Background image */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: `url(${mainMenuStruct.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                    backgroundSize: "cover",
                    zIndex: -2,
                }}
            />

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
