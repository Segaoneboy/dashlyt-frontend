
export function Skeleton({className}: {className?: string | undefined}){
    return(
        <div className = {`animate-pulse bg-zinc-200 rounded w-20 ${className}`}></div>
    )
}