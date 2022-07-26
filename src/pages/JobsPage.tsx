import { Box, Button } from "@mui/material"
import { StackTower } from "../components/Jobs/StackTower/StackTower"
import { useToggle } from "../hooks"

export const JobsPage = () => {
    const [showTowerStack, toggleShowTowerStack] = useToggle(false)

    return (
        <>
            <Box sx={{ width: "100%", height: "100%" }}>
                <Button onClick={() => toggleShowTowerStack()}>OPEN GAME</Button>
            </Box>

            {showTowerStack && <StackTower open={showTowerStack} onClose={() => toggleShowTowerStack(false)} />}
        </>
    )
}
