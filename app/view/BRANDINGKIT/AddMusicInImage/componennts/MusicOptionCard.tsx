import Image from "next/image"

interface MusicOptionCardProps {
  label: string
  icon: string
  selected: boolean
  onClick: () => void
}

export default function MusicOptionCard({
  label,
  icon,
  selected,
  onClick,
}: MusicOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl bg-[#1f1f1f] hover:bg-[#2b2b2b] transition-colors border ${
        selected ? "border-violet-500" : "border-transparent"
      }`}
    >
      <div className="flex items-center gap-4">
        <Image src={icon} alt={label} width={30} height={30} />
        <span className="text-white text-base">{label}</span>
      </div>
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-violet-500" : "border-purple-700"
        }`}
      >
        {selected && <span className="block w-2.5 h-2.5 rounded-full bg-violet-500" />}
      </span>
    </button>
  )
}