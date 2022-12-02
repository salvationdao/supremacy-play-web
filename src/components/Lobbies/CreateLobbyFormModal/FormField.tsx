import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"

export const FormField = ({ label, children }: { label: string; children: ReactNode }) => {
    return (
        <Box>
            <Typography sx={{ mb: ".4rem", fontWeight: "bold" }}>{label}</Typography>
            {children}
        </Box>
    )
}
