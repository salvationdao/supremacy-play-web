import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { colors, fonts } from "../../../../theme/theme"
import { ConfirmModal } from "../../../Common/Deprecated/ConfirmModal"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

export const FactionCommanderJoinButton = ({ onJoinFactionCommander }: { onJoinFactionCommander: () => void }) => {
    const [confirmModal, setConfirmModal] = useState(false)

    return (
        <>
            <Stack direction="row" alignItems="center" sx={{ p: ".8rem 1.2rem" }}>
                <TypographyTruncated>Faction commander vacant</TypographyTruncated>

                <Box flex={1} />

                <NiceButton buttonColor={colors.green} sx={{ p: ".3rem 1rem" }} onClick={() => setConfirmModal(true)}>
                    <Typography fontFamily={fonts.nostromoBold} variant="subtitle2">
                        Become faction commander
                    </Typography>
                </NiceButton>
            </Stack>

            {confirmModal && (
                <ConfirmModal
                    title="BECOME FACTION COMMANDER"
                    onConfirm={() => {
                        onJoinFactionCommander()
                        setConfirmModal(false)
                    }}
                    onClose={() => setConfirmModal(false)}
                >
                    <Typography variant="h6">
                        Becoming the Faction Commander will allow you to speak in the voice chat along side the mech operators.
                        <br />
                        The active mech operators will have the choice to: vote to kick you as Faction Commander, which will result in a 24hr ban from becoming
                        Faction Commander again.
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}
