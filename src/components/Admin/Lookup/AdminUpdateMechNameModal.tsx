import { Box, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgClose } from "../../../assets"
import { MAX_BAN_PROPOSAL_REASON_LENGTH } from "../../../constants"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { Faction, MechDetails, User } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"

export interface AdminUpdateMechNameModalProps {
    user: User
    mech: MechDetails
    onClose: () => void
    onSuccess: (newMechName: string) => void
    faction: Faction
}

export const AdminUpdateMechNameModal = ({ user, mech, onClose, onSuccess, faction }: AdminUpdateMechNameModalProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const [mechName, setMechName] = useState(mech.name)
    const [reason, setReason] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState<string>()

    const updateMechName = useCallback(async () => {
        setIsLoading(true)
        try {
            if (mech.name === mechName) throw new Error("New mech name cannot be the same as old mech name.")

            const resp = await send<string, { mech_id: string; owner_id: string; new_mech_name: string; reason: string }>(GameServerKeys.ModRenameMech, {
                mech_id: mech.id,
                owner_id: user.id,
                new_mech_name: mechName,
                reason,
            })

            if (!resp) return
            setLoadError(undefined)
            onSuccess(resp)
        } catch (e) {
            let errMsg = "Failed to update mech name."
            if (typeof e === "string") {
                errMsg = e
            } else if (e instanceof Error) {
                errMsg = e.message
            }
            setLoadError(errMsg)
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [mech.id, mech.name, mechName, onSuccess, reason, send, user.id])

    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "42rem",
                    boxShadow: 24,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: faction.primary_color,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={faction.background_color}
                >
                    <Stack
                        component="form"
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault()
                            updateMechName()
                        }}
                        sx={{
                            px: "2.2rem",
                            py: "2.1rem",
                            ".MuiAutocomplete-popper": {
                                zIndex: siteZIndex.Modal,
                                ".MuiPaper-root": {
                                    background: "none",
                                    backgroundColor: colors.darkerNeonBlue,
                                    zIndex: siteZIndex.Modal,
                                },
                            },
                        }}
                    >
                        <Typography sx={{ mb: "1.2rem", fontFamily: fonts.nostromoBlack }}>Change mech name: {mech.name}</Typography>

                        <Stack spacing="1.5rem">
                            <Stack spacing=".3rem">
                                <Typography sx={{ color: faction.primary_color, fontWeight: "fontWeightBold" }}>New Mech Name:</Typography>
                                <TextField
                                    value={mechName}
                                    onChange={(e) => {
                                        setMechName(e.target.value)
                                    }}
                                    type="text"
                                    hiddenLabel
                                    required
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            fontFamily: fonts.shareTech,
                                            px: "1.1em",
                                            pt: ".9rem",
                                            pb: ".7rem",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${faction.primary_color} !important`,
                                        },
                                        input: {
                                            p: 0,
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                />
                            </Stack>

                            <Stack spacing=".3rem">
                                <Typography sx={{ color: faction.primary_color, fontWeight: "fontWeightBold" }}>Reason:</Typography>
                                <TextField
                                    required
                                    value={reason}
                                    placeholder="Type the reason for renaming the user's username..."
                                    onChange={(e) => {
                                        const m = e.currentTarget.value
                                        if (m.length <= MAX_BAN_PROPOSAL_REASON_LENGTH) setReason(e.currentTarget.value)
                                    }}
                                    type="text"
                                    hiddenLabel
                                    multiline
                                    maxRows={2}
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            fontFamily: fonts.shareTech,
                                            px: "1.1em",
                                            pt: ".9rem",
                                            pb: ".7rem",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${faction.primary_color} !important`,
                                        },
                                        textarea: {
                                            p: 0,
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                />
                            </Stack>
                        </Stack>

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: faction.primary_color,
                                opacity: 1,
                                border: { isFancy: true, borderColor: faction.primary_color, borderThickness: "2px" },
                                sx: { position: "relative", flex: 1, minWidth: 0, mt: "1.8rem" },
                            }}
                            sx={{ px: "1.6rem", py: ".3rem", color: faction.secondary_color }}
                            loading={isLoading}
                            type="submit"
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: faction.secondary_color,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                SUBMIT
                            </Typography>
                        </FancyButton>

                        {loadError && (
                            <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                                {loadError}
                            </Typography>
                        )}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
