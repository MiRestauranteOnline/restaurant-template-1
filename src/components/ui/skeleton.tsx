import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// Enhanced skeleton components for layout shift prevention
export const MenuItemSkeleton = () => (
  <div className="space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-12" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);

export const ImageSkeleton = ({ className = "w-full h-48" }: { className?: string }) => (
  <Skeleton className={className} />
);

export { Skeleton };