import {
    Autocomplete,
    Box,
    CircularProgress,
    IconButton,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useDebounce } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { UserData } from "../../../types/passport"

const testUser = {
    id: "1",
    username: "jayli3n",
    avatar_id: "string",
    faction_id: "string",
    faction: {
        id: "string",
        label: "string",
        logo_blob_id: "string",
        background_blob_id: "string",
        theme: {
            primary: "#C24242",
            secondary: "#FFFFFF",
            background: "#0D0404",
        },
        description: "string",
    },
}
const testUser2 = {
    id: "2",
    username: "jayli3n",
    avatar_id: "string",
    faction_id: "string",
    faction: {
        id: "string",
        label: "string",
        logo_blob_id: "string",
        background_blob_id: "string",
        theme: {
            primary: "#C24242",
            secondary: "#FFFFFF",
            background: "#0D0404",
        },
        description: "string",
    },
}
const testUser3 = {
    id: "3",
    username: "jayli3n",
    avatar_id: "string",
    faction_id: "string",
    faction: {
        id: "string",
        label: "string",
        logo_blob_id: "string",
        background_blob_id: "string",
        theme: {
            primary: "#C24242",
            secondary: "#FFFFFF",
            background: "#0D0404",
        },
        description: "string",
    },
}

const banReasons = [
    { label: "Select a reason", value: "" },
    { label: "Verbal abuse", value: "Verbal abuse" },
    { label: "Intentional team kill", value: "Intentional team kill" },
    { label: "Offensive or inappropriate name", value: "Offensive or inappropriate name" },
]

const UserItem = ({ user }: { user: UserData }) => (
    <Stack direction="row" spacing=".6rem" alignItems="center">
        <Box
            sx={{
                mt: "-0.1rem !important",
                width: "1.7rem",
                height: "1.7rem",
                flexShrink: 0,
                backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundColor: user.faction.theme.primary,
                borderRadius: 0.8,
                border: `${user.faction.theme.primary} 1px solid`,
            }}
        />
        <Typography>{user.username}</Typography>
    </Stack>
)

export const UserBanForm = ({ user, open, onClose }: { user?: UserData; open: boolean; onClose: () => void }) => {
    const [textField, setTextField] = useState("")
    const [search, setSearch] = useDebounce<string>("", 1000)
    const [selectedUser, setSelectedUser] = useState<UserData | null>()
    const [selectedReason, setSelectedReason] = useState<string>()

    const primaryColor = (user && user.faction.theme.primary) || colors.neonBlue

    useEffect(() => {
        console.log("SEND")
    }, [search])

    const isLoading = true

    const options: UserData[] = [testUser, testUser2, testUser3]

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "42rem",
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack
                        sx={{
                            px: "2rem",
                            pt: "1.8rem",
                            pb: "1.8rem",
                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
                            ".MuiAutocomplete-popper": {
                                zIndex: 99999,
                                ".MuiPaper-root": {
                                    background: "none",
                                    backgroundColor: colors.darkNavy,
                                    zIndex: 99999,
                                },
                            },
                        }}
                    >
                        <Typography sx={{ mb: ".9rem", fontFamily: "Nostromo Regular Black" }}>
                            REPORT A USER
                        </Typography>

                        <Autocomplete
                            options={options}
                            loading={isLoading}
                            sx={{
                                ".MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 9px)",
                                },
                            }}
                            disablePortal
                            onChange={(e, value) => setSelectedUser(value)}
                            renderOption={(props, option) => (
                                <Box key={option.id} component="li" {...props}>
                                    <UserItem user={option} />
                                </Box>
                            )}
                            getOptionLabel={(option) => option.username}
                            renderInput={(params) => (
                                <TextField
                                    value={textField}
                                    placeholder="Search for username..."
                                    onChange={(e) => {
                                        setTextField(e.currentTarget.value)
                                        setSearch(e.currentTarget.value)
                                    }}
                                    type="text"
                                    hiddenLabel
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            py: 0,
                                            fontFamily: "Share Tech",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${primaryColor} !important`,
                                        },
                                        input: {
                                            color: "#FFFFFF",
                                        },
                                    }}
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoading ? <CircularProgress color="inherit" size="1.2rem" /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <Stack spacing="1.2rem" sx={{ mt: "1.6rem" }}>
                            <Stack spacing=".1rem">
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>
                                    BAN USER:
                                </Typography>
                                {selectedUser ? (
                                    <UserItem user={selectedUser} />
                                ) : (
                                    <Typography sx={{ opacity: 0.6 }}>
                                        <i>Use the search box to find a user...</i>
                                    </Typography>
                                )}
                            </Stack>

                            <Stack spacing=".3rem" sx={{ pb: ".2rem" }}>
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>
                                    REASON:
                                </Typography>
                                <Select
                                    displayEmpty
                                    sx={{
                                        borderRadius: 0.7,
                                        "&:hover": {
                                            backgroundColor: colors.darkNavy,
                                        },
                                        "& .MuiSelect-outlined": { px: "1.6rem", py: ".8rem" },
                                    }}
                                    value={selectedReason}
                                    MenuProps={{
                                        variant: "menu",
                                        sx: {
                                            "&& .Mui-selected": {
                                                backgroundColor: colors.darkerNeonBlue,
                                            },
                                        },
                                        PaperProps: {
                                            sx: {
                                                background: "none",
                                                backgroundColor: colors.darkNavy,
                                                borderRadius: 0.5,
                                            },
                                        },
                                    }}
                                >
                                    {banReasons.map((x, i) => {
                                        return (
                                            <MenuItem
                                                key={`ban-reason-${i}-${x.value}`}
                                                value={x.value}
                                                onClick={() => setSelectedReason(x.value)}
                                                sx={{
                                                    "&:hover": {
                                                        backgroundColor: "#FFFFFF14",
                                                    },
                                                }}
                                            >
                                                <Typography>{x.label}</Typography>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </Stack>

                            <Stack spacing=".3rem">
                                <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>
                                    ADDITIONAL COMMENTS:
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}
                    >
                        <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
