import { Box, Button, Modal, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Alert } from "@mui/lab"
import { colors } from "../../theme/theme"

export const EarlyAccessWarning = () => {
    const [clickedYes, setClickedYes] = useState<string | null>(localStorage.getItem("agreed_to_early_access"))

    useEffect(() => {
        if (clickedYes === "agreed") {
            localStorage.setItem("agreed_to_early_access", "agreed")
        }
    }, [clickedYes])

    return (
        <Box>
            <Modal open={clickedYes !== "agreed"}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: 420,
                        backgroundColor: `${colors.darkNavyBlue}`,
                        color: "white",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography sx={{ mr: 2, fontFamily: "Nostromo Regular Bold", pt: 2, pb: 2 }} variant="caption">
                        <Alert severity="warning">This game is early access!</Alert>
                    </Typography>
                    <Typography sx={{ mr: 2, fontFamily: "Nostromo Regular Bold", pt: 2, pb: 2 }} variant="caption">
                        <p>Thank you for participating in the Supremacy Battle Stream Early Access</p>
                    </Typography>
                    <Alert severity="warning">The game is early access, but the $SUPS you use are real!</Alert>
                    <Typography sx={{ mr: 2, fontFamily: "Nostromo Regular Bold", pt: 2, pb: 2 }} variant="caption">
                        By choosing to try out this game and continue from here, you expressly acknowledge and accept
                        that you assume all risks associated with the gameplay and/or participating in the Battle
                        Events. This includes contributing to battle abilities, queueing your mech for battle, and other
                        $SUPS related tasks.
                    </Typography>
                    <Button onClick={() => setClickedYes("agreed")}>I agree! Let me in!</Button>
                </Box>
            </Modal>
        </Box>
    )
}
