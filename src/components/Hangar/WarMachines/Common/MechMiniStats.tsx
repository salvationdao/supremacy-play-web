import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing } from "../../.."
import { SvgPowerCore } from "../../../../assets"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechMiniStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    return (
        <ClipThing clipSize="10px" opacity={0.08} backgroundColor="#FFFFFF" sx={{ height: "100%", flexShrink: 0 }}>
            <Stack alignItems="center" justifyContent="center" spacing=".4rem" sx={{ height: "100%", px: "1rem", py: ".8rem" }}>
                <SingleStat Icon={<SvgPowerCore />} current={3} total={5} />
                <SingleStat Icon={<SvgPowerCore />} current={3} total={5} />
                <SingleStat Icon={<SvgPowerCore />} current={3} total={5} />
                <SingleStat Icon={<SvgPowerCore />} current={3} total={5} />
                <SingleStat Icon={<SvgPowerCore />} current={3} total={5} />
            </Stack>
        </ClipThing>
    )
}

const SingleStat = ({ Icon, current, total }: { Icon: ReactNode; current: number; total: number }) => {
    return (
        <Stack alignItems="center" spacing=".6rem" direction="row">
            {Icon}

            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold }}>
                {current}/{total}
            </Typography>
        </Stack>
    )
}
