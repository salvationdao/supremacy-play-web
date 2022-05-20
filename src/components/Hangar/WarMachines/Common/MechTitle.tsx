import { Stack, Link, Typography } from "@mui/material"
import { useRef } from "react"
import { SvgExternalLink } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechTitle = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const { userID, user } = useAuth()
    const theme = useTheme()
    const { label, name, tier } = mech
    const hash = mech.hash || mechDetails?.hash

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                position: "absolute",
                top: 0,
                left: "1rem",
                transform: "translateY(-40%)",
                px: "1rem",
                py: ".2rem",
                maxWidth: "70%",
                overflow: "visible",
                backgroundColor: theme.factionTheme.background,
                border: `${theme.factionTheme.primary}90 .2rem solid`,
                zIndex: 9,
            }}
        >
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label || name}
            </Typography>

            {userID && hash && (
                <span>
                    <Link href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`} target="_blank" sx={{ display: "inline", ml: ".7rem" }}>
                        <SvgExternalLink size="1.2rem" sx={{ display: "inline", opacity: 0.2, ":hover": { opacity: 0.8 } }} />
                    </Link>
                </span>
            )}
        </Stack>
    )
}
