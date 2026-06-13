import Image from 'next/image';

const Icon = ({ src, alt, onClick, text }) => {
  return (
    <button
      onClick={onClick}
      style={{ width: 'var(--icon-wrapper-width, 80px)' }}
      className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl border-none bg-transparent cursor-pointer transition-colors duration-150 hover:bg-foreground/10 active:bg-foreground/15"
    >
      <div
        style={{ width: 'var(--icon-size, 52px)', height: 'var(--icon-size, 52px)' }}
        className="rounded-xl bg-surface-dim border border-foreground/20 flex items-center justify-center overflow-hidden shrink-0"
      >
        <Image
          src={src}
          alt={alt}
          width={52}
          height={52}
          className="object-contain dark:invert p-1"
          style={{ width: '70%', height: '70%' }}
        />
      </div>
      {text && (
        <span
          style={{ fontSize: 'var(--icon-font-size, 11px)' }}
          className="text-foreground/80 leading-tight text-center w-full break-words"
        >
          {text}
        </span>
      )}
    </button>
  );
};

export default Icon;