import { ConfirmModal } from "../../Common/ConfirmModal"
import { Box, Stack, Typography } from "@mui/material"
import { InputField } from "../Common/InputField"
import { fonts } from "../../../theme/theme"
import React, { useState } from "react"
import { useTheme } from "../../../containers/theme"

interface BattleLobbyAccessCodeModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setAccessCode: React.Dispatch<React.SetStateAction<string>>
}

export const BattleLobbyAccessCodeModal = ({ setOpen, setAccessCode }: BattleLobbyAccessCodeModalProps) => {
    const { factionTheme } = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    return (
        <ConfirmModal title={`ACCESS CODE`} omitButtons onClose={() => setOpen(false)} isLoading={isLoading} error={error} omitCancel>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    height: "4rem",
                    width: "100%",
                }}
            >
                <InputField
                    placeholder="ACCESS CODE"
                    border={`${factionTheme.primary} 2px solid`}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    endAdornmentLabel={
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                backgroundColor: `${factionTheme.primary}`,
                                px: "1rem",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setOpen(false)
                                setAccessCode(code)
                            }}
                        >
                            <Typography variant="body2" fontFamily={fonts.nostromoBlack} sx={{ color: factionTheme.secondary }}>
                                submit
                            </Typography>
                        </Box>
                    }
                />
            </Stack>
        </ConfirmModal>
    )
}
