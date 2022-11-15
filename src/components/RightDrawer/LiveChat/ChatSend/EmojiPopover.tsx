import { Box, Popover } from "@mui/material"
import { BaseEmoji, Picker } from "emoji-mart"
import "emoji-mart/css/emoji-mart.css"
import { useEffect } from "react"
import { ClipThing } from "../../.."
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"

interface EnlistDetailsProps {
    primaryColor: string
    setMessage: (a: string, b: boolean) => void
    popoverRef: React.MutableRefObject<null>
    isEmojiOpen: boolean
    toggleIsEmojiOpen: (_state: boolean) => void
}

export const EmojiPopover = ({ primaryColor, setMessage, popoverRef, isEmojiOpen, toggleIsEmojiOpen }: EnlistDetailsProps) => {
    const [localOpen, toggleLocalOpen] = useToggle(isEmojiOpen)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                toggleIsEmojiOpen(false)
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, toggleIsEmojiOpen])

    return (
        <Popover
            open={localOpen}
            transitionDuration={180}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                backgroundColor={colors.darkNavy}
                sx={{ mb: "1.6rem" }}
            >
                <Box>
                    <Box
                        sx={{
                            boxShadow: 20,
                            borderRadius: 0.9,
                            backgroundColor: `${primaryColor}10`,
                            ".emoji-mart": {
                                backgroundColor: "transparent",
                            },
                            ".emoji-mart-category-label span": {
                                backgroundColor: "#1F1F1F !important",
                                borderRadius: 1,
                            },
                            ".emoji-mart-scroll": {
                                mr: ".32rem",
                                my: ".32rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",
                            },
                            ".emoji-mart-search": {
                                mb: ".8rem",
                            },
                            ".emoji-mart, #emoji-mart-search-2": {
                                border: "none",
                            },
                            "#emoji-mart-search-8": {
                                fontFamily: fonts.rajdhaniMedium,
                            },
                            "#emoji-mart-search-30": {
                                pb: "3.6px",
                            },
                        }}
                    >
                        <Picker
                            set="facebook"
                            theme="dark"
                            emojiSize={20}
                            emoji="robot_face"
                            perLine={8}
                            showPreview={false}
                            showSkinTones={false}
                            title=""
                            onSelect={(emoji: BaseEmoji) => {
                                setMessage(emoji.native, true)
                            }}
                        />
                    </Box>
                </Box>
            </ClipThing>
        </Popover>
    )
}
