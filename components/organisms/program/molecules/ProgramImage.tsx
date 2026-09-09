import Image from "next/image";
import { ProgramIllustration } from "./ProgramIllustration";
import type { ProgramCategory } from "@/types";

export function ProgramImage({
  imageUrl,
  kategori,
  alt,
  sizes,
  priority = false,
}: {
  imageUrl?: string;
  kategori: ProgramCategory;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!imageUrl || imageUrl.trim() === "") {
    return <ProgramIllustration kategori={kategori} />;
  }
  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover"
    />
  );
}
