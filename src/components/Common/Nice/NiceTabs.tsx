import { Tab, Tabs, TabsProps } from "@mui/material"
import { ReactNode } from "react"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { TypographyTruncated } from "../TypographyTruncated"

export interface NiceTab {
    label: ReactNode
    value: number
}

interface NiceTabsProps extends Omit<TabsProps, "value" | "onChange"> {
    tabs: NiceTab[]
    value: number
    onChange: (newValue: number) => void
}

export const NiceTabs = ({ tabs, value, onChange, ...props }: NiceTabsProps) => {
    const theme = useTheme()

    return (
        <Tabs
            value={value}
            variant="fullWidth"
            sx={{
                height: "4.6rem",
                background: theme.factionTheme.background,
                boxShadow: 1,
                zIndex: 9,
                minHeight: 0,

                ".MuiTab-root": {
                    height: "4.6rem",
                    minHeight: 0,
                    p: "1rem",

                    ":hover": {
                        backgroundColor: `${theme.factionTheme.primary}10`,
                    },
                },

                ".MuiTabs-indicator": {
                    height: "100%",
                    background: theme.factionTheme.s600,
                    border: `1px solid ${theme.factionTheme.s500}`,
                    borderBottom: "none",
                    zIndex: -1,

                    "::after": {
                        position: "absolute",
                        content: '""',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(180deg, ${theme.factionTheme.background}00, ${theme.factionTheme.background}40)`,
                        zIndex: -1,
                    },
                },
            }}
            onChange={(_event, newValue) => {
                onChange(newValue)
            }}
            {...props}
        >
            {tabs.map((tab, i) => {
                return (
                    <Tab
                        key={`tab-${i}`}
                        value={tab.value}
                        sx={{ borderBottom: value !== tab.value ? `1px solid ${theme.factionTheme.s500}` : `0px solid transparent` }}
                        label={
                            typeof tab.label === "string" ? (
                                <TypographyTruncated
                                    variant="caption"
                                    sx={{
                                        lineHeight: 1,
                                        fontFamily: fonts.nostromoBlack,
                                        textAlign: "start",
                                    }}
                                >
                                    {tab.label}
                                </TypographyTruncated>
                            ) : (
                                tab.label
                            )
                        }
                    />
                )
            })}
        </Tabs>
    )
}
