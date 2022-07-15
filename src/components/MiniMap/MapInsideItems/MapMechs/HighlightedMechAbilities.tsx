import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, ContributeFactionUniqueAbilityRequest } from "../../.."
import { useAuth, useGame, useMiniMap } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionAbilityFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { GameAbility, GameAbilityProgress, WarMachineState } from "../../../../types"
import { ProgressBar } from "../../../Common/ProgressBar"

export const HighlightedMechAbilities = () => {
    const { factionID } = useAuth()
    const { bribeStage, warMachines } = useGame()
    const { highlightedMechParticipantID } = useMiniMap()

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase != "HOLD", [bribeStage])

    const highlightedMech = useMemo(() => {
        return warMachines?.find((m) => m.participantID === highlightedMechParticipantID)
    }, [highlightedMechParticipantID, warMachines])

    if (!highlightedMechParticipantID || !highlightedMech || highlightedMech?.factionID !== factionID || !isVoting) {
        return null
    }

    return <HighlightedMechAbilitiesInner key={highlightedMechParticipantID} mech={highlightedMech} />
}

const HighlightedMechAbilitiesInner = ({ mech }: { mech: WarMachineState }) => {
    const { userID } = useAuth()
    const theme = useTheme()
    const { participantID, ownedByID } = mech

    // Subscribe to war machine ability updates
    const gameAbilities = useGameServerSubscriptionAbilityFaction<GameAbility[] | undefined>({
        URI: `/mech/${participantID}`,
        key: GameServerKeys.SubWarMachineAbilitiesUpdated,
        ready: !!participantID,
    })

    if (!gameAbilities || gameAbilities.length <= 0) {
        return null
    }

    return (
        <Fade in>
            <ClipThing
                clipSize="8px"
                border={{
                    borderColor: userID === ownedByID ? colors.gold : theme.factionTheme.primary,
                    borderThickness: "2px",
                }}
                corners={{ bottomLeft: true }}
                opacity={0.3}
                backgroundColor={theme.factionTheme.background}
                sx={{ position: "absolute", top: "3.5rem", right: ".4rem" }}
            >
                <Stack
                    spacing=".8rem"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    sx={{ p: ".8rem .9rem", width: "12rem" }}
                >
                    {gameAbilities.map((ga) => {
                        return <AbilityItem key={ga.identity} participantID={participantID} ability={ga} />
                    })}
                </Stack>
            </ClipThing>
        </Fade>
    )
}

const AbilityItem = ({ participantID, ability }: { participantID: number; ability: GameAbility }) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [offeringID, setOfferingID] = useState<string>(ability.ability_offering_id)
    const [currentSups, setCurrentSups] = useState(new BigNumber(ability.current_sups).dividedBy("1000000000000000000"))
    const [supsCost, setSupsCost] = useState(new BigNumber(ability.sups_cost).dividedBy("1000000000000000000"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(new BigNumber(ability.sups_cost).dividedBy("1000000000000000000"))

    const { identity, colour, image_url, label } = ability

    // Listen on the progress of the votes
    useGameServerSubscriptionAbilityFaction<GameAbilityProgress | undefined>(
        {
            URI: `/mech/${participantID}`,
            key: GameServerKeys.SubAbilityProgress,
        },
        (payload) => {
            if (!payload || payload.id !== identity) return
            const currentSups = new BigNumber(payload.current_sups).dividedBy("1000000000000000000")
            const supsCost = new BigNumber(payload.sups_cost).dividedBy("1000000000000000000")
            setCurrentSups(currentSups)
            setSupsCost(supsCost)
            setOfferingID(payload.offering_id)

            setInitialTargetCost((prev) => {
                if (payload.should_reset || prev.isZero()) {
                    return supsCost
                }
                return prev
            })
        },
    )

    const onContribute = useCallback(async () => {
        try {
            await send<boolean, ContributeFactionUniqueAbilityRequest>(GameServerKeys.ContributeFactionUniqueAbility, {
                ability_identity: identity,
                ability_offering_id: offeringID,
                percentage: 1,
            })
        } catch (e) {
            console.error(e)
        }
    }, [send, identity, offeringID])

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing=".4rem"
            sx={{
                position: "relative",
                height: "2.6rem",
                width: "100%",
            }}
        >
            {/* Image */}
            <Box
                sx={{
                    flexShrink: 0,
                    width: "2.6rem",
                    height: "100%",
                    cursor: "pointer",
                    background: `url(${image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    border: `${colour} 1.5px solid`,
                    ":hover": { borderWidth: "3px", transform: "scale(1.04)" },
                }}
                onClick={onContribute}
            />

            <Box sx={{ flex: 1 }}>
                <Typography
                    variant="caption"
                    sx={{
                        mb: "1px",
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {label}
                </Typography>
                <ProgressBar
                    percent={initialTargetCost.isZero() ? 0 : +currentSups.dividedBy(initialTargetCost) * 100}
                    linePercent={initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100}
                    color={colour}
                    backgroundColor="#00000040"
                    thickness=".9rem"
                    orientation="horizontal"
                />
            </Box>
        </Stack>
    )
}
