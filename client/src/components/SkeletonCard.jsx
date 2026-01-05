const SkeletonCard = () => {
  return (
    <div className="flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
      <div className="aspect-[16/10] animate-pulse bg-stone-200" />
      <div className="space-y-4 p-5">
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-stone-200" />
          <div className="h-7 w-20 animate-pulse rounded-lg bg-stone-200" />
        </div>
        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <div className="space-y-2">
            <div className="h-3 w-10 animate-pulse rounded bg-stone-200" />
            <div className="h-6 w-20 animate-pulse rounded bg-stone-200" />
          </div>
          <div className="h-10 w-20 animate-pulse rounded-xl bg-stone-200" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard
