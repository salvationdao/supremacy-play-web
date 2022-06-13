import { Stack, Typography } from "@mui/material"
import { useAuth } from "../../../../containers"
import { fonts, colors } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"

export const SellerInfo = ({ isGridView, owner }: { isGridView: boolean; owner: MarketUser }) => {
    const { userID } = useAuth()

    const { id, username, gid } = owner
    const isSelfItem = userID === id

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                SELLER
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
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
