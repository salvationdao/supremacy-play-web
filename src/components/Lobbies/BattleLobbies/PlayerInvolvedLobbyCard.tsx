import { BattleLobbiesMech, BattleLobby } from "../../../types/battle_queue"
import { useTheme } from "../../../containers/theme"
import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth, useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { CropMaxLengthText } from "../../../theme/styles"
import { TooltipHelper } from "../../Common/TooltipHelper"
import { SvgGlobal, SvgLock, SvgQuestionMark2, SvgSupToken } from "../../../assets"
import { supFormatter } from "../../../helpers"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { BattleLobbySingleModal } from "./BattleLobbySingleModal"

interface PlayerInvolvedLobbyCardProps {
    battleLobby: BattleLobby
}

export const PlayerInvolvedLobbyCard = ({ battleLobby }: PlayerInvolvedLobbyCardProps) => {
    const { factionID } = useAuth()
    const { factionsAll } = useSupremacy()
    const { factionTheme } = useTheme()
    const { name, battle_lobbies_mechs } = battleLobby

    const [showLobby, setShowLobby] = useState(false)

    const otherFactionIDs = useMemo(() => Object.keys(factionsAll).filter((fid) => fid !== factionID), [factionsAll, factionID])

    const lobbyAccessibilityIcon = useMemo(() => {
        const isPrivate = battleLobby.is_private
        const tooltipText = isPrivate ? "PRIVATE" : "PUBLIC"

        return (
            <TooltipHelper placement="left-end" text={tooltipText}>
                <Stack direction="row" alignItems="center" justifyContent="center">
                    {isPrivate ? <SvgLock size="1.5rem" fill={colors.gold} /> : <SvgGlobal size="1.5rem" fill={colors.green} />}
                </Stack>
            </TooltipHelper>
        )
    }, [battleLobby.is_private])

    const entryFeeText = useMemo(() => {
        const hasFee = battleLobby.entry_fee !== "0"

        const textColor = hasFee ? colors.gold : colors.green
        const text = hasFee ? supFormatter(battleLobby.entry_fee) : "NONE"

        return (
            <Stack direction="row" alignItems="center" spacing="1rem">
                <Typography variant="body2" fontFamily={fonts.nostromoHeavy} color={textColor}>
                    Entry Fee:
                </Typography>
                <Stack direction="row" alignItems="center" spacing=".4rem">
                    {hasFee && <SvgSupToken size="1.5rem" fill={colors.gold} />}
                    <Typography variant="body2" fontFamily={fonts.nostromoHeavy} sx={{ opacity: hasFee ? 1 : 0.6 }}>
                        {text}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [battleLobby.entry_fee])

    const lobbyStatus = useMemo(() => {
        let textColor = colors.green
        let text = "PENDING"

        if (battleLobby.assigned_to_battle_id) {
            textColor = colors.orange
            text = "IN BATTLE"
        } else if (battleLobby.ready_at) {
            textColor = colors.gold
            text = "READY"
        }

        return (
            <Typography variant="body2" color={textColor} fontFamily={fonts.nostromoHeavy}>
                {text}
            </Typography>
        )
    }, [battleLobby])

    return (
        <>
            <Stack
                spacing={0.5}
                sx={{
                    backgroundColor: factionTheme.background,
                    border: `${factionTheme.primary}99 2px solid`,
                    width: "100%",
                    borderRadius: 0.8,
                    p: ".8rem",

                    cursor: "pointer",
                }}
                onClick={() => setShowLobby(true)}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing=".8rem">
                        {lobbyAccessibilityIcon}
                        <Typography fontFamily={fonts.nostromoBlack} sx={{ pt: ".3rem" }}>
                            {name}
                        </Typography>
                    </Stack>

                    {lobbyStatus}
                </Stack>

                {entryFeeText}

                <BattleLobbyMechList factionID={factionID} battleLobbiesMechs={battle_lobbies_mechs} />
                {otherFactionIDs.map((fid) => (
                    <BattleLobbyMechList key={fid} factionID={fid} battleLobbiesMechs={battle_lobbies_mechs} />
                ))}
            </Stack>
            {showLobby && <BattleLobbySingleModal showingLobby={battleLobby} setOpen={setShowLobby} />}
        </>
    )
}

interface BattleLobbyMechListProps {
    factionID: string
    battleLobbiesMechs: BattleLobbiesMech[]
}
const BattleLobbyMechList = ({ factionID, battleLobbiesMechs }: BattleLobbyMechListProps) => {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const [mechBlocks, setMechBlocks] = useState<BattleLobbiesMech[]>([])
    const [emptyBlocks, setEmptyBlocks] = useState<string[]>([])

    useEffect(() => {
        const list = [...battleLobbiesMechs].filter((blm) => blm.faction_id === factionID)
        const emptyList: string[] = []
        while (list.length + emptyList.length < 3) emptyList.push("")

        setMechBlocks(list)
        setEmptyBlocks(emptyList)
    }, [factionID, battleLobbiesMechs])

    const faction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    const MechBox = useCallback(
        (key: string, blm?: BattleLobbiesMech) => {
            const isOwned = blm?.owner?.id === userID

            return (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    key={key}
                    sx={{
                        border: `${isOwned ? colors.gold : faction.primary_color} 1px solid`,
                        height: "4rem",
                        width: "4rem",

                        position: "relative",
                    }}
                >
                    {blm ? (
                        <>
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "50%",
                                    bottom: 0,
                                    width: "100%",
                                    transform: "translate(-50%, 0)",
                                    backgroundColor: `${faction.background_color}dd`,
                                }}
                            />
                            <Box
                                component="img"
                                src={blm.avatar_url}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                }}
                            />
                        </>
                    ) : (
                        <SvgQuestionMark2
                            fill={`${colors.offWhite}20`}
                            sx={{
                                animation: `${scaleUpKeyframes} .5s ease-out`,
                            }}
                        />
                    )}
                </Stack>
            )
        },
        [faction],
    )

    return (
        <Stack>
            <Typography variant="subtitle2" fontFamily={fonts.nostromoBlack} color={faction.primary_color} sx={{ ...CropMaxLengthText }}>
                {faction.label}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                {mechBlocks.map((mb) => MechBox(mb.mech_id, mb))}
                {emptyBlocks.map((v, i) => MechBox(`${i}`))}
            </Stack>
        </Stack>
    )
}
