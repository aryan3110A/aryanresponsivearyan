interface HeaderProps {
  title?: string;
  description?: string;

  className?: string;
}

export default function Header({
  title = 'AI Image Generator',
  description = 'Create awe-inspiring masterpieces effortlessly and explore the endless possibilities of AI generated art. Enter a prompt, choose a style, and watch Imagine - AI art generator bring your ideas to life!',
  className = '',
}: HeaderProps) {
  return (
    <header className={`w-full flex justify-center  pb-4  ${className}`}>
      <div className="w-full max-w-3xl px-2 sm:px-4 text-center">
        <h1 className="text-xl  md:text-5xl lg:text-6xl md:py-4 font-semibold mb-4 bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] text-transparent bg-clip-text transition-colors whitespace-normal leading-relaxed">
          {title}
        </h1>
        <p className="text-[#A39FA8] text-xs md:text-base xl:text-sm leading-relaxed mb-2">
          {description}
        </p>
      </div>
    </header>
  );
}
