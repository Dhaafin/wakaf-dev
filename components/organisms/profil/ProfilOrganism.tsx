import { ProfilHeader } from "./molecules/ProfilHeader";
import { ProfilVisiMisi } from "./molecules/ProfilVisiMisi";
import { ProfilLegalitas } from "./molecules/ProfilLegalitas";
import { ProfilPengurus } from "./molecules/ProfilPengurus";
import { ProfilKontak } from "./molecules/ProfilKontak";

export function ProfilOrganism() {
  return (
    <div className="container-app max-w-4xl py-10">
      <ProfilHeader />
      <ProfilVisiMisi />
      <ProfilLegalitas />
      <ProfilPengurus />
      <ProfilKontak />
    </div>
  );
}
