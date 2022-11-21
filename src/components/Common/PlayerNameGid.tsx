import { useMemo } from "react"
import { useSupremacy } from "../../containers"
import { User } from "../../types"
import { StyledImageText, StyledImageTextProps } from "../BattleArena/Notifications/Common/StyledImageText"

export const PlayerNameGid = ({ player, styledImageTextProps }: { player: User; styledImageTextProps?: StyledImageTextProps }) => {
    const { getFaction } = useSupremacy()
    const { username, gid, faction_id } = player

    const faction = useMemo(() => getFaction(faction_id), [faction_id, getFaction])
    const primaryColor = faction.palette.primary

    return (
        <StyledImageText
            text={
                <>
                    {`${username}`}
                    <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${gid}`}</span>
                </>
            }
            color={primaryColor}
            imageUrl={faction.logo_url}
            {...styledImageTextProps}
        />
    )
}
