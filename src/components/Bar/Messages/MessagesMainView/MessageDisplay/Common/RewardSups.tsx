import { Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../../../assets"
import { supFormatter } from "../../../../../../helpers"
import { colors, fonts } from "../../../../../../theme/theme"
import { ClipThing } from "../../../../../Common/ClipThing"

export const RewardSups = ({ sups, label }: { sups: string; label?: string }) => {
    return (
        <Stack alignItems="center" spacing=".8rem" sx={{ alignSelf: "stretch" }}>
            <ClipThing
                clipSize="6px"
                border={{
                    borderColor: colors.yellow,
                    borderThickness: "1.5px",
                }}
                opacity={0.9}
                backgroundColor="#111111"
                sx={{ flex: 1, width: "10rem", minHeight: "10rem" }}
            >
                <Stack alignItems="center" justifyContent="center" spacing=".5rem" sx={{ height: "100%", backgroundColor: `${colors.yellow}12` }}>
                    <SvgSupToken size="3rem" fill={colors.yellow} />
                    <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "fontWeightBold" }}>
                        {supFormatter(sups, 2)}
                    </Typography>
                </Stack>
            </ClipThing>

            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                {label || "SUPS"}
            </Typography>
        </Stack>
    )
}
