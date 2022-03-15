import { Button, Typography, useMediaQuery } from "@mui/material"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { GameGuideModal } from "./GameGuideModal"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

const GameGuide = () => {
    const [closed, toggleClosed] = useToggle()
    const matches = useMediaQuery("(min-width:1440px)")

    return (
        <>
            <GameGuideModal closed={closed} toggleClosed={toggleClosed} />
            <Button
                sx={{
                    color: colors.neonBlue,
                    overflow: "hidden",
                    display: "flex",
                    gap: "1em",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onClick={() => {
                    toggleClosed()
                }}
            >
                <HelpOutlineIcon />
                {matches ? <Typography sx={{ color: colors.neonBlue }}>How To Play</Typography> : ""}
            </Button>
        </>
    )
}

export default GameGuide
