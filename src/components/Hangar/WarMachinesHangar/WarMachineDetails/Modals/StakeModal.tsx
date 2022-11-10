import { useCallback, useMemo, useState } from "react"
import { MechModal } from "../../Common/MechModal"
import { MechDetails } from "../../../../../types"
import { useGameServerCommandsFaction, useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { Stack, Typography } from "@mui/material"
import { FancyButton } from "../../../../Common/Deprecated/FancyButton"
import { colors, fonts } from "../../../../../theme/theme"

export const StakeModal = ({
    selectedMechDetails,
    rentalMechModalOpen,
    setRentalMechModalOpen,
}: {
    selectedMechDetails: MechDetails
    rentalMechModalOpen: boolean
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { id } = selectedMechDetails
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechIsStaked, setMechIsStaked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useGameServerSubscription<boolean>(
        {
            URI: `/public/mech/${id}/is_staked`,
            key: GameServerKeys.SubMechIsStaked,
        },
        setMechIsStaked,
    )

    const onClose = useCallback(() => {
        setRentalMechModalOpen(false)
    }, [setRentalMechModalOpen])

    const stakeMech = useCallback(async () => {
        try {
            setIsLoading(true)
            await send(GameServerKeys.StakeMechs, {
                mech_ids: [id],
            })
            onClose()
        } catch (e) {
            if (typeof e === "string") {
                setError(e)
            } else if (e instanceof Error) {
                setError(e.message)
            } else {
                setError("Failed to update avatar, try again or contact support.")
            }
        } finally {
            setIsLoading(false)
        }
    }, [id, onClose, send])

    const unstakeMech = useCallback(async () => {
        try {
            setIsLoading(true)
            await send(GameServerKeys.UnstakeMechs, {
                mech_ids: [id],
            })
            onClose()
        } catch (e) {
            if (typeof e === "string") {
                setError(e)
            } else if (e instanceof Error) {
                setError(e.message)
            } else {
                setError("Failed to update avatar, try again or contact support.")
            }
        } finally {
            setIsLoading(false)
        }
    }, [id, onClose, send])

    const content = useMemo(() => {
        let question = "Are you sure you want to stake your mech?"
        let agreedText = "STAKE"
        let agreedFunc = stakeMech

        if (mechIsStaked) {
            question = "Are you sure you want to unstake your mech?"
            agreedText = "UNSTAKE"
            agreedFunc = unstakeMech
        }

        return (
            <Stack spacing={1.5}>
                <Typography variant="body1" fontFamily={fonts.nostromoBold}>
                    {question}
                </Typography>
                <Stack direction="row" spacing={4} alignItems="center" justifyContent="space-between">
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.red,
                            border: { borderColor: colors.red, borderThickness: "2px" },
                            sx: { flex: 1 },
                        }}
                        sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                        onClick={onClose}
                        loading={isLoading}
                    >
                        <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                            CANCEL
                        </Typography>
                    </FancyButton>
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { borderColor: colors.green, borderThickness: "2px" },
                            sx: { flex: 1 },
                        }}
                        sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                        loading={isLoading}
                        onClick={agreedFunc}
                    >
                        <Stack direction="row" justifyContent="center">
                            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                                {agreedText}
                            </Typography>
                        </Stack>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [mechIsStaked, stakeMech, unstakeMech, onClose, isLoading])

    return (
        <MechModal open={rentalMechModalOpen} mechDetails={selectedMechDetails} onClose={onClose}>
            {content}
            {error && <Typography color={colors.red}>{error}</Typography>}
        </MechModal>
    )
}
