import { Stack, Typography } from "@mui/material"
import { useAuth } from "../../../../containers"
import { fonts, colors } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"

export const UserInfo = ({ isGridView, marketUser, title }: { isGridView?: boolean; marketUser: MarketUser; title?: string }) => {
    const { userID } = useAuth()

    const { id, username, gid } = marketUser
    const isSelfItem = userID === id

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.grey }}>
                {title || "USER"}
            </Typography>
            <Typography
                sx={{
                    fontWeight: "fontWeightBold",
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {username}
                <span style={{ marginLeft: ".2rem", opacity: 0.7, fontFamily: "inherit" }}>{`#${gid}`}</span>
                <span style={{ color: colors.neonBlue, fontFamily: "inherit" }}>{isSelfItem ? " (YOU)" : ""}</span>
            </Typography>
        </Stack>
    )
}
