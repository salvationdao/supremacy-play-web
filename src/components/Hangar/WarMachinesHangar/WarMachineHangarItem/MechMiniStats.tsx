import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing, TooltipHelper } from "../../.."
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechMiniStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const { weapon_hardpoints, utility_slots, chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mech
    const weapons = mechDetails?.weapons?.length
    const utilities = mechDetails?.utility?.length

    return (
        <ClipThing
            clipSize="10px"
            opacity={0.08}
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            backgroundColor="#FFFFFF"
            sx={{ height: "100%", flexShrink: 0 }}
        >
            <Box
                sx={{
                    flex: 1,
                    maxHeight: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",

                    "::-webkit-scrollbar": {
                        width: ".4rem",
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
                    <SingleStat Icon={<SvgSkin size="1.5rem" />} current={chassis_skin_id ? 1 : 0} total={1} tooltipText="Chassis skin." />
                    <SingleStat Icon={<SvgIntroAnimation size="1.5rem" />} current={intro_animation_id ? 1 : 0} total={1} tooltipText="Intro animation." />
                    <SingleStat Icon={<SvgOutroAnimation size="1.5rem" />} current={outro_animation_id ? 1 : 0} total={1} tooltipText="Outro animation." />
                    <SingleStat Icon={<SvgPowerCore size="1.5rem" />} current={power_core_id ? 1 : 0} total={1} tooltipText="Power core." />
                    <SingleStat Icon={<SvgWeapons size="1.5rem" />} current={weapons} total={weapon_hardpoints} tooltipText="Weapons equipped." />
                    <SingleStat Icon={<SvgUtilities size="1.5rem" />} current={utilities} total={utility_slots} tooltipText="Utilities equipped." />
                </Stack>
            </Box>
        </ClipThing>
    )
}

const SingleStat = ({ Icon, current, total, tooltipText }: { Icon: ReactNode; current?: number; total: number; tooltipText: string }) => {
    return (
        <TooltipHelper placement="right" text={tooltipText}>
            <Stack alignItems="center" spacing=".7rem" direction="row">
                {Icon}

                <Typography
                    variant="caption"
                    sx={{
                        letterSpacing: "2px",
                        "&, *": { fontSize: "1.1rem", fontFamily: fonts.nostromoBold },
                        span: { color: current === 0 ? colors.red : "unset" },
                    }}
                >
                    <span>{current === undefined ? "?" : current}</span>/{total}
                </Typography>
            </Stack>
        </TooltipHelper>
    )
}
