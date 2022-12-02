import { Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../../../assets"
import { supFormatter } from "../../../../../../helpers"
import { colors, fonts } from "../../../../../../theme/theme"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"

export const RewardSups = ({ sups, label }: { sups: string; label?: string }) => {
    return (
        <Stack alignItems="center" spacing=".8rem" sx={{ alignSelf: "stretch" }}>
            <NiceBoxThing
                border={{ color: colors.yellow }}
                background={{ colors: [`#00000060`] }}
                sx={{
                    flex: 1,
                    width: "10rem",
                    minHeight: "10rem",
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing=".5rem"
                    sx={{
                        height: "100%",
                        backgroundColor: `${colors.yellow}12`,
                    }}
                >
                    <SvgSupToken size="3rem" fill={colors.yellow} />
                    <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                        {supFormatter(sups, 2)}
                    </Typography>
                </Stack>
            </NiceBoxThing>

            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                {label || "SUPS"}
            </Typography>
        </Stack>
    )
}
