import { Box, FormControlLabel, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgBin, SvgCrown, SvgDamageCross, SvgSkull, SvgWrapperProps } from "../../../../../assets"
import { useAuth, useGlobalNotifications } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { getMechStatusDeets, getRarityDeets } from "../../../../../helpers"
import { useGameServerCommands, useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { BattleMechStats, MechDetails, MechStatus } from "../../../../../types"
import { BorderThickness, CaretPosition, CaretSize, NiceBoxThing } from "../../../../Common/Nice/NiceBoxThing"
import { NiceSwitch } from "../../../../Common/Nice/NiceSwitch"
import { MechBarStats } from "../../Common/MechBarStats"
import { MechRepairBlocks } from "../../Common/MechRepairBlocks"
import { PlayerAssetMechEquipRequest } from "../MechLoadout/MechLoadout"
import { MechName } from "../MechName"

export interface MechPickerProps {
    mechDetails: MechDetails
    mechStatus?: MechStatus
    onSelect: (mechID: MechDetails) => void
    onUpdate: (newMechDetails: MechDetails) => void
}

export const MechPicker = ({ mechDetails, mechStatus, onUpdate }: MechPickerProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { send } = useGameServerCommands("/public/commander")
    const { send: sendUser } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const statusDeets = useMemo(() => getMechStatusDeets(mechStatus), [mechStatus])
    const [inheritWeaponSkins, setInheritWeaponSkins] = useState(mechDetails.inherit_all_weapon_skins)

    const [mechBattleStats, setMechBattleStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [statsError, setStatsError] = useState<string>()
    useEffect(() => {
        ;(async () => {
            if (!mechDetails.id) return

            try {
                setStatsLoading(true)
                const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                    mech_id: mechDetails.id,
                })

                if (resp) setMechBattleStats(resp)
                setStatsError(undefined)
            } catch (e) {
                if (typeof e === "string") {
                    setStatsError(e)
                } else if (e instanceof Error) {
                    setStatsError(e.message)
                }
            } finally {
                setStatsLoading(false)
            }
        })()
    }, [send, mechDetails.id])

    // Submit payload to server
    const updateInheritSkin = useCallback(
        async (value: boolean) => {
            try {
                const newMechDetails = await sendUser<MechDetails, PlayerAssetMechEquipRequest>(GameServerKeys.EquipMech, {
                    inherit_all_weapon_skins: value,
                    equip_utility: [],
                    equip_weapons: [],
                    mech_id: mechDetails.id,
                })

                newSnackbarMessage(`Successfully saved loadout.`, "success")
                onUpdate(newMechDetails)
            } catch (e) {
                console.error(e)
            }
        },
        [mechDetails.id, newSnackbarMessage, onUpdate, sendUser],
    )

    const handleInheritWeaponSkin = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setInheritWeaponSkins(event.target.checked)
            updateInheritSkin(event.target.checked)
        },
        [updateInheritSkin],
    )

    const renderBattleStats = useCallback(() => {
        if (statsError) {
            return (
                <Typography
                    sx={{
                        color: colors.red,
                    }}
                >
                    {statsError}
                </Typography>
            )
        }
        if (statsLoading) {
            return <Typography>Loading Battle Stats...</Typography>
        }

        const renderStat = (label: string, Icon: React.VoidFunctionComponent<SvgWrapperProps>, stat?: number) => {
            return (
                <Stack
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <Stack direction="row" alignItems="center">
                        <Icon mr="1rem" fill="white" size="2.6rem" />
                        <Typography>{stat || 0}</Typography>
                    </Stack>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontSize: "1.2rem",
                        }}
                    >
                        {label}
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
                    gap: "1rem",
                }}
            >
                {renderStat("KILLS", SvgDamageCross, mechBattleStats?.total_kills)}
                {renderStat("DEATHS", SvgSkull, mechBattleStats?.total_deaths)}
                {renderStat("WINS", SvgCrown, mechBattleStats?.total_wins)}
                {renderStat("LOSSES", SvgBin, mechBattleStats?.total_losses)}
            </Box>
        )
    }, [mechBattleStats, statsError, statsLoading])

    const rarity = getRarityDeets(mechDetails.chassis_skin?.tier || mechDetails.tier)
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url
    return (
        <NiceBoxThing
            border={{
                color: theme.factionTheme.primary,
                thickness: BorderThickness.Thicc,
            }}
            background={{
                color: [theme.factionTheme.background],
            }}
            sx={{
                flexBasis: 310,
                alignSelf: "start",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Mech Profile */}
            <Stack
                direction="row"
                spacing="1rem"
                sx={{
                    width: "100%",
                    px: "2rem",
                    py: "1rem",
                    background: `linear-gradient(to right, ${colors.black2}, ${theme.factionTheme.background})`,
                }}
            >
                <NiceBoxThing
                    border={{
                        color: rarity ? rarity.color : colors.darkGrey,
                    }}
                    caret={{
                        position: CaretPosition.BottomRight,
                        size: CaretSize.Small,
                    }}
                    sx={{
                        width: 60,
                        height: 60,
                    }}
                >
                    <Box
                        component="img"
                        src={avatarUrl}
                        alt="Mech avatar"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </NiceBoxThing>
                <Stack flex={1}>
                    <MechName
                        onRename={(newName) => onUpdate({ ...mechDetails, name: newName })}
                        mech={mechDetails}
                        allowEdit={userID === mechDetails.owner_id}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontFamily: fonts.shareTech,
                                fontSize: "1.6rem",
                            }}
                        >
                            {mechDetails.label}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: fonts.shareTech,
                                fontSize: "1.6rem",
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            {/* Mech Status */}
            <Stack
                direction="row"
                spacing="1rem"
                sx={{
                    px: "2rem",
                    py: ".5rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: `${statusDeets.color}44`,
                }}
            >
                <Typography>
                    Status:{" "}
                    <Box
                        component="span"
                        sx={{
                            color: statusDeets.color,
                        }}
                    >
                        {statusDeets.label}
                    </Box>
                </Typography>
                <Box height="fit-content">
                    <MechRepairBlocks mechID={mechDetails.id} defaultBlocks={mechDetails.repair_blocks} size={12} />
                </Box>
            </Stack>

            {/* Weapon Skin Inheritance*/}
            <Box
                sx={{
                    px: "2rem",
                    py: "1rem",
                    borderBottom: `1px solid ${theme.factionTheme.primary}44`,
                }}
            >
                <FormControlLabel
                    control={<NiceSwitch onChange={handleInheritWeaponSkin} checked={inheritWeaponSkins} />}
                    label={
                        <Typography
                            sx={{
                                mr: "auto",
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "1.6rem",
                            }}
                        >
                            WEAPON SKIN INHERITANCE
                        </Typography>
                    }
                    labelPlacement="start"
                    sx={{
                        display: "flex",
                        ml: 0,
                        mr: 0,
                    }}
                />
            </Box>

            <Stack
                spacing="2rem"
                sx={{
                    p: "2rem",
                }}
            >
                {/* Mech Battle Stats */}
                {renderBattleStats()}

                {/* Mech Stats */}
                <MechBarStats
                    mech={mechDetails}
                    mechDetails={mechDetails}
                    color={theme.factionTheme.primary}
                    fontSize="1.2rem"
                    width="100%"
                    spacing="1.2rem"
                    barHeight=".9rem"
                />
            </Stack>
        </NiceBoxThing>
    )
}
