import { Box, Popover } from "@mui/material"
import "emoji-mart/css/emoji-mart.css"
import { BaseEmoji, Picker } from "emoji-mart"
import { Dispatch, SetStateAction } from "react"
import { colors } from "../../../theme"

interface EnlistDetailsProps {
    primaryColor: string
    setMessage: Dispatch<SetStateAction<string>>
    popoverRef: React.MutableRefObject<null>
    isEmojiOpen: boolean
    toggleIsEmojiOpen: (_state: boolean) => void
}

export const EmojiPopover = ({
    primaryColor,
    setMessage,
    popoverRef,
    isEmojiOpen,
    toggleIsEmojiOpen,
}: EnlistDetailsProps) => {
    return (
        <Popover
            open={isEmojiOpen}
            transitionDuration={180}
            anchorEl={popoverRef.current}
            onClose={() => toggleIsEmojiOpen(false)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            PaperProps={{ sx: { backgroundColor: "transparent", boxShadow: 0, overflow: "visible" } }}
            sx={{ zIndex: 999999, overflow: "visible" }}
        >
            <Box
                sx={{
                    mb: 2,
                    backgroundColor: colors.darkNavy,
                }}
            >
                <Box
                    sx={{
                        boxShadow: 20,
                        borderRadius: 0.9,
                        border: `${primaryColor}50 2px solid`,
                        backgroundColor: `${primaryColor}10`,
                        ".emoji-mart": {
                            backgroundColor: "transparent",
                        },
                        ".emoji-mart-category-label span": {
                            backgroundColor: "#1F1F1F !important",
                            borderRadius: 1,
                        },
                        ".emoji-mart-scroll": {
                            mr: 0.4,
                            my: 0.4,
                            overflowY: "auto",
                            overflowX: "hidden",
                            direction: "ltr",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: 5,
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: primaryColor,
                                borderRadius: 3,
                            },
                        },
                        ".emoji-mart-search": {
                            mb: 1,
                        },
                        ".emoji-mart, #emoji-mart-search-2": {
                            border: "none",
                        },
                        "#emoji-mart-search-8": {
                            fontFamily: "Share Tech",
                        },
                        "#emoji-mart-search-30": {
                            pb: "3.6px",
                        },
                        ".emoji-mart-bar": {
                            borderBottom: `${primaryColor}50 2px solid`,
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
                            setMessage((prev) => prev + emoji.native)
                        }}
                    />
                </Box>
            </Box>
        </Popover>
    )
}
