import { Button, Typography } from "@mui/material"
import { PrismicProvider } from "@prismicio/react"
import { prismicClient } from "../../../helpers/prismicClient"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { GameGuideModal } from "./GameGuideModal"

const GameGuide = () => {
    const [closed, toggleClosed] = useToggle(true)

    return (
        <>
            <Button
                tabIndex={0}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    color: colors.neonBlue,
                    minWidth: 0,
                    width: "100%",
                    cursor: "pointer",
                }}
                onClick={() => toggleClosed()}
            >
                <Typography sx={{ lineHeight: 1, color: colors.offWhite, textTransform: "uppercase" }}>Game Guide</Typography>
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
