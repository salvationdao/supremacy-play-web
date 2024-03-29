import { Stack, TextField, IconButton, CircularProgress, Typography } from "@mui/material"
import { useRef, useState, useCallback, useEffect } from "react"
import { SvgSave, SvgEdit } from "../../assets"
import { useToggle } from "../../hooks"
import { fonts } from "../../theme/theme"

export const Username = ({
    hide,
    username,
    updateUsername,
    primaryColour,
    gid,
}: {
    hide: boolean
    updateUsername: (newName: string) => Promise<void>
    username: string
    userID: string
    primaryColour: string
    gid: number
}) => {
    // Rename
    const renamingRef = useRef<HTMLInputElement>()
    const [editing, setEditing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [newUsername, setNewUsername] = useState<string>(username || "")

    const [copySuccess, toggleCopySuccess] = useToggle()

    const updatehHandler = useCallback(async () => {
        try {
            setSubmitting(true)
            renamingRef.current?.blur()
            await updateUsername(newUsername)
        } finally {
            setSubmitting(false)
            setEditing(false)
        }
    }, [newUsername, updateUsername])

    useEffect(() => {
        if (copySuccess) {
            const timeout = setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)

            return () => clearTimeout(timeout)
        }
    }, [copySuccess, toggleCopySuccess])

    return (
        <Stack direction="row" alignItems="center">
            <Stack direction="row" alignItems="center" sx={{ cursor: "pointer", ":hover": { opacity: 0.5 } }}>
                <TextField
                    inputRef={renamingRef}
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
                        },
                        "& .MuiInputBase-input": {
                            p: 0,
                            display: "inline",
                            fontSize: "4rem",
                            px: "1.4rem",
                            py: ".4rem",
                            wordBreak: "break-word",
                            border: `#FFFFFF99 1.5px dashed`,
                            borderRadius: 0.5,
                            backgroundColor: "#FFFFFF12",
                        },
                    }}
                    spellCheck={false}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    value={newUsername}
                    placeholder="Enter a name..."
                    onChange={(e) => setNewUsername(e.target.value)}
                    onFocus={() => renamingRef.current?.setSelectionRange(0, newUsername.length)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            updatehHandler()
                        }
                    }}
                />

                {editing && (
                    <>
                        {!submitting && (
                            <IconButton size="small" sx={{ ml: ".5rem" }} onClick={updatehHandler}>
                                <SvgSave size="1.4rem" />
                            </IconButton>
                        )}

                        {submitting && <CircularProgress size="1.4rem" sx={{ ml: "1rem", color: "#FFFFFF" }} />}
                    </>
                )}

                {!editing && (
                    <Stack
                        sx={{
                            "@media (max-width:500px)": {
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        }}
                        direction="row"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href).then(
                                () => toggleCopySuccess(true),
                                () => toggleCopySuccess(false),
                            )
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "5rem",
                                "@media (max-width:1400px)": {
                                    fontSize: "4rem",
                                },
                                "@media (max-width:1200px)": {
                                    fontSize: "3.4rem",
                                },
                                "@media (max-width:1000px)": {
                                    fontSize: "3rem",
                                },
                                "@media (max-width:700px)": {
                                    fontSize: "2rem",
                                },
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {username}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "5rem",
                                "@media (max-width:1400px)": {
                                    fontSize: "4rem",
                                },
                                "@media (max-width:1200px)": {
                                    fontSize: "3.4rem",
                                },
                                "@media (max-width:1000px)": {
                                    fontSize: "3rem",
                                },
                                "@media (max-width:700px)": {
                                    fontSize: "2.2rem",
                                },
                                WebkitTextStroke: "1px black",
                                fontFamily: fonts.nostromoBlack,
                                color: primaryColour,
                            }}
                        >
                            #{gid}
                        </Typography>
                    </Stack>
                )}

                {!hide && !editing && (
                    <IconButton
                        size="small"
                        sx={{
                            ml: ".5rem",
                            opacity: 0.6,
                            ":hover": { opacity: 1 },
                            "@media (max-width:500px)": {
                                marginTop: "-20px",
                            },
                        }}
                        onClick={() => {
                            setEditing(true)
                            renamingRef.current?.focus()
                        }}
                    >
                        <SvgEdit size="2.2rem" />
                    </IconButton>
                )}

                {copySuccess && (
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBold,
                            marginTop: ".5rem",
                            marginLeft: "1rem",
                            fontSize: "2rem",
                        }}
                    >
                        profile link copied
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
