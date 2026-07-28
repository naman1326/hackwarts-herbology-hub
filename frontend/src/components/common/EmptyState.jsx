import { Button } from './Button'

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel = 'Get Started',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-cinzel font-bold text-cream mb-2 text-center">
        {title}
      </h3>
      <p className="text-cream/70 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
