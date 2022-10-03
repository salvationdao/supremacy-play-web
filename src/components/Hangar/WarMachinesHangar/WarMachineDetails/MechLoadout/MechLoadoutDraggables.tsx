import { Box, Stack } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import Draggable from "react-draggable"
import { SvgWeapons } from "../../../../../assets"
import { getRarityDeets } from "../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, theme } from "../../../../../theme/theme"
import { AssetItemType, MechSkin, PowerCore, Utility, Weapon } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { GetWeaponsRequest, GetWeaponsResponse } from "../../../WeaponsHangar/WeaponsHangar"
import { MechLoadoutItemDraggable } from "../../Common/MechLoadoutItem"

type DragStopEvent = (clientRect: DOMRect, type: AssetItemType, item: Weapon | PowerCore | Utility | MechSkin) => void

export interface MechLoadoutDraggablesProps {
    onDragStop: DragStopEvent
}

export const MechLoadoutDraggables = ({ onDragStop }: MechLoadoutDraggablesProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const getWeapons = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<GetWeaponsResponse, GetWeaponsRequest>(GameServerKeys.GetWeapons, {
                page: 1,
                page_size: 10,
                sort_by: "asc",
                sort_dir: "rarity",
                include_market_listed: false,
                display_genesis_and_limited: true,
                exclude_ids: [],
                weapon_types: [],
                rarities: [],
                equipped_statuses: ["unequipped"],
                search: "",
            })

            if (!resp) return
            setLoadError(undefined)
            setWeapons(resp.weapons)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get weapons.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send])

    useEffect(() => {
        getWeapons()
    }, [getWeapons])

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
            }}
        >
            <MechLoadoutItemDraggable
                style={{
                    visibility: "hidden",
                }}
                label="OUTRO ANIMATION"
                primaryColor={colors.outroAnimation}
                isEmpty
            />
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            >
                <></>
            </ClipThing>
            <Stack
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "1rem",
                }}
            >
                {/*  render multiple of these */}
                {weapons.map((w) => (
                    <MechLoadoutDraggable key={w.id} onDragStop={onDragStop} item={w} />
                ))}
            </Stack>
        </Box>
    )
}

interface MechLoadoutDraggableProps {
    item: Weapon
    onDragStop: DragStopEvent
}

const MechLoadoutDraggable = ({ item, onDragStop }: MechLoadoutDraggableProps) => {
    const draggableRef = useRef<HTMLDivElement>(null)

    return (
        <Box
            sx={{
                "&:hover": {
                    transition: "transform .1s ease-out",
                    transform: "scale(1.1)",
                    cursor: "grab",
                },
                "&:active": {
                    transition: "transform .1s ease-in",
                    transform: "scale(1.0)",
                    cursor: "grabbing",
                },
            }}
        >
            <Draggable
                position={{ x: 0, y: 0 }}
                // onStart={this.handleStart}
                // onDrag={this.handleDrag}
                onStop={() => {
                    if (!draggableRef.current) return
                    onDragStop(draggableRef.current.getBoundingClientRect(), AssetItemType.Weapon, item)
                }}
            >
                <MechLoadoutItemDraggable
                    ref={draggableRef}
                    imageUrl={item.image_url || item.avatar_url}
                    videoUrls={[item.card_animation_url]}
                    label={item.label}
                    primaryColor={colors.weapons}
                    Icon={SvgWeapons}
                    rarity={item.weapon_skin ? getRarityDeets(item.weapon_skin.tier) : undefined}
                    hasSkin={!!item.weapon_skin}
                />
            </Draggable>
        </Box>
    )
}
