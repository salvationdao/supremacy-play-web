import { Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { SvgExternalLink } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechTitle = ({ mech, mechDetails, isSelected }: { mech: MechBasic; mechDetails?: MechDetails; isSelected: boolean }) => {
    const { userID, user } = useAuth()
    const theme = useTheme()
    const { label, name } = mech
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
                background: isSelected
                    ? `linear-gradient(${theme.factionTheme.primary}FF 26%, ${theme.factionTheme.primary}BB)`
                    : theme.factionTheme.background,
                border: isSelected ? `${theme.factionTheme.primary} .3rem solid` : `${theme.factionTheme.primary}90 .2rem solid`,
                zIndex: 9,
            }}
        >
            <Typography
                sx={{
                    color: isSelected ? theme.factionTheme.secondary : "#FFFFFF",
                    fontFamily: fonts.nostromoBlack,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {name || label}
            </Typography>

            {userID && hash && (
                <span>
                    <Link to={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`} target="_blank" style={{ display: "inline", marginLeft: ".7rem" }}>
                        <SvgExternalLink
                            size="1.2rem"
                            sx={{ display: "inline", opacity: 0.7, ":hover": { opacity: 1 } }}
                            fill={isSelected ? theme.factionTheme.secondary : "#FFFFFF"}
                        />
                    </Link>
                </span>
            )}
        </Stack>
    )
}
