import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
        {...props}
      >
        {Icon && (
          <div className="rounded-full bg-muted p-4 mb-4">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

// ================= Preset Empty States =================

/**
 * Empty state for no data
 */
export const NoDataState = ({ 
  message = "No data available",
  action,
  className 
}: { 
  message?: string
  action?: { label: string; onClick: () => void }
  className?: string
}) => (
  <EmptyState
    icon={({ className }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    )}
    title={message}
    action={action}
    className={className}
  />
)

/**
 * Empty state for no results
 */
export const NoResultsState = ({ 
  searchQuery,
  action,
  className 
}: { 
  searchQuery?: string
  action?: { label: string; onClick: () => void }
  className?: string
}) => (
  <EmptyState
    icon={({ className }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    )}
    title="No results found"
    description={searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your search or filters"}
    action={action}
    className={className}
  />
)

/**
 * Empty state for no items
 */
export const EmptyListState = ({ 
  itemName = "items",
  action,
  className 
}: { 
  itemName?: string
  action?: { label: string; onClick: () => void }
  className?: string
}) => (
  <EmptyState
    icon={({ className }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    )}
    title={`No ${itemName} yet`}
    description={`Start by adding your first ${itemName.toLowerCase()}`}
    action={action}
    className={className}
  />
)

/**
 * Empty state for error
 */
export const ErrorState = ({ 
  message = "Something went wrong",
  onRetry,
  className 
}: { 
  message?: string
  onRetry?: () => void
  className?: string
}) => (
  <EmptyState
    icon={({ className }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
    )}
    title="Oops!"
    description={message}
    action={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
    className={className}
  />
)

/**
 * Empty state for not found
 */
export const NotFoundState = ({ 
  itemName = "Item",
  className 
}: { 
  itemName?: string
  className?: string
}) => (
  <EmptyState
    icon={({ className }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    )}
    title={`${itemName} not found`}
    description="The item you're looking for doesn't exist or has been removed"
    className={className}
  />
)

export { EmptyState }

