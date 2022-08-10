import { CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useRef, useState } from "react"
import { SvgEdit, SvgSave } from "../../assets"
import { colors, fonts } from "../../theme/theme"

export const AboutMe = ({ hide, aboutMe, updateAboutMe }: { hide: boolean; updateAboutMe: (aboutMe: string) => Promise<void>; aboutMe: string }) => {
    const aboutMeRef = useRef<HTMLInputElement>()
    const [editing, setEditing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [newAboutMe, setNewAboutMe] = useState<string>(aboutMe || "")

    const updateHandler = useCallback(async () => {
        try {
            setSubmitting(true)
            aboutMeRef.current?.blur()
            await updateAboutMe(newAboutMe)
        } finally {
            setSubmitting(false)
            setEditing(false)
        }
    }, [newAboutMe, updateAboutMe])

    return (
        <Stack direction="row" alignItems="stretch">
            <Stack direction="row" alignItems="stretch" width={editing ? "100%" : "unset"}>
                <Stack width={editing ? "100%" : "unset"}>
                    <Stack direction="row">
                        {editing && (
                            <TextField
                                multiline
                                inputRef={aboutMeRef}
                                variant="standard"
                                sx={{
                                    flex: 1,
                                    m: 0,
                                    py: ".2rem",
                                    opacity: editing ? "unset" : 0,
                                    height: editing ? "unset" : 0,
                                    width: editing ? "unset" : 0,
                                    position: "relative",
                                    "& .MuiInput-root": {
                                        p: 0,
                                        fontSize: "1.8rem",
                                        color: "#FFFFFF",
                                        width: "100%",
                                    },
                                    "& .MuiInputBase-input": {
                                        p: 0,
                                        display: "flex",
                                        flexGrow: 1,
                                        fontSize: "2rem",
                                        px: "1.4rem",
                                        py: ".4rem",
                                        wordBreak: "break-word",
                                        border: `#FFFFFF99 1.5px dashed`,
                                        width: "100%",
                                        borderRadius: 0.5,
                                        backgroundColor: "#FFFFFF12",
                                    },
                                }}
                                spellCheck={false}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                value={newAboutMe}
                                placeholder="Enter about me..."
                                onChange={(e) => {
                                    setNewAboutMe(e.target.value)
                                }}
                                onFocus={() => aboutMeRef.current?.setSelectionRange(0, newAboutMe.length)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        updateHandler()
                                    }
                                }}
                            />
                        )}
                        {editing && (
                            <>
                                {!submitting && (
                                    <IconButton size="small" sx={{ ml: ".5rem", "&:hover": { backgroundColor: "transparent" } }} onClick={updateHandler}>
                                        <SvgSave size="1.4rem" />
                                    </IconButton>
                                )}

                                {submitting && <CircularProgress size="1.4rem" sx={{ ml: "1rem", color: "#FFFFFF" }} />}
                            </>
                        )}
                    </Stack>

                    {editing && (
                        <Stack marginTop="1rem">
                            <Typography
                                sx={{
                                    color: newAboutMe && newAboutMe.length > 400 ? colors.red : "white",
                                    fontFamily: fonts.nostromoBlack,
                                    wordBreak: "break-word",
                                    fontSize: "2rem",
                                }}
                            >
                                <span>{newAboutMe ? newAboutMe.length : 0}</span>
                                <span>/400</span>
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                {!editing && (
                    <Stack direction="row">
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                wordBreak: "break-word",
                                fontSize: "2rem",
                            }}
                        >
                            {aboutMe}
                        </Typography>
                    </Stack>
                )}

                {!hide && !editing && (
                    <IconButton
                        size="small"
                        sx={{ ml: ".5rem", opacity: 0.6, ":hover": { opacity: 1, backgroundColor: "transparent" } }}
                        onClick={() => {
                            setEditing(true)
                            aboutMeRef.current?.focus()
                        }}
                    >
                        <SvgEdit size="2.2rem" />
                    </IconButton>
                )}
            </Stack>
        </Stack>
    )
}
