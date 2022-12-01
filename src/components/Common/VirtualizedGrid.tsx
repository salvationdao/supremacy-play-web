import { Box } from "@mui/material"
import React, { ReactNode, useEffect, useMemo, useRef } from "react"
import { areEqual, FixedSizeGrid } from "react-window"
import { useDimension } from "../../containers"
import { useDebounce } from "../../hooks"
import { Dimension } from "../../types"

const SCROLLBAR_WIDTH = 15 // px

// Either specify the minimum width of each item or specify the minimum number of columns
type ItemWidth =
    | {
          minWidth: number // rems
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
    gap?: number // rems
    renderIndex: (index: number) => ReactNode
}

// It will take up 100% of parent's width and height
// The way this is setup is that it will render items left ot right, then top to down
export const VirtualizedGrid = React.memo(function VirtualizedGrid({
    uniqueID,
    itemWidthConfig: _itemWidthConfig,
    itemHeight: _itemHeight,
    totalItems,
    gap: _gap,
    renderIndex,
}: VirtualizedGridProps) {
    const { remToPxRatio } = useDimension()
    const resizeObserver = useRef<ResizeObserver>()
    const [dimension, setDimension] = useDebounce<Dimension>({ width: 0, height: 0 }, 100)

    // Convert the rem values to pixels for pages to be responsive
    const { itemWidthConfig, itemHeight, gap } = useMemo(() => {
        const itemWidthConfig = { ..._itemWidthConfig }
        if (itemWidthConfig.minWidth) itemWidthConfig.minWidth = itemWidthConfig.minWidth * remToPxRatio

        return {
            itemWidthConfig,
            itemHeight: _itemHeight * remToPxRatio,
            gap: (_gap || 0) * remToPxRatio,
        }
    }, [_gap, _itemHeight, _itemWidthConfig, remToPxRatio])

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
        if (itemWidthConfig.minWidth) {
            let parentWidth = dimension.width - SCROLLBAR_WIDTH
            const columnCount = Math.floor(parentWidth / itemWidthConfig.minWidth)
            const rowCount = Math.ceil(totalItems / columnCount)

            const isOverflowY = itemHeight * rowCount > dimension.height
            if (!isOverflowY) parentWidth += SCROLLBAR_WIDTH
            const itemWidth = parentWidth / columnCount

            return { itemWidth, columnCount, rowCount }
        }

        if (itemWidthConfig.columnCount) {
            let parentWidth = dimension.width - SCROLLBAR_WIDTH
            const columnCount = itemWidthConfig.columnCount
            const rowCount = Math.ceil(totalItems / columnCount)

            const isOverflowY = itemHeight * rowCount > dimension.height
            if (!isOverflowY) parentWidth += SCROLLBAR_WIDTH
            const itemWidth = parentWidth / columnCount
            return { itemWidth, columnCount, rowCount }
        }

        let parentWidth = dimension.width - SCROLLBAR_WIDTH
        const isOverflowY = itemHeight > dimension.height
        if (!isOverflowY) parentWidth += SCROLLBAR_WIDTH

        return {
            itemWidth: parentWidth,
            columnCount: 1,
            rowCount: totalItems,
        }
    }, [dimension.height, dimension.width, itemHeight, itemWidthConfig.columnCount, itemWidthConfig.minWidth, totalItems])

    return useMemo(() => {
        if (dimension.width <= 0 || dimension.height <= 0) {
            return <div className={uniqueID} />
        }

        return (
            <FixedSizeGrid
                className={uniqueID}
                width={dimension.width}
                height={dimension.height}
                columnCount={columnCount}
                columnWidth={itemWidth}
                rowCount={rowCount}
                rowHeight={itemHeight}
                itemData={{
                    columnCount,
                    rowCount,
                    gap,
                    renderIndex,
                }}
            >
                {Cell}
            </FixedSizeGrid>
        )
    }, [columnCount, dimension.height, dimension.width, gap, itemHeight, itemWidth, renderIndex, rowCount, uniqueID])
})

interface ItemData {
    columnCount: number
    rowCount: number
    gap: number
    renderIndex: (index: number) => ReactNode
}

const Cell = React.memo(function Cell({
    columnIndex,
    rowIndex,
    style,
    data,
}: {
    columnIndex: number
    rowIndex: number
    style: React.CSSProperties
    data: ItemData
}) {
    const { columnCount, rowCount, gap, renderIndex } = data

    const index = rowIndex * columnCount + (columnIndex % columnCount)
    return (
        <div
            style={{
                ...style,
                left: `calc(${style.left}px + ${(columnIndex === 0 ? 0 : columnIndex) * (gap / columnCount)}px)`,
                top: `calc(${style.top}px + ${(rowIndex === 0 ? 0 : rowIndex) * (gap / rowCount)}px)`,
                width: `calc(${style.width}px - ${(gap * (columnCount - 1)) / columnCount}px)`,
                height: `calc(${style.height}px - ${(gap * (rowCount - 1)) / rowCount}px)`,
            }}
        >
            <Box sx={{ width: "100%", height: "100%" }}>{renderIndex(index)}</Box>
        </div>
    )
},
areEqual)
