import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing } from "../../.."
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechMiniStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()

    return (
        <ClipThing clipSize="10px" opacity={0.08} backgroundColor="#FFFFFF" sx={{ height: "100%", flexShrink: 0 }}>
            <Box
                sx={{
                    flex: 1,
                    maxHeight: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".3rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                <Stack alignItems="center" justifyContent="center" spacing=".4rem" sx={{ height: "100%", px: "1rem", py: ".8rem" }}>
                    <SingleStat Icon={<SvgPowerCore size="1.5rem" />} current={3} total={5} />
                    <SingleStat Icon={<SvgOutroAnimation size="1.5rem" />} current={3} total={5} />
                    <SingleStat Icon={<SvgIntroAnimation size="1.5rem" />} current={3} total={5} />
                    <SingleStat Icon={<SvgWeapons size="1.5rem" />} current={3} total={5} />
                    <SingleStat Icon={<SvgUtilities size="1.5rem" />} current={3} total={5} />
                    <SingleStat Icon={<SvgSkin size="1.5rem" />} current={3} total={5} />
                </Stack>
            </Box>
        </ClipThing>
    )
}

const SingleStat = ({ Icon, current, total }: { Icon: ReactNode; current: number; total: number }) => {
    return (
        <Stack alignItems="center" spacing=".7rem" direction="row">
            {Icon}

            <Typography variant="caption" sx={{ fontSize: "1.1rem", fontFamily: fonts.nostromoBold }}>
                {current}/{total}
            </Typography>
        </Stack>
    )
}
