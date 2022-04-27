import { Box, Button, Divider, Modal, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useCallback, useEffect, useState } from "react"
import { colors } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"

export const TutorialModal = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [visited, setVisited] = useState<boolean>(true)
    const { setIsOpen } = useTour()

    useEffect(() => {
        setVisited(!!localStorage.getItem("visited"))
        setOpen(true)
    }, [])

    const closeWithReminder = useCallback(() => {
        setOpen(false)
        setVisited(true)
        localStorage.setItem("visited", "1")
    }, [])

    return (
        <Modal
            onClose={() => {
                closeWithReminder()
            }}
            open={open && visited === false}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "50rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: "#FFFFFF",
                        borderThickness: ".15rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            px: "3.2rem",
                            py: "2.4rem",
                            backgroundColor: `${colors.darkNavyBlue}`,
                            width: "100%",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontFamily: "Nostromo Regular Black", textTransform: "uppercase", textAlign: "center", mb: ".5rem" }}>
                            Welcome New Citizen
                        </Typography>
                        <Divider sx={{ width: "100%", mb: "1.5rem" }} />
                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", textTransform: "uppercase", width: "100%" }}>
                            You are now in the Battle Arena where Syndicates will fight for glory. The Arena can be overwhelming if you don&apos;t know your way
                            around, the tutorial can help you get your bearings.
                        </Typography>
                        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end", mt: "1rem" }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    closeWithReminder()
                                    setIsOpen(true)
                                }}
                                sx={{
                                    pt: ".7rem",
                                    pb: ".4rem",
                                    width: "12rem",
                                    backgroundColor: colors.neonBlue,
                                    color: colors.darkNavy,
                                    borderRadius: 0.7,
                                    fontFamily: "Nostromo Regular Black",
                                    fontSize: "1.3rem",
                                    ":hover": {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                Tutorial
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => closeWithReminder()}
                                sx={{
                                    alignSelf: "flex-end",
                                    ml: 3,
                                    pt: ".7rem",
                                    pb: ".4rem",
                                    width: "9rem",
                                    color: colors.neonBlue,
                                    backgroundColor: colors.darkNavy,
                                    borderRadius: 0.7,
                                    fontFamily: "Nostromo Regular Bold",
                                    border: `${colors.neonBlue} 1px solid`,
                                    ":hover": {
                                        opacity: 0.8,
                                        border: `${colors.neonBlue} 1px solid`,
                                    },
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
