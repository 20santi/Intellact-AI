import Image from "next/image";

export function Loader() {

  return (
    <div className="h-full gap-y-4 flex flex-col items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image
            alt="logo"
            fill
            src="/logo.png"
        />
      </div>
      <p className="text-sm text-muted-foreground">Intellact AI is thinking...</p>
    </div>
  );
}
