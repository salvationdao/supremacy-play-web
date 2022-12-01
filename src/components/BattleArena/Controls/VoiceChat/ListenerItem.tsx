import { SvgUserDiamond } from "../../../../assets"
import { Faction, User } from "../../../../types"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

export const ListenerItem = ({ player }: { player: User; faction: Faction }) => {
    return (
        <TypographyTruncated sx={{ p: ".8rem 1.2rem" }}>
            <SvgUserDiamond inline size="1.9rem" /> {player.username}#{player.gid}
        </TypographyTruncated>
    )
}
