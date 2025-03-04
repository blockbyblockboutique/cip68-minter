import { serializePlutusScript } from "@meshsdk/core";

const ADMIN_PKH = "xpub1m7z8wzlm7cmg0py0l7lgjrn6rs6h5fplwchcfd77zgthguw6k7p62vw56gwzaex560ws3279jv27aqvyk5ztncjcxl8pekkqur0jrkctttwpm";

// Valid PlutusV2 hex from MeshJS example (simple always-true script)
const plutusHex = "4e4d01000033222220051200120011";

export const adminLockScript = serializePlutusScript({
  code: plutusHex,
  version: "V2"
});