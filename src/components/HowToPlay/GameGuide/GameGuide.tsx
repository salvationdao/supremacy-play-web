import { Typography } from "@mui/material"
import { PrismicProvider } from "@prismicio/react"
import { prismicClient } from "../../../helpers/prismicClient"
import { colors, fonts } from "../../../theme/theme"
import { GameGuideModal } from "./GameGuideModal"

const GameGuide = ({ onClose }: { onClose: () => void }) => {
    return (
        <PrismicProvider
            client={prismicClient}
            richTextComponents={{
                heading1: ({ children }) => (
                    <Typography variant="h1" sx={{ fontFamily: fonts.nostromoBold }}>
                        {children}
                    </Typography>
                ),
                heading2: ({ children }) => (
                    <Typography variant="h2" sx={{ fontFamily: fonts.nostromoBold, fontSize: "2.5rem" }}>
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
                    <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBold, fontSize: "1rem" }}>
                        {children}
                    </Typography>
                ),
                heading5: ({ children }) => (
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBold, fontSize: "1rem" }}>
                        {children}
                    </Typography>
                ),
                paragraph: ({ children }) => <Typography sx={{ fontSize: "1.5rem" }}>{children}</Typography>,
            }}
        >
            <GameGuideModal onClose={onClose} />
        </PrismicProvider>
    )
}

export default GameGuide
