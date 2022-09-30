import { Box, Button, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgCheckMark, SvgLogout, SvgPlus, SvgQuestionMark2, SvgWeapons, SvgWrench } from "../../../assets"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech } from "../../../types/battle_queue"
import { FancyButton } from "../../Common/FancyButton"

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
    const [isLoading, setIsLoading] = useState(false)

    const leaveLobby = useCallback(
        async (mechID: string) => {
            setIsLoading(true)
            try {
                await send(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: [mechID],
                })
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
                                borderRadius: 0,
                                backgroundColor: `${colors.offWhite}10`,
                            }}
                        >
                            <SvgPlus size="60px" fill={`${colors.offWhite}20`} />
                            <Typography
                                display="block"
                                sx={{
                                    color: `${colors.offWhite}20`,
                                }}
                            >
                                DEPLOY MECH
                            </Typography>
                        </Button>
                    )
                }

                return (
                    <Stack
                        key={index}
                        sx={{
                            flex: 1,
                            padding: "1rem",
                            alignItems: "start",
                            textAlign: "initial",
                            borderRadius: 0,
                            backgroundColor: `${colors.offWhite}10`,
                        }}
                    >
                        <Stack direction="row" spacing="1rem" mb=".5rem">
                            <Box
                                component="img"
                                src={ms.avatar_url}
                                sx={{
                                    maxHeight: "70px",
                                }}
                            />
                            <Box>
                                <Stack direction="row" spacing=".5rem" mb=".5rem">
                                    {ms.weapon_slots.map((ws, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "25px",
                                                height: "25px",
                                                border: `1px solid ${theme.factionTheme.primary}66`,
                                                backgroundColor: `${theme.factionTheme.background}`,
                                            }}
                                        >
                                            {ws.weapon ? (
                                                <Box
                                                    key={ws.weapon.avatar_url}
                                                    component="img"
                                                    src={ws.weapon.avatar_url}
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        animation: `${scaleUpKeyframes} .5s ease-out`,
                                                    }}
                                                />
                                            ) : (
                                                <SvgWeapons />
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: theme.factionTheme.primary,
                                        fontWeight: "fontWeightBold",
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 1, // change to max number of lines
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {ms.name || ms.label}
                                </Typography>
                                {ms.owner && (
                                    <Typography
                                        sx={{
                                            color: theme.factionTheme.primary,
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            overflowWrap: "anywhere",
                                            textOverflow: "ellipsis",
                                            WebkitLineClamp: 1, // change to max number of lines
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        <i>{`@${ms.owner.username}#${ms.owner.gid}`}</i>
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
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
                            >
                                View Mech
                            </FancyButton>
                            {ms.owner?.id === userID && (
                                <>
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "6px",
                                            clipSlantSize: "0px",
                                            corners: { topLeft: false, topRight: false, bottomLeft: false, bottomRight: false },
                                            backgroundColor: colors.grey,
                                        }}
                                        innerSx={{
                                            display: "flex",
                                        }}
                                    >
                                        <SvgWrench />
                                        <Box component="span" ml=".5rem">
                                            Modify
                                        </Box>
                                    </FancyButton>
                                    <FancyButton
                                        onClick={() => leaveLobby(ms.mech_id)}
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
                                </>
                            )}
                        </Stack>
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
            {factionLobbies.map((fl) => (
                <Box key={fl.faction.id}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                            mb: ".3rem",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "-webkit-box",
                                fontSize: "1.2rem",
                                fontFamily: fonts.nostromoBlack,
                                color: fl.faction.primary_color,
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
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
