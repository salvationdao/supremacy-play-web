import { red } from "@mui/material/colors"
import { createTheme, FactionTheme } from "@mui/material/styles"
import "./global.css"

// had to keep the declare in this file for it to work
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
    red: "#D12A2A",
    lightRed: "#E83200",
    green: "#2BA172",
    yellow: "#FFE200",
    orange: "#E04F00",
    gold: "#FFC400",
    blue: "#0074D9",
    blue2: "#309FFF",
    purple: "#A985FF",
    black2: "#13161B",
    black3: "#080303",

    neonPink: "#F72485",
    lightNeonBlue: "#8DE9FF",
    neonBlue: "#00FFFF",
    darkNeonBlue: "#176969",
    darkerNeonBlue: "#073339",
    darkNavyBlue: "#0C0C1A",
    navy: "#2A2A40",
    darkNavy: "#101019",
    darkerNavy: "#08080C",

    health: "#BFF600",
    shield: "#00F7F7",
    warMachineSkillBar: "#9669FF",

    lightGrey: "#C0C0C4",
    grey: "#89898d",
    battleQueueBanner: "#C24242",
    darkestNeonBlue: "#050c12",

    globalChat: "#1A6044",
    assetsBanner: "#4E1A61",

    supsCredit: "#01FF70",
    supsDebit: "#FF4136",

    auction: "#E04F00",
    dutchAuction: "#D98D00",

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
    primary: "#00FFFF",
    secondary: "#00FFFF",
    background: "#050c12",
}

export const fonts = {
    nostromoHeavy: ["Nostromo Regular Heavy", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoBlack: ["Nostromo Regular Black", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoBold: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoMedium: ["Nostromo Regular Medium", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    nostromoLight: ["Nostromo Regular Light", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    shareTech: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
}

export enum siteZIndex {
    // Shows on top of everything
    Modal = 299,
    Drawer = 298,
    Popover = 297,
    Tooltip = 296,
    LoadMessage = 250,

    // Stream site top elements
    Bar = 199,
    LeftDrawer = 198,
    RightDrawer = 197,
    RoutePage = 101,

    // Battle areana
    Controls = 70,
    Trailer = 69,
    BattleHistory = 70,
    BattleEnd = 60,
    MiniMap = 50,
    MoveableResizableHover = 51,
    MoveableResizable = 20,
    Notifications = 40,
    MechStats = 30,
    VotingSystem = 30,
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
        },
        h2: {
            fontFamily: fonts.nostromoBold,
            fontSize: "5.15rem",
        },
        h3: {
            fontFamily: fonts.shareTech,
            fontSize: "4.13rem",
        },
        h4: {
            fontFamily: fonts.shareTech,
            fontSize: "2.96rem",
        },
        h5: {
            fontFamily: fonts.shareTech,
            fontSize: "2.13rem",
        },
        h6: {
            fontFamily: fonts.shareTech,
            fontSize: "1.78rem",
        },
        body1: {
            fontFamily: fonts.shareTech,
            fontSize: "1.6rem",
        },
        body2: {
            fontFamily: fonts.shareTech,
            fontSize: "1.4rem",
        },
        subtitle1: {
            fontFamily: fonts.shareTech,
            fontSize: "1.3rem",
            textAlign: "center",
        },
        subtitle2: {
            fontFamily: fonts.shareTech,
            fontSize: "1.3rem",
        },
        caption: {
            fontFamily: fonts.shareTech,
            fontSize: "1.2rem",
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
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
                root: {
                    userSelect: "none",
                },
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
        },
        MuiLink: {
            defaultProps: {
                underline: "none",
                color: "text.primary",
            },
            styleOverrides: {
                root: {
                    display: "inline-flex",
                    alignItems: "center",
                    transition: "all .1s",
                    "& *": {
                        transition: "all .1s",
                    },
                    ":hover, :hover > *": {
                        color: "#136ED6",
                    },
                },
            },
        },
        MuiSkeleton: {
            defaultProps: {
                animation: "wave",
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    ".MuiPagination-ul": {
                        justifyContent: "center",
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
    },
    factionTheme,
})
