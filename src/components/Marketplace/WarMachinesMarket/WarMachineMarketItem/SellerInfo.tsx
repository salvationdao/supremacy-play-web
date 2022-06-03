import { Stack, Typography } from "@mui/material"
import { fonts, colors } from "../../../../theme/theme"

export const SellerInfo = ({ username, gid }: { username: string; gid: number }) => {
    return (
        <Stack spacing=".6rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>SELLER</Typography>
            <Typography
                variant="body2"
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
