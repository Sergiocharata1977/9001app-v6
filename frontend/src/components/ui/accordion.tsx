"use client"

import { ChevronDown } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

interface AccordionContextType {
  value?: string
  onValueChange?: (value: string) => void
  collapsible?: boolean
}

const AccordionContext = React.createContext<AccordionContextType>({})

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", collapsible = false, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      type === "multiple" ? [] : ""
    )
    
    const currentValue = value !== undefined ? value : internalValue
    
    const handleValueChange = React.useCallback((newValue: string | string[]) => {
      if (onValueChange) {
        onValueChange(newValue)
      } else {
        setInternalValue(newValue)
      }
    }, [onValueChange])

    return (
      <AccordionContext.Provider value={{
        value: type === "single" ? (currentValue as string) : undefined,
        onValueChange: type === "single" ? (newValue: string) => {
          const newVal = newValue === (currentValue as string) && collapsible ? "" : newValue
          handleValueChange(newVal)
        } : undefined,
        collapsible
      }}>
        <div
          ref={ref}
          className={cn("space-y-4", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    const isOpen = context.value === value

    return (
      <div
        ref={ref}
        className={cn("border-b", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value, isOpen } as any)
          }
          return child
        })}
      </div>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
  isOpen?: boolean
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, value, isOpen, ...props }, ref) => {
    const context = React.useContext(AccordionContext)

    const handleClick = () => {
      if (context.onValueChange && value) {
        context.onValueChange(value)
      }
    }

    return (
      <button
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  isOpen?: boolean
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, value, isOpen, ...props }, ref) => {
    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden text-sm pb-4 pt-0", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }

