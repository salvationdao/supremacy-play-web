import { Box, Stack, Typography } from "@mui/material"
import { SvgLoadoutPowerCore, SvgLoadoutSkin, SvgLoadoutWeapon } from "../../../../../assets"
import { fonts } from "../../../../../theme/theme"
import { AssetItemType, MechSkin, PowerCore, Utility, Weapon } from "../../../../../types"
import { NiceAccordion } from "../../../../Common/Nice/NiceAccordion"
import { CustomDragEventWithType, DragStartEventWithType, DragStopEventWithType } from "./Draggables/LoadoutDraggable"
import { MechSkinDraggables, MechSkinDraggablesProps } from "./Draggables/MechSkinDraggables"
import { PowerCoreDraggables, PowerCoreDraggablesProps } from "./Draggables/PowerCoreDraggables"
import { WeaponDraggables, WeaponDraggablesProps } from "./Draggables/WeaponDraggables"

export interface MechLoadoutDraggablesProps extends WeaponDraggablesProps, MechSkinDraggablesProps, PowerCoreDraggablesProps {}

export type OnClickEventWithType = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    type: AssetItemType,
    item: Weapon | PowerCore | Utility | MechSkin,
) => void

export interface DragWithTypesProps {
    onDrag: CustomDragEventWithType
    onDragStart: DragStartEventWithType
    onDragStop: DragStopEventWithType
}

export const MechLoadoutDraggables = ({
    drag,
    onClick,
    excludeWeaponIDs,
    excludeMechSkinIDs,
    includeMechSkinIDs,
    compareToPowerCore,
    excludePowerCoreIDs,
    mechModelID,
    powerCoreSize,
    compareToWeapon,
}: MechLoadoutDraggablesProps) => {
    return (
        <Box
            sx={{
                flexBasis: 400,
            }}
        >
            <NiceAccordion
                expandID="weapons"
                items={[
                    {
                        id: "weapons",
                        header: (
                            <Stack direction="row" spacing="1rem" alignItems="center">
                                <SvgLoadoutWeapon width="5rem" height="auto" />
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    Weapons
                                </Typography>
                            </Stack>
                        ),
                        content: <WeaponDraggables drag={drag} excludeWeaponIDs={excludeWeaponIDs} compareToWeapon={compareToWeapon} />,
                    },
                    {
                        id: "mech skins",
                        header: (
                            <Stack direction="row" spacing="1rem" alignItems="center">
                                <SvgLoadoutSkin ml=".5rem" height="3rem" width="auto" />
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
                                onClick={onClick}
                                excludeMechSkinIDs={excludeMechSkinIDs}
                                includeMechSkinIDs={includeMechSkinIDs}
                                mechModelID={mechModelID}
                            />
                        ),
                    },
                    {
                        id: "power cores",
                        header: (
                            <Stack direction="row" spacing="1rem" alignItems="center">
                                <SvgLoadoutPowerCore width="4rem" height="auto" />
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    Power Cores
                                </Typography>
                            </Stack>
                        ),
                        content: (
                            <PowerCoreDraggables
                                compareToPowerCore={compareToPowerCore}
                                excludePowerCoreIDs={excludePowerCoreIDs}
                                powerCoreSize={powerCoreSize}
                                onClick={onClick}
                            />
                        ),
                    },
                ]}
            />
        </Box>
    )
}
