import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgSkin } from "../../../../../../assets"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts, theme } from "../../../../../../theme/theme"
import { AssetItemType, MechSkin, PowerCore, Utility, Weapon } from "../../../../../../types"
import { GetSubmodelsRequest, GetSubmodelsResponse } from "../../../../SubmodelHangar/SubmodelsHangar"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"

export type OnClickEventWithType = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    type: AssetItemType,
    item: Weapon | PowerCore | Utility | MechSkin,
) => void

export interface MechSkinDraggablesProps {
    excludeMechSkinIDs: string[]
    includeMechSkinIDs: string[]
    mechModelID: string
    onClick: OnClickEventWithType
}

export const MechSkinDraggables = ({ excludeMechSkinIDs, includeMechSkinIDs, mechModelID, onClick }: MechSkinDraggablesProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const mechSkinsMemoized = useRef<MechSkin[]>([])
    const [mechSkins, setMechSkins] = useState<MechSkin[]>([])
    const [isMechSkinsLoading, setIsMechSkinsLoading] = useState(true)
    const [mechSkinsError, setMechSkinsError] = useState<string>()

    const getMechSkins = useCallback(async () => {
        setIsMechSkinsLoading(true)
        try {
            const resp = await send<GetSubmodelsResponse, GetSubmodelsRequest>(GameServerKeys.GetMechSubmodelsDetailed, {
                page: 1,
                page_size: 9,
                sort_by: "date",
                sort_dir: "desc",
                include_market_listed: false,
                display_genesis_and_limited: true,
                exclude_market_locked: true,
                display_xsyn: false,
                display_unique: true,
                skin_compatibility: [],
                exclude_ids: excludeMechSkinIDs,
                include_ids: includeMechSkinIDs,
                model_id: mechModelID,
                rarities: [],
                equipped_statuses: [],
                search: "",
            })

            if (!resp) return
            setMechSkinsError(undefined)
            setMechSkins(resp.submodels || [])
            mechSkinsMemoized.current = resp.submodels
        } catch (e) {
            setMechSkinsError(typeof e === "string" ? e : "Failed to get mech skins.")
            console.error(e)
        } finally {
            setIsMechSkinsLoading(false)
        }
    }, [excludeMechSkinIDs, includeMechSkinIDs, mechModelID, send])
    useEffect(() => {
        getMechSkins()
    }, [getMechSkins])

    const mechSkinsContent = useMemo(() => {
        if (isMechSkinsLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>Loading mech skins...</Typography>
                </Stack>
            )
        }
        if (mechSkinsError) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>{mechSkinsError}</Typography>
                </Stack>
            )
        }
        if (mechSkins.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: `${theme.factionTheme.primary}aa`,
                            textTransform: "uppercase",
                        }}
                    >
                        No Submodels
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "1rem",
                }}
            >
                {mechSkins.map((ms, index) => (
                    <MechLoadoutItem
                        key={index}
                        imageUrl={ms.swatch_images?.image_url || ms.swatch_images?.avatar_url || ms.image_url || ms.avatar_url}
                        label={ms.label}
                        Icon={SvgSkin}
                        rarity={ms.tier ? getRarityDeets(ms.tier) : undefined}
                        onClick={(e) => onClick(e, AssetItemType.MechSkin, ms)}
                        shape="square"
                        size="full-width"
                    />
                ))}
            </Box>
        )
    }, [isMechSkinsLoading, mechSkins, mechSkinsError, onClick])

    return (
        <Stack spacing="2rem" minHeight={400}>
            {mechSkinsContent}
        </Stack>
    )
}
