import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgPowerCore } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts } from "../../../../../../theme/theme"
import { AssetItemType, PowerCore } from "../../../../../../types"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"
import { GetPowerCoresRequest } from "../../Modals/Loadout/MechLoadoutPowerCoreModal"
import { DragWithTypesProps } from "../MechLoadoutDraggables"
import { LoadoutDraggable } from "./LoadoutDraggable"

export interface GetPowerCoresDetailedResponse {
    power_cores: PowerCore[]
    total: number
}

export interface PowerCoreDraggablesProps {
    drag: DragWithTypesProps
    powerCoreSize: string
}

export const PowerCoreDraggables = ({ drag, powerCoreSize }: PowerCoreDraggablesProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const powerCoresMemoized = useRef<PowerCore[]>([])
    const [powerCores, setPowerCores] = useState<PowerCore[]>([])
    const [isPowerCoresLoading, setIsPowerCoresLoading] = useState(true)
    const [powerCoresError, setPowerCoresError] = useState<string>()

    const { onDrag, onDragStart, onDragStop } = drag

    const getPowerCores = useCallback(async () => {
        setIsPowerCoresLoading(true)
        try {
            const resp = await send<GetPowerCoresDetailedResponse, GetPowerCoresRequest>(GameServerKeys.GetPowerCoresDetailed, {
                page: 1,
                page_size: 9,
                sort_by: "date",
                sort_dir: "desc",
                include_market_listed: false,
                exclude_ids: [],
                rarities: [],
                sizes: [powerCoreSize],
                equipped_statuses: ["unequipped"],
                search: "",
            })

            if (!resp) return
            setPowerCoresError(undefined)
            setPowerCores(resp.power_cores)
            powerCoresMemoized.current = resp.power_cores
        } catch (e) {
            setPowerCoresError(typeof e === "string" ? e : "Failed to get power cores.")
            console.error(e)
        } finally {
            setIsPowerCoresLoading(false)
        }
    }, [powerCoreSize, send])
    useEffect(() => {
        getPowerCores()
    }, [getPowerCores])

    const powerCoresContent = useMemo(() => {
        if (isPowerCoresLoading) {
            return <Typography>Loading power cores...</Typography>
        }
        if (powerCoresError) {
            return <Typography>{powerCoresError}</Typography>
        }
        if (powerCores.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" height="100%">
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: `${theme.factionTheme.primary}aa`,
                            textTransform: "uppercase",
                        }}
                    >
                        No Power Cores
                    </Typography>
                </Stack>
            )
        }

        return powerCores.map((w) => (
            <LoadoutDraggable
                key={w.id}
                drag={{
                    onDrag: (rect) => {
                        onDrag(rect, AssetItemType.PowerCore)
                    },
                    onDragStart: () => {
                        onDragStart(AssetItemType.PowerCore)
                    },
                    onDragStop: (rect) => {
                        onDragStop(rect, AssetItemType.PowerCore, w)
                    },
                }}
                renderDraggable={(ref) => (
                    <Box ref={ref}>
                        <MechLoadoutItem
                            imageUrl={w.image_url || w.avatar_url}
                            label={w.label}
                            Icon={SvgPowerCore}
                            rarity={w.tier ? getRarityDeets(w.tier) : undefined}
                            shape="square"
                        />
                    </Box>
                )}
            />
        ))
    }, [isPowerCoresLoading, onDrag, onDragStart, onDragStop, theme.factionTheme.primary, powerCores, powerCoresError])

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            }}
        >
            {powerCoresContent}
        </Box>
    )
}
