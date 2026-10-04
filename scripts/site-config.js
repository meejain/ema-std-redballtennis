/**
 * Owner-facing site integrations — SHIPPED DISABLED (stardust:dynamics rows #8, #9, decision batch #2).
 * Nothing in here runs until the owner flips `enabled` for a stack after confirming the ids for the
 * new host (Adobe Launch property, OneTrust domain script id, which pixels are still wanted).
 * Consumed by scripts/delayed.js — never by blocks. See stardust/dynamic-features.md.
 */
export const siteConfig = {
  analytics: {
    enabled: false,
    // Source site: Adobe Launch (assets.adobedtm.com) → Analytics / ECID / Target (demdex, omtrdc), Hotjar,
    // Facebook pixel, Doubleclick, Everest, Bidtellect, Simpli.fi, Basis, Sitescout, Lotame, GTM.
    launchScript: '', // e.g. https://assets.adobedtm.com/<property>/launch-<env>.min.js — owner to supply
  },
  consent: {
    enabled: false,
    // OneTrust CMP on the source (cdn.cookielaw.org). Domain script id for the new host — owner to supply.
    oneTrustDomainScriptId: '',
  },
  forms: {
    // Vue lead-generation widget on the source posted inside the USTA proxy clientlib; the endpoint is
    // not reachable cross-origin. Until the owner supplies one (decision batch #1) the signup-form block
    // validates client-side and shows its "not connected" notice on submit.
    leadGenEndpoint: '',
  },
};
