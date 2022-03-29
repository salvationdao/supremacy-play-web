import { Button, Typography, useMediaQuery } from "@mui/material"
import { PrismicProvider } from "@prismicio/react"
import { SvgQuestionMark } from "../../assets"
import { prismicClient } from "../../helpers/prismicClient"
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
            <PrismicProvider
                client={prismicClient}
                richTextComponents={{
                    heading1: ({ children }) => (
                        <Typography variant="h1" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                            {children}
                        </Typography>
                    ),
                    heading2: ({ children }) => (
                        <Typography variant="h2" sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "2.5rem" }}>
                            {children}
                        </Typography>
                    ),
                    heading3: ({ children }) => (
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: "2rem",
                                color: colors.offWhite,
                                fontWeight: "fontWeightBold",
                            }}
                        >
                            {children}
                        </Typography>
                    ),
                    heading4: ({ children }) => (
                        <Typography variant="h4" sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1rem" }}>
                            {children}
                        </Typography>
                    ),
                    heading5: ({ children }) => (
                        <Typography variant="h5" sx={{ fontFamily: "Nostromo Regular Bold", fontSize: "1rem" }}>
                            {children}
                        </Typography>
                    ),
                    paragraph: ({ children }) => <Typography sx={{ fontSize: "1.5rem" }}>{children}</Typography>,
                }}
            >
                {!closed && <GameGuideModal closed={closed} toggleClosed={toggleClosed} />}
            </PrismicProvider>
        </>
    )
}

export default GameGuide
