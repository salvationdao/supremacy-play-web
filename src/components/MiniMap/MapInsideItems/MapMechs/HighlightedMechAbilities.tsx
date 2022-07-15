import { Box, Fade, Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { ContributeFactionUniqueAbilityRequest } from "../../.."
import { useAuth, useGame, useMiniMap } from "../../../../containers"
import { useGameServerCommandsFaction, useGameServerSubscriptionAbilityFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { GameAbility, GameAbilityProgress } from "../../../../types"
import { ProgressBar } from "../../../Common/ProgressBar"

export const HighlightedMechAbilities = () => {
    const { factionID } = useAuth()
    const { bribeStage, warMachines } = useGame()
    const { highlightedMechParticipantID } = useMiniMap()

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase != "HOLD", [bribeStage])

    const isFactionMech = useMemo(() => {
        const mech = warMachines?.find((m) => m.participantID === highlightedMechParticipantID)
        return mech?.factionID === factionID
    }, [factionID, highlightedMechParticipantID, warMachines])

    if (!highlightedMechParticipantID || !isFactionMech || !isVoting) {
        return null
    }

    return <HighlightedMechAbilitiesInner key={highlightedMechParticipantID} participantID={highlightedMechParticipantID} />
}

const HighlightedMechAbilitiesInner = ({ participantID }: { participantID: number }) => {
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
            <Stack
                spacing=".8rem"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                sx={{ position: "absolute", top: "4rem", left: "1.4rem" }}
            >
                {gameAbilities.map((ga) => {
                    return <AbilityItem key={ga.identity} participantID={participantID} ability={ga} />
                })}
            </Stack>
        </Fade>
    )
}

const AbilityItem = ({ participantID, ability }: { participantID: number; ability: GameAbility }) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [offeringID, setOfferingID] = useState<string>(ability.ability_offering_id)
    const [currentSups, setCurrentSups] = useState(new BigNumber(ability.current_sups).dividedBy("1000000000000000000"))
    const [supsCost, setSupsCost] = useState(new BigNumber(ability.sups_cost).dividedBy("1000000000000000000"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(new BigNumber(ability.sups_cost).dividedBy("1000000000000000000"))

    const { identity, colour, image_url } = ability

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
            }}
        >
            {/* Image */}
            <Box
                sx={{
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

            <Box sx={{ width: "5rem" }}>
                <ProgressBar
                    percent={initialTargetCost.isZero() ? 0 : +currentSups.dividedBy(initialTargetCost) * 100}
                    linePercent={initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100}
                    color={colour}
                    backgroundColor="#00000040"
                    thickness="1.2rem"
                    orientation="horizontal"
                />
            </Box>
        </Stack>
    )
}
