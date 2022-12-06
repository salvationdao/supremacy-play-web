import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { SvgArrow, SvgLobbies, SvgMainMenu } from "../../assets"
import { useUI } from "../../containers"
import { fonts } from "../../theme/theme"
import { KeyboardKey } from "../Common/KeyboardKey"
import { NiceButton } from "../Common/Nice/NiceButton"

export const BarButton = () => {
    const { toggleShowMainMenu } = useUI()

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // If playing repair stack game, return
            if (document.getElementById("repair-game-stack")) {
                return
            }

            if (e.repeat) return

            if (e.key.toLowerCase() === "m") toggleShowMainMenu()
        }

        const cleanup = () => document.removeEventListener("keydown", onKeyDown)
        cleanup()
        document.addEventListener("keydown", onKeyDown)

        return cleanup
    }, [toggleShowMainMenu])

    return (
        <Stack direction="row" alignItems="center" sx={{ mx: "1.4rem" }}>
            <NiceButton sx={{ border: "none" }} onClick={() => toggleShowMainMenu()} disableAutoColor>
                <Stack direction="row" alignItems="center" spacing=".7rem">
                    <SvgMainMenu fill="#ffffff" size="1.5rem" />

                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        MAIN MENU
                    </Typography>

                    <KeyboardKey label="M" />
                </Stack>
            </NiceButton>

            <SvgArrow size=".8rem" sx={{ transform: "rotate(90deg)" }} />

            <NiceButton sx={{ border: "none" }} route={{ to: "/lobbies" }} disableAutoColor>
                <Stack direction="row" alignItems="center" spacing=".7rem">
                    <SvgLobbies fill="#ffffff" size="1.3rem" />

                    <Typography variant="subtitle1" sx={{ fontFamily: fonts.nostromoBold }}>
                        LOBBIES
                    </Typography>
                </Stack>
            </NiceButton>
        </Stack>
    )
}
