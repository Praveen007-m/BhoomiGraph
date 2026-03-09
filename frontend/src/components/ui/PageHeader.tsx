interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

export function PageHeader({
  badge,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-up">
      {badge && (
        <span className="inline-block bg-primary/10 text-primary px-5 py-1.5 rounded-full text-sm font-medium">
          {badge}
        </span>
      )}

      <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
        {title}
      </h1>

      {description && (
        <p className="text-muted-foreground text-lg">
          {description}
        </p>
      )}
    </div>
  );
}