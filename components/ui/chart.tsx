"use client"

import * as React from "react"
import * as Recharts from "recharts"

import { cn } from "@/lib/utils"

// Themes for styling charts
const THEMES = { light: "", dark: ".dark" } as const

// Type for individual chart item config
export type ChartItemConfig = {
  label?: React.ReactNode
  icon?: React.ComponentType
  color?: string
  theme?: Partial<Record<keyof typeof THEMES, string>>
}

export type ChartConfig = Record<string, ChartItemConfig>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

// Chart Container
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
    // --- THIS IS THE FIX ---
    // The type for 'children' is now more specific (ReactElement instead of ReactNode)
    // This directly solves the error in your Vercel build log.
    children: React.ReactElement
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

// Chart dynamic CSS styling for theme/colors
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, cfg]) => cfg.color || cfg.theme
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const vars = colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme as keyof typeof THEMES] ||
                  itemConfig.color
                return color ? `  --color-${key}: ${color};` : null
              })
              .filter(Boolean)
              .join("\n")
            return `${prefix} [data-chart=${id}] {\n${vars}\n}`
          })
          .join("\n"),
      }}
    />
  )
}

// Tooltip Types
type TooltipProps = Recharts.TooltipProps<any, any> & {
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelClassName?: string
  formatter?: (...args: any[]) => React.ReactNode
  color?: string
}

// Custom Tooltip
const ChartTooltipContent = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
      labelClassName,
      formatter,
      color,
      className,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) return null

    const showNestedLabel = payload.length === 1 && indicator !== "dot"

    const renderLabel = () => {
      if (hideLabel || !payload?.length) return null
      const item = payload[0]
      const key = labelKey || (item.dataKey as string) || item.name || "value"
      const itemConfig = config[key]
      const finalLabel =
        typeof label === "string"
          ? config[label]?.label || label
          : itemConfig?.label

      if (typeof label === "function") {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {label(finalLabel, payload)}
          </div>
        )
      }

      return finalLabel ? (
        <div className={cn("font-medium", labelClassName)}>{finalLabel}</div>
      ) : null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!showNestedLabel && renderLabel()}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key =
              nameKey || (item.name as string) || (item.dataKey as string)
            const itemConfig = config[key]
            const indicatorColor = color || item.payload?.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                  indicator === "dot" && "items-center"
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0 rounded-sm",
                      {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1 h-3": indicator === "line",
                        "w-0 h-3 border border-dashed": indicator === "dashed",
                      }
                    )}
                    style={{
                      backgroundColor: indicatorColor,
                      borderColor: indicatorColor,
                    }}
                  />
                )}

                <div className="flex flex-1 justify-between items-center">
                  <div className="grid gap-1.5">
                    {showNestedLabel && renderLabel()}
                    <span className="text-muted-foreground">
                      {itemConfig?.label || item.name}
                    </span>
                  </div>
                  {item.value !== undefined && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

// Chart Legend
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    payload?: Recharts.LegendProps["payload"]
    verticalAlign?: "top" | "bottom"
    hideIcon?: boolean
    nameKey?: string
  }
>(({ className, payload, verticalAlign = "bottom", hideIcon, nameKey }, ref) => {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key =
          nameKey || (item.dataKey as string) || (item.value as string)
        const itemConfig = config[key]
        return (
          <div
            key={item.value as string}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label || item.value}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegend"

export {
  ChartContainer,
  ChartStyle,
  ChartTooltipContent,
  ChartLegendContent,
}