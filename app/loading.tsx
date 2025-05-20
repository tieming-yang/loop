export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f0f10] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-[#7ec0cd] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-[#7ec0cd]/50 animate-spin animate-reverse"></div>
          <div className="absolute inset-4 rounded-full border-b-2 border-[#7ec0cd]/30 animate-spin"></div>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-[#7ec0cd] font-medium">Loading</p>
          <p className="text-gray-400 text-sm">Please wait...</p>
        </div>
      </div>
    </div>
  )
}

