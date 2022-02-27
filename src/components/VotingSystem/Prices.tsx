import { Box, Fade, Stack, Typography } from "@mui/material"
import { TooltipHelper } from ".."
import { SvgPriceDownArrow, SvgPriceUpArrow, SvgSupToken } from "../../assets"
import { useGame } from "../../containers"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

export const Prices = () => {
    const { factionVotePrice: price, prevFactionVotePrice: prevPrice } = useGame()

    return (
        <TooltipHelper
            placement="right-start"
            text="The cost to vote for a battle ability in your Syndicate is dynamic. When the demand is high within your Syndicate in a 10 second period compared to the average 100 second time period (all Syndicates), SUPS vote price increases, if demand is low, then the price of voting decreases."
        >
            <Stack spacing={2.5} direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                        BATTLE ABILITY VOTING COST:
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
        </TooltipHelper>
    )
}
