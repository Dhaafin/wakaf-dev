import Image from "next/image";
import { ProgramIllustration } from "@/components/program-illustration";
import type { ProgramCategory } from "@/types";

// Menampilkan foto program bila `imageUrl` diisi; kalau kosong, jatuh ke
// ilustrasi dummy sesuai kategori. Begitu foto dokumentasi asli dari yayasan
// tersedia, cukup isi `imageUrl` — tidak ada kode lain yang perlu diubah.
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
