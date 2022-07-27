import { Typography } from "@mui/material"
import { useAuth } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"
import { General } from "./General"

export const UserInfo = ({ isGridView, marketUser, title }: { isGridView?: boolean; marketUser: MarketUser; title?: string }) => {
    const { userID } = useAuth()

    const { id, username, gid } = marketUser
    const isSelfItem = userID === id

    return (
        <General isGridView={isGridView} title={title || "USER"}>
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
        </General>
    )
}
