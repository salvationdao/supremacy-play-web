import { Box } from "@mui/material"
import { Bar } from ".."
import { BarProvider } from "../../containers"

export const GameBar: React.FC = () => {
    return (
        <Box sx={{ zIndex: 99999 }}>
            <BarProvider>
                <Bar />
            </BarProvider>
        </Box>
    )
}
