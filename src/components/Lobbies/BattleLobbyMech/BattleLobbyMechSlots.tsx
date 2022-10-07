import { Box, Button, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { SvgCheckMark, SvgLogout, SvgPlus, SvgQuestionMark2, SvgWeapons } from "../../../assets"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech } from "../../../types/battle_queue"
import { ConfirmModal } from "../../Common/ConfirmModal"
import { FancyButton } from "../../Common/FancyButton"
import { WeaponSlot } from "../Common/weaponSlot"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { CropMaxLengthText } from "../../../theme/styles"

export interface BattleLobbyFaction {
    faction: Faction
    mechSlots: (BattleLobbiesMech | null)[] // null represents empty slot
}

interface MyFactionLobbySlotsProps {
    factionLobby: BattleLobbyFaction
    isLocked: boolean
    onSlotClick: () => void
}

export const MyFactionLobbySlots = ({ factionLobby, isLocked, onSlotClick }: MyFactionLobbySlotsProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()

    // Leaving lobby
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [leftMechID, setLeftMechID] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const leaveLobby = useCallback(
        async (mechID: string) => {
            setIsLoading(true)
            try {
                await send(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: [mechID],
                })
                setLeftMechID("")
                newSnackbarMessage("Successfully removed mech from lobby.", "success")
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to leave battle lobby.", "error")
            } finally {
                setIsLoading(false)
            }
        },
        [newSnackbarMessage, send],
    )

    return (
        <>
            {factionLobby.mechSlots.map((ms, index) => {
                if (!ms) {
                    return (
                        <Button
                            key={index}
                            onClick={() => onSlotClick()}
                            disabled={isLocked}
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                padding: "1rem",
                                height: "26.5rem",
                                borderRadius: 0,
                                backgroundColor: `${colors.offWhite}20`,
                            }}
                        >
                            <SvgPlus
                                size="40px"
                                fill={`${colors.offWhite}30`}
                                sx={{
                                    padding: "2.5rem",
                                    backgroundColor: `${colors.offWhite}10`,
                                    borderRadius: "50%",
                                }}
                            />
                            <Typography
                                display="block"
                                sx={{
                                    mt: "1rem",
                                    color: `${colors.offWhite}30`,
                                }}
                            >
                                DEPLOY MECH
                            </Typography>
                        </Button>
                    )
                }

                const rarity = getRarityDeets(ms.tier)

                return (
                    <Stack
                        key={index}
                        sx={{
                            flex: 1,
                            padding: "1rem",
                            alignItems: "start",
                            textAlign: "initial",
                            height: "26.5rem",
                            borderRadius: 0,
                            backgroundColor: `${colors.offWhite}20`,
                            border: ms?.owner?.id === userID ? `${colors.gold}BB 2px solid` : undefined,
                        }}
                    >
                        <Stack direction="row" spacing="1rem" mb=".5rem">
                            <Box
                                sx={{
                                    position: "relative",
                                    height: "70px",
                                    width: "70px",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={ms.avatar_url}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: "50%",
                                        bottom: 0,
                                        width: "100%",
                                        transform: "translate(-50%, 0)",
                                        backgroundColor: `${factionLobby.faction.background_color}dd`,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "1.2rem",
                                            fontFamily: fonts.nostromoMedium,
                                            textTransform: "uppercase",
                                            textAlign: "center",
                                            color: rarity.color,
                                        }}
                                    >
                                        {rarity.label}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Stack direction="row" spacing=".5rem" mb=".5rem">
                                    {ms.weapon_slots.map((ws) => (
                                        <WeaponSlot key={ws.slot_number} weaponSlot={ws} tooltipPlacement={"top-end"} size="3rem" />
                                    ))}
                                </Stack>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        ...CropMaxLengthText,
                                        textTransform: "uppercase",
                                        fontWeight: "fontWeightBold",
                                        color: `#ffffff`,
                                        letterSpacing: 1.1,
                                    }}
                                >
                                    {ms.name || ms.label}
                                </Typography>
                                {ms.owner && (
                                    <Typography
                                        sx={{
                                            ...CropMaxLengthText,
                                            color: `#ffffffaa`,
                                        }}
                                    >
                                        {`@${ms.owner.username}#${ms.owner.gid}`}{" "}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>

                        <MechBarStats
                            mech={ms}
                            color={theme.factionTheme.primary}
                            fontSize="1.3rem"
                            width="100%"
                            spacing=".45rem"
                            barHeight=".8rem"
                            compact
                            outerSx={{ flex: 1, width: "100%" }}
                        />

                        <Stack direction="row" alignSelf="stretch" mt="auto" spacing=".5rem">
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "6px",
                                    clipSlantSize: "0px",
                                    corners: { bottomLeft: index === 0 },
                                    backgroundColor: theme.factionTheme.primary,
                                    sx: {
                                        flex: 1,
                                    },
                                }}
                                to={`/mech/${ms.mech_id}`}
                            >
                                <Typography
                                    fontSize="1.3rem"
                                    fontWeight="fontWeightBold"
                                    sx={{
                                        color: factionLobby.faction.secondary_color,
                                    }}
                                >
                                    View Mech
                                </Typography>
                            </FancyButton>
                            {ms.owner?.id === userID && (
                                <FancyButton
                                    onClick={() => setLeftMechID(ms?.mech_id || "")}
                                    disabled={isLocked || userID !== ms.owner?.id}
                                    loading={isLoading}
                                    clipThingsProps={{
                                        clipSize: "6px",
                                        clipSlantSize: "0px",
                                        corners: { topLeft: false, topRight: false, bottomLeft: false, bottomRight: false },
                                        backgroundColor: colors.red,
                                    }}
                                >
                                    <SvgLogout />
                                </FancyButton>
                            )}
                        </Stack>
                        {ms.owner?.id === userID && leftMechID === ms.mech_id && (
                            <ConfirmModal title="Confirm Removal" onConfirm={() => leaveLobby(ms.mech_id)} onClose={() => setLeftMechID("")}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        "& span": {
                                            fontWeight: "fontWeightBold",
                                        },
                                    }}
                                >
                                    Withdraw <span>{ms.name || ms.label}</span> from this lobby?
                                </Typography>
                            </ConfirmModal>
                        )}
                    </Stack>
                )
            })}
        </>
    )
}

interface OtherFactionLobbySlotsProps {
    factionLobbies: BattleLobbyFaction[]
}

export const OtherFactionLobbySlots = ({ factionLobbies }: OtherFactionLobbySlotsProps) => {
    return (
        <>
            {factionLobbies.map((fl, index) => (
                <Box key={index}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                            mb: ".3rem",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontFamily: fonts.nostromoBlack,
                                color: fl.faction.primary_color,
                                ...CropMaxLengthText,
                            }}
                        >
                            {fl.faction.label}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing=".5rem">
                        {fl.mechSlots.map((ms, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    height: "30px",
                                    width: "30px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${fl.faction.primary_color}`,
                                    backgroundColor: fl.faction.background_color,
                                }}
                            >
                                {ms ? (
                                    <SvgCheckMark
                                        fill={`${colors.green}`}
                                        sx={{
                                            animation: `${scaleUpKeyframes} .5s ease-out`,
                                        }}
                                    />
                                ) : (
                                    <SvgQuestionMark2
                                        fill={`${colors.offWhite}20`}
                                        sx={{
                                            animation: `${scaleUpKeyframes} .5s ease-out`,
                                        }}
                                    />
                                )}
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            ))}
        </>
    )
}
