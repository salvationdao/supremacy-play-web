import { Box, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { ConfirmModal } from "../../Common/Deprecated/ConfirmModal"
import { InputField } from "./BattleLobbyCreate/Common/InputField"

interface BattleLobbyAccessCodeModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setAccessCode: React.Dispatch<React.SetStateAction<string>>
}

export const BattleLobbyAccessCodeModal = ({ setOpen, setAccessCode }: BattleLobbyAccessCodeModalProps) => {
    const { factionTheme } = useTheme()
    const [code, setCode] = useState("")
    return (
        <ConfirmModal title={`ACCESS CODE`} omitButtons onClose={() => setOpen(false)} isLoading={false} omitCancel>
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
                            <Typography variant="body2" fontFamily={fonts.nostromoBlack} sx={{ color: factionTheme.text }}>
                                submit
                            </Typography>
                        </Box>
                    }
                />
            </Stack>
        </ConfirmModal>
    )
}
