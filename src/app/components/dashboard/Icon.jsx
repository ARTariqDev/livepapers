import Image from 'next/image';

const Icon = ({ src, alt, width = 52, height = 52, onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 px-3 py-3 w-20 rounded-xl border-none bg-transparent cursor-pointer transition-colors duration-150 hover:bg-foreground/10 active:bg-foreground/15"
    >
      <div className="w-[52px] h-[52px] rounded-xl bg-surface-dim border border-foreground/20 flex items-center justify-center overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain dark:invert"
        />
      </div>
      {text && (
        <span className="text-[11px] text-foreground/80 leading-tight text-center w-full break-words">
          {text}
        </span>
      )}
    </button>
  );
};

export default Icon;