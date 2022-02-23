import { Box, Fade, Stack, Typography } from "@mui/material"
import { SvgApplause, SvgPriceDownArrow, SvgPriceUpArrow, SvgSupToken } from "../../assets"
import { useGame } from "../../containers"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

export const Prices = () => {
    const { factionVotePrice: price, prevFactionVotePrice: prevPrice } = useGame()

    return (
        <Stack key={price.toFixed()} spacing={0.5}>
            <Stack direction="row" alignItems="center" alignSelf="stretch">
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                        1 x Applause&nbsp;
                    </Typography>
                    <SvgApplause size="14px" />
                    <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                        &nbsp;:&nbsp;
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ ml: "auto" }}>
                    <SvgSupToken size="15.5px" fill={colors.yellow} />
                    <Typography
                        key={price.toFixed()}
                        variant="body1"
                        sx={{ lineHeight: 1, animation: `${zoomEffect(1.05)} 300ms ease-out` }}
                    >
                        {price.toFixed()}
                    </Typography>

                    <Fade in={true}>
                        <Box>
                            {price.isGreaterThan(prevPrice) ? (
                                <SvgPriceUpArrow size="16px" fill={"#FF4A4A"} />
                            ) : (
                                <SvgPriceDownArrow size="16px" fill={"#6fff4b"} />
                            )}
                        </Box>
                    </Fade>
                </Stack>
            </Stack>
        </Stack>
    )
}
