"use client";

export default function DashboardError({reset}:{error:Error & {digest?:string};reset:()=>void}){
 return <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center"><div className="grid h-12 w-12 place-items-center rounded-xl bg-[#fff4dd] text-[#9c721e]">!</div><h2 className="mt-4 text-lg font-semibold">We couldn’t load this dashboard</h2><p className="mt-2 text-sm text-[#8e8798]">Refresh this view to retry loading your Shagaf records.</p><button onClick={reset} className="mt-5 rounded-xl bg-[#7140bd] px-4 py-2.5 text-xs font-semibold text-white">Try again</button></div>;
}
