import { Box, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { FixedSizeGrid } from "react-window"
import { useDebounce } from "../../hooks"
import { Dimension } from "../../types"

const SCROLLBAR_WIDTH = 15 // px

// Either specify the minimum width of each item or specify the minimum number of columns
type ItemWidth =
    | {
          minWidth: number
          columnCount?: never
      }
    | {
          minWidth?: never
          columnCount: number
      }

interface VirtualizedGridProps {
    uniqueID: string
    itemWidthConfig: ItemWidth
    itemHeight: number
    totalItems: number
    gap?: number
}

// It will take up 100% of parent's width and height
// The way this is setup is that it will render items left ot right, then top to down
export const VirtualizedGrid = ({ uniqueID, itemWidthConfig, itemHeight, totalItems, gap = 0 }: VirtualizedGridProps) => {
    const resizeObserver = useRef<ResizeObserver>()
    const [dimension, setDimension] = useDebounce<Dimension>({ width: 300, height: 300 }, 500)

    // Setup resize observer to watch the parent element
    useEffect(() => {
        const parentEl = document.getElementsByClassName(uniqueID)[0]?.parentElement

        // Return if its already setup or no parent element found
        if (resizeObserver.current || !parentEl) return

        const cleanup = () => resizeObserver.current && resizeObserver.current.unobserve(parentEl)

        cleanup()
        resizeObserver.current = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect
            setDimension({ width: rect.width, height: rect.height })
        })
        resizeObserver.current.observe(parentEl)

        return cleanup
    }, [setDimension, uniqueID])

    // Calculate the width of each item based on config
    const { itemWidth, columnCount, rowCount } = useMemo(() => {
        const parentWidth = dimension.width - SCROLLBAR_WIDTH

        if (itemWidthConfig.minWidth) {
            const columnCount = Math.floor(parentWidth / itemWidthConfig.minWidth)
            const itemWidth = parentWidth / columnCount
            const rowCount = Math.ceil(totalItems / columnCount)
            return { itemWidth, columnCount, rowCount }
        }

        if (itemWidthConfig.columnCount) {
            const columnCount = itemWidthConfig.columnCount
            const itemWidth = parentWidth / columnCount
            const rowCount = Math.ceil(totalItems / columnCount)
            return { itemWidth, columnCount, rowCount }
        }

        return {
            itemWidth: parentWidth,
            columnCount: 1,
            rowCount: totalItems,
        }
    }, [dimension.width, itemWidthConfig.columnCount, itemWidthConfig.minWidth, totalItems])

    const Cell = useCallback(
        ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
            console.log(style.height, gap)
            return (
                <div
                    style={{
                        ...style,
                        left: `calc(${style.left}px + ${(columnIndex === 0 ? 0 : columnIndex) * (gap / columnCount)}px)`,
                        top: `calc(${style.top}px + ${(rowIndex === 0 ? 0 : rowIndex) * (gap / rowCount)}px)`,
                        width: `calc(${style.width}px - ${gap / 2 + gap / columnCount}px)`,
                        height: `calc(${style.height}px - ${gap / 2}px)`,
                    }}
                >
                    <Box sx={{ width: "100%", height: "100%", background: "#FFFFFF30" }}>
                        <Typography>
                            Item {rowIndex},{columnIndex}
                        </Typography>
                    </Box>
                </div>
            )
        },
        [columnCount, gap, rowCount],
    )

    return (
        <FixedSizeGrid
            className={uniqueID}
            width={dimension.width}
            height={dimension.height}
            columnCount={columnCount}
            columnWidth={itemWidth}
            rowCount={rowCount}
            rowHeight={itemHeight}
        >
            {Cell}
        </FixedSizeGrid>
    )
}
