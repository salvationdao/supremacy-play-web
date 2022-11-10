import { Typography } from "@mui/material"
import { useAuth } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"
import { General } from "./General"
import { TruncateTextLines } from "../../../../theme/styles"

export const UserInfo = ({ isGridView, marketUser, title }: { isGridView?: boolean; marketUser: MarketUser; title?: string }) => {
    const { userID } = useAuth()

    const { id, username, gid } = marketUser
    const isSelfItem = userID === id

    return (
        <General isGridView={isGridView} title={title || "USER"}>
            <Typography
                sx={{
                    fontWeight: "bold",
                    ...TruncateTextLines(2),
                }}
            >
                {username}
                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                <span style={{ color: colors.neonBlue }}>{isSelfItem ? " (YOU)" : ""}</span>
            </Typography>
        </General>
    )
}
