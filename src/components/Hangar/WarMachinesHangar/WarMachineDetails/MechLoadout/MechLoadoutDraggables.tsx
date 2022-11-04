import { Stack, Typography } from "@mui/material"
import { useImperativeHandle } from "react"
import { SvgPowerCore, SvgSkin, SvgWeapons } from "../../../../../assets"
import { fonts } from "../../../../../theme/theme"
import { NiceAccordion } from "../../../../Common/Nice/NiceAccordion"
import { CustomDragEventWithType, DragStartEventWithType, DragStopEventWithType } from "./Draggables/LoadoutDraggable"
import { MechSkinDraggables, MechSkinDraggablesProps } from "./Draggables/MechSkinDraggables"
import { PowerCoreDraggables, PowerCoreDraggablesProps } from "./Draggables/PowerCoreDraggables"
import { WeaponDraggables, WeaponDraggablesProps } from "./Draggables/WeaponDraggables"

export type DraggablesHandle = {
    handleMechLoadoutUpdated: () => void
}

export interface MechLoadoutDraggablesProps extends WeaponDraggablesProps, MechSkinDraggablesProps, PowerCoreDraggablesProps {
    draggablesRef: React.ForwardedRef<DraggablesHandle>
}

export interface DragWithTypesProps {
    onDrag: CustomDragEventWithType
    onDragStart: DragStartEventWithType
    onDragStop: DragStopEventWithType
}

export const MechLoadoutDraggables = ({
    draggablesRef,
    drag,
    excludeWeaponIDs,
    excludeMechSkinIDs,
    includeMechSkinIDs,
    mechModelID,
    powerCoreSize,
}: MechLoadoutDraggablesProps) => {
    useImperativeHandle(draggablesRef, () => ({
        handleMechLoadoutUpdated: () => {
            console.log("updated")
        },
    }))

    return (
        <Stack
            spacing="1rem"
            sx={{
                flexBasis: 450,
            }}
        >
            <NiceAccordion
                expandID="weapons"
                items={[
                    {
                        id: "weapons",
                        header: (
                            <Stack direction="row" spacing=".5rem" alignItems="center">
                                <SvgWeapons size="2.6rem" />
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    Weapons
                                </Typography>
                            </Stack>
                        ),
                        content: <WeaponDraggables drag={drag} excludeWeaponIDs={excludeWeaponIDs} />,
                    },
                    {
                        id: "mech skins",
                        header: (
                            <Stack direction="row" spacing=".5rem" alignItems="center">
                                <SvgSkin />
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    Skins
                                </Typography>
                            </Stack>
                        ),
                        content: (
                            <MechSkinDraggables
                                drag={drag}
                                excludeMechSkinIDs={excludeMechSkinIDs}
                                includeMechSkinIDs={includeMechSkinIDs}
                                mechModelID={mechModelID}
                            />
                        ),
                    },
                    {
                        id: "power cores",
                        header: (
                            <Stack direction="row" spacing=".5rem" alignItems="center">
                                <SvgPowerCore size="2.6rem" />
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    Power Cores
                                </Typography>
                            </Stack>
                        ),
                        content: <PowerCoreDraggables drag={drag} powerCoreSize={powerCoreSize} />,
                    },
                ]}
            />
        </Stack>
    )
}
