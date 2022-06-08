import { Stack, Typography } from "@mui/material"
import { fonts, colors } from "../../../../theme/theme"

export const SellerInfo = ({ isGridView, username, gid }: { isGridView: boolean; username: string; gid: number }) => {
    return (
        <Stack spacing={isGridView ? "" : ".6rem"}>
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
            </Typography>
        </Stack>
    )
}
