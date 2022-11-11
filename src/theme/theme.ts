import { FactionTheme } from "@mui/material"
import { red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"
import "./global.css"

// Had to keep the declare in this file for it to work
declare module "@mui/material/styles" {
    interface Theme {
        factionTheme: FactionTheme
    }

    interface ThemeOptions {
        factionTheme?: FactionTheme
    }

    export interface FactionTheme {
        primary: string
        secondary: string
        background: string
    }
    // allow configuration using `createTheme`
    interface FactionThemeOptions {
        primary?: string
        secondary?: string
        background?: string
    }
}

export const colors = {
    text: "#FFFFFF",
    offWhite: "#D4FFFF",
    red: "#D93434",
    niceRed: "#FF2C14",
    lightRed: "#E83200",
    darkRed: "#BA1300",
    green: "#2BA172",
    yellow: "#FFC800",
    orange: "#E04F00",
    gold: "#FFC400",
    silver: "#C1F3F7",
    bronze: "#CB7431",
    blue: "#0074D9",
    blue2: "#309FFF",
    purple: "#9A73F5",
    black2: "#13161B",
    black3: "#080303",

    neonPink: "#F72485",
    lightNeonBlue: "#8DE9FF",
    neonBlue: "#3DE0E0",
    darkNeonBlue: "#176969",
    darkerNeonBlue: "#073339",
    darkNavyBlue: "#0C0C1A",
    navy: "#2A2A40",
    darkNavy: "#101019",
    darkerNavy: "#08080C",

    health: "#BFF600",
    shield: "#00F7F7",
    warMachineSkillBar: "#9669FF",

    lightGrey: "#999999",
    grey: "#777777",
    darkGrey: "#444444",
    battleQueueBanner: "#C24242",
    darkestNeonBlue: "#050c12",

    globalChat: "#35A679",

    // Transactions
    supsCredit: "#01FF70",
    supsDebit: "#FF4136",

    // Market
    buyout: "#309FFF",
    auction: "#E04F00",
    dutchAuction: "#D98D00",
    marketSold: "#2BA172",
    marketCreate: "#E6C85C",
    marketBidReturned: "#CC3F3F",

    // Mech loadout
    chassisSkin: "#D4AA13",
    introAnimation: "#B63DD4",
    outroAnimation: "#B63DD4",
    weapons: "#EB2300",
    utilities: "#5DC437",
    powerCore: "#009CBF",

    rarity: {
        MEGA: "#e84234",
        COLOSSAL: "#b43328",
        RARE: "#4d90fa",
        LEGENDARY: "#fabd4d",
        ELITE_LEGENDARY: "#ffcc4e",
        ULTRA_RARE: "#4e57ff",
        EXOTIC: "#824dff",
        GUARDIAN: "#4dcfff",
        MYTHIC: "#a1e6ff",
        DEUS_EX: "#fffa4e",
        TITAN: "#5eff75",
    },
}

const factionTheme: FactionTheme = {
    primary: "#00FAFA",
    secondary: "#00FAFA",
    background: "#050c12",
}

export const fonts = {
    nostromoHeavy: ["Nostromo Regular Heavy", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoBlack: ["Nostromo Regular Black", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoBold: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoMedium: ["Nostromo Regular Medium", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoLight: ["Nostromo Regular Light", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    shareTech: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    shareTechMono: ["Share Tech Mono", "monospace"].join(","),
}

export enum siteZIndex {
    // Shows on top of everything
    Tooltip = 900,
    TopBar = 800,
    MainMenuModal = 700,
    Modal = 600,
    Drawer = 500,
    Popover = 400,

    // Stream site top elements
    RoutePage = 101,

    // Battle areana
    Controls = 70,
    BattleHistory = 70,
    Trailer = 69,
    MoveableResizableHover = 51,
    MoveableResizable = 42,
    Notifications = 40,
    MechStats = 30,
    Stream = 5,
}

export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        mode: "dark",
        secondary: {
            main: colors.darkerNeonBlue,
        },
        success: {
            main: colors.yellow,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#FFFFFF",
        },
        text: {
            primary: colors.text,
            secondary: colors.offWhite,
        },
    },
    typography: {
        htmlFontSize: 16,
        h1: {
            fontFamily: fonts.nostromoBlack,
            fontSize: "8.18rem",
            lineHeight: 1.5,
        },
        h2: {
            fontFamily: fonts.nostromoBold,
            fontSize: "5.15rem",
            lineHeight: 1.5,
        },
        h3: {
            fontFamily: fonts.shareTech,
            fontSize: "4.13rem",
            lineHeight: 1.5,
        },
        h4: {
            fontFamily: fonts.shareTech,
            fontSize: "2.96rem",
            lineHeight: 1.5,
        },
        h5: {
            fontFamily: fonts.shareTech,
            fontSize: "2.13rem",
            lineHeight: 1.5,
        },
        h6: {
            fontFamily: fonts.shareTech,
            fontSize: "1.82rem",
            lineHeight: 1.5,
        },
        body1: {
            fontFamily: fonts.shareTech,
            fontSize: "1.7rem",
            lineHeight: 1.5,
        },
        body2: {
            fontFamily: fonts.shareTech,
            fontSize: "1.5rem",
            lineHeight: 1.5,
        },
        subtitle1: {
            fontFamily: fonts.shareTech,
            fontSize: "1.34rem",
            lineHeight: 1.5,
        },
        subtitle2: {
            fontFamily: fonts.shareTech,
            fontSize: "1.18rem",
            lineHeight: 1.5,
        },
        caption: {
            fontFamily: fonts.shareTech,
            fontSize: "1.25rem",
            lineHeight: 1.5,
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
            styleOverrides: {
                root: {
                    fontSize: "1.18013rem",
                    transition: "all .1s",
                    ":hover": {
                        opacity: 0.76,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: "1.18013rem",
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                color: "text.primary",
            },
            styleOverrides: {
                caption: {
                    display: "block",
                },
            },
        },
        MuiDialog: {
            defaultProps: {
                disablePortal: false,
            },
        },
        MuiPopover: {
            defaultProps: {
                disablePortal: false,
            },
            styleOverrides: {
                root: {
                    zIndex: siteZIndex.Drawer,
                },
            },
        },
        MuiLink: {
            defaultProps: {
                color: colors.neonBlue,
            },
            styleOverrides: {
                root: {
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                },
            },
        },
        MuiSkeleton: {
            defaultProps: {
                animation: "wave",
            },
        },
        MuiPagination: {
            defaultProps: {
                size: "medium",
                showFirstButton: true,
                showLastButton: true,
            },
            styleOverrides: {
                root: {
                    ".MuiPagination-ul": {
                        justifyContent: "center",
                    },
                    ".MuiButtonBase-root": {
                        fontFamily: fonts.nostromoBold,
                        minWidth: "25px",
                        height: "25px",
                    },
                    ".MuiSvgIcon-root": {
                        fontSize: "1.8rem",
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: fonts.nostromoBlack,
                    color: "white",
                },
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    padding: "0 !important",
                    color: "#FFFFFF90",
                    borderRadius: 0,
                    "& > .MuiSvgIcon-root": { width: "2.6rem", height: "2.6rem" },
                    ".MuiSvgIcon-root": { transform: "scale(1.1)", transformOrigin: "left" },
                    "&.Mui-checked > .MuiSvgIcon-root": { fill: `${colors.green} !important` },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.green}50 !important` },
                },
            },
        },
        MuiSwitch: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    transform: "scale(.7)",
                    ".Mui-checked": { color: colors.green },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.green}50` },
                },
            },
        },
        MuiCircularProgress: {
            defaultProps: {
                size: "3rem",
            },
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    zIndex: siteZIndex.Modal,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    zIndex: siteZIndex.Drawer,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                popper: {
                    zIndex: siteZIndex.Tooltip,
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    ".MuiSlider-thumb": {
                        width: "17px",
                        height: "18px",
                        ":after": {
                            width: "100%",
                            height: "100%",
                        },
                        borderRadius: 0,
                    },
                },
            },
        },
    },
    factionTheme,
})
