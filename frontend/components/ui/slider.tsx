"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getThumbAriaLabel,
  ...props
}: SliderPrimitive.Root.Props & {
  getThumbAriaLabel?: (index: number) => string
}) {
  const values = React.useMemo(() => {
    const current = value ?? defaultValue
    if (Array.isArray(current)) return current
    if (typeof current === "number") return [current]
    return [min]
  }, [value, defaultValue, min])

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("w-full data-disabled:opacity-50", className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="flex w-full touch-none items-center py-2 select-none">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full grow rounded-full bg-muted"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full bg-primary"
          />
          {values.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              data-slot="slider-thumb"
              getAriaLabel={getThumbAriaLabel}
              className="block size-5 rounded-full border-[3px] border-background bg-primary shadow-[0_1px_4px_rgb(0_0_0/0.25)] transition-[box-shadow,scale] outline-none hover:ring-4 hover:ring-primary/15 focus-visible:ring-4 focus-visible:ring-primary/25 data-dragging:scale-110"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
