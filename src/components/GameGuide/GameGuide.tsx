import { Button, Typography, useMediaQuery } from "@mui/material"
import { SvgQuestionMark } from "../../assets"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { GameGuideModal } from "./GameGuideModal"

const GameGuide = () => {
    const [closed, toggleClosed] = useToggle(true)
    const below1440 = useMediaQuery("(max-width:1440px)")

    return (
        <>
            <Button
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "1.2rem",
                    overflow: "hidden",
                    color: colors.neonBlue,
                    minWidth: 0,
                }}
                onClick={() => toggleClosed()}
            >
                <SvgQuestionMark size="1.5rem" fill={colors.neonBlue} />
                {below1440 ? null : (
                    <Typography sx={{ ml: ".6rem", lineHeight: 1, color: colors.neonBlue }}>How To Play</Typography>
                )}
            </Button>
            <GameGuideModal closed={closed} toggleClosed={toggleClosed} />
        </>
    )
}

export default GameGuide
