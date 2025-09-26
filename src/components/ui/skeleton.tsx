import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// Enhanced skeleton components for layout shift prevention
export const MenuItemSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export const ImageSkeleton = ({ className = "w-full h-48" }: { className?: string }) => (
  <Skeleton className={className} />
);

export { Skeleton };