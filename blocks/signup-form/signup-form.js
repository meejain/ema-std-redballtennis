/**
 * signup-form — the USTA lead-generation form (live: Vue `v-lead-generation`, in-page view).
 * Template-slotted (#95): fixed form skeleton, authored copy MOVED into role slots (EW1).
 * Variants by class: `newsletter` (home: 16px top / 15px gutters), default (play), `host`
 * (host: no bottom padding — the section's red stripe follows directly).
 *
 * Schemas: stardust/eds-schema/home.json §newsletter, play.json §need, host.json §host-form.
 *
 * Authoring rows (one cell each unless noted — component-model shape "simple"):
 *   1. <img> brand icon (content.da.live URL, alt "")
 *   2. h4 title
 *   3. subtitle <p>
 *   4. EMAIL label <p>          ┐ three single-cell rows, read by order (D3: every row one
 *   5. ZIP/POSTAL CODE label <p> │ cell) — moved into the two <label>s and the submit <button>
 *   6. *JOIN THE FUN label <p>   ┘
 *   7. legal <p> with the two usta.com links
 *
 * Behaviour: submit stays disabled until both fields are non-empty and the email matches
 * EMAIL_RE; on submit POSTs JSON to siteConfig.forms.leadGenEndpoint (scripts/site-config.js) or,
 * when the endpoint is empty, shows the "not connected" notice — never a fake success.
 *
 * @ew-exempt <p> submit label (row 6) — lives inside the <button> (EW7; the pill is
 *   the control)
 * @ew-exempt generated "*" required glyphs (label / button prefix) — presentational, aria-hidden
 * @ew-exempt generated status notices (runtime values, allowlisted):
 *   "Sign-up is not connected yet — your details were not sent." · "Thank you! You're signed up." ·
 *   "Something went wrong — please try again."
 */

// site-config is loaded lazily at submit time (the round-trip harness inlines block JS and cannot
// resolve static imports); a missing module counts as 'not connected'.
async function leadGenEndpoint() {
  try {
    const { siteConfig } = await import('../../scripts/site-config.js');
    return siteConfig?.forms?.leadGenEndpoint || '';
  } catch (e) {
    return '';
  }
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const NOTICES = {
  unconnected: 'Sign-up is not connected yet — your details were not sent.',
  ok: 'Thank you! You’re signed up.',
  fail: 'Something went wrong — please try again.',
};

const TEMPLATE = `
<div class="lead-view"><form class="lead-form" novalidate>
  <div class="lead-form-icon"></div>
  <div class="lead-form-title"></div>
  <div class="lead-form-subtitle"></div>
  <div class="lead-form-inputs">
    <div class="lead-form-field lead-form-email">
      <label for="email-value-id"><span class="asterisk" aria-hidden="true">*</span></label>
      <div class="lead-form-input">
        <input id="email-value-id" type="text" name="email" inputmode="email" autocomplete="email"
          required aria-invalid="false">
      </div>
    </div>
    <div class="lead-form-field lead-form-zipcode">
      <label for="zipcode-value-id"><span class="asterisk" aria-hidden="true">*</span></label>
      <div class="lead-form-input">
        <input id="zipcode-value-id" type="text" name="zipcode" inputmode="numeric"
          autocomplete="postal-code" required aria-invalid="false">
      </div>
    </div>
    <div class="lead-form-buttons"><button type="submit" class="button" disabled></button></div>
  </div>
  <div class="lead-form-legal"></div>
</form></div>`;

function isMedia(el) {
  return el.matches('img, picture') || !!el.querySelector('img, picture');
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // 1. QUERY + CAPTURE (EW1)
  let icon = null;
  let title = null;
  let subtitle = null;
  let legal = null;
  const loose = [];
  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    [...cell.children].forEach((el) => {
      if (isMedia(el)) icon = icon || el;
      else if (el.matches('h1, h2, h3, h4, h5, h6')) title = title || el;
      else if (el.matches('p') && el.querySelector('a[href]')) legal = legal || el;
      else if (el.matches('p')) loose.push(el);
    });
  });
  // plain paragraphs in authored order: subtitle, then the three control labels
  const [first, ...labels] = loose;
  subtitle = first || null;

  // 2. CREATE the skeleton
  const tpl = document.createElement('template');
  tpl.innerHTML = TEMPLATE.trim();
  const root = tpl.content.firstElementChild;
  const form = root.querySelector('form');
  const slot = (c) => root.querySelector(`.${c}`);

  // 3. MOVE the authored nodes
  if (icon) slot('lead-form-icon').append(icon);
  if (title) slot('lead-form-title').append(title);
  if (subtitle) slot('lead-form-subtitle').append(subtitle);
  const [emailLabel, zipLabel, submitLabel] = labels;
  if (emailLabel) root.querySelector('label[for="email-value-id"]').append(emailLabel);
  if (zipLabel) root.querySelector('label[for="zipcode-value-id"]').append(zipLabel);
  const button = root.querySelector('button');
  if (submitLabel) button.append(submitLabel);
  if (legal) slot('lead-form-legal').append(legal);

  // 4. behaviour
  const email = root.querySelector('#email-value-id');
  const zip = root.querySelector('#zipcode-value-id');
  const valid = () => EMAIL_RE.test(email.value.trim()) && zip.value.trim().length > 0;
  const refresh = () => {
    button.disabled = !valid();
    const v = email.value.trim();
    email.setAttribute('aria-invalid', String(v !== '' && !EMAIL_RE.test(v)));
  };
  email.addEventListener('input', refresh);
  zip.addEventListener('input', refresh);

  let notice = null;
  const say = (text, kind) => {
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'notice';
      notice.setAttribute('role', 'status');
      form.append(notice);
    }
    notice.dataset.kind = kind;
    notice.textContent = text;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!valid()) { refresh(); return; }
    const endpoint = await leadGenEndpoint();
    if (!endpoint) { say(NOTICES.unconnected, 'unconnected'); return; }
    button.disabled = true;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value.trim(),
          zipcode: zip.value.trim(),
          source: window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      say(NOTICES.ok, 'ok');
      form.reset();
    } catch (err) {
      say(NOTICES.fail, 'fail');
      refresh();
    }
  });

  block.replaceChildren(root);
}
