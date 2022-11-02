import { Box, Grow, Modal } from "@mui/material"
import { useState } from "react"
import { SupremacyWorldPNG } from "../../../assets"


export const SupremacyWorldModal = () => {
    const [showModal, setShowModal] = useState(true)

    return (
        <Modal
            open={showModal}
            onClose={() => {
                setShowModal(false)
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(0, 0, 0, .8)",
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    height: "100rem",
                    width: "100rem",
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <Grow in>
                    <a href="https://www.supremacyworld.com/founders" target="_blank" rel="noopener noreferrer">
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `url(${SupremacyWorldPNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />
                    </a>
                </Grow>
            </Box>
        </Modal>
    )
}
