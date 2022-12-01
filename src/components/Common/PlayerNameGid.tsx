import { Box, TypographyProps } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../containers"
import { User } from "../../types"
import { TypographyTruncated } from "./TypographyTruncated"

interface PlayerNameGidProps extends TypographyProps {
    player: User
}

export const PlayerNameGid = ({ player, ...props }: PlayerNameGidProps) => {
    const { getFaction } = useSupremacy()

    const faction = useMemo(() => getFaction(player.faction_id), [player.faction_id, getFaction])

    return (
        <TypographyTruncated {...props}>
            <Box
                sx={{
                    display: "inline-block",
                    width: "2.8rem",
                    height: "2.8rem",
                    verticalAlign: "middle",
                    background: `url(${faction.logo_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }}
            />{" "}
            {player.username}#{player.gid}
        </TypographyTruncated>
    )
}
