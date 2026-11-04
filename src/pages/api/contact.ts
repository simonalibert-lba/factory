import type { APIRoute } from 'astro';

// Exécutée à la demande (fonction Vercel), le reste du site est statique.
export const prerender = false;

interface ContactPayload {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  societe: string;
  sujet: string;
  message: string;
}

const MAX = { court: 120, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Limite simple par instance (fenêtre glissante) ; suffisante contre les envois en rafale.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

function field(form: FormData, name: keyof ContactPayload, max: number): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

function reply(status: number, body: { ok: boolean; error?: string }, request: Request): Response {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  if (!wantsJson) {
    // Envoi sans JavaScript : retour sur la page avec un indicateur
    return Response.redirect(new URL(body.ok ? '/?envoi=ok#contact' : '/?envoi=erreur#contact', request.url), 303);
  }
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return reply(400, { ok: false, error: 'Requête invalide.' }, request);

  // Champ piège : rempli uniquement par les robots, on répond « ok » sans rien envoyer.
  const trap = form.get('site_web');
  if (typeof trap === 'string' && trap.length > 0) return reply(200, { ok: true }, request);

  if (tooMany(clientAddress ?? 'inconnu')) {
    return reply(429, { ok: false, error: 'Trop d’envois rapprochés. Réessayez dans quelques minutes.' }, request);
  }

  const data: ContactPayload = {
    nom: field(form, 'nom', MAX.court),
    prenom: field(form, 'prenom', MAX.court),
    email: field(form, 'email', MAX.court),
    tel: field(form, 'tel', MAX.court),
    societe: field(form, 'societe', MAX.court),
    sujet: field(form, 'sujet', MAX.court),
    message: field(form, 'message', MAX.message),
  };

  if (!EMAIL_RE.test(data.email)) return reply(422, { ok: false, error: 'L’adresse e-mail semble incorrecte.' }, request);
  if (data.message.length < 10) return reply(422, { ok: false, error: 'Votre message est un peu court.' }, request);

  const apiKey = import.meta.env['BREVO_API_KEY'] as string | undefined;
  const to = import.meta.env['CONTACT_TO'] as string | undefined;
  const from = import.meta.env['CONTACT_FROM'] as string | undefined;
  if (!apiKey || !to || !from) {
    console.error('[contact] configuration manquante (BREVO_API_KEY, CONTACT_TO, CONTACT_FROM)');
    return reply(500, { ok: false, error: 'Le formulaire n’est pas encore configuré. Écrivez-nous directement.' }, request);
  }

  const name = [data.prenom, data.nom].filter(Boolean).join(' ') || data.email;
  const rows = (Object.entries(data) as [keyof ContactPayload, string][])
    .filter(([k, v]) => k !== 'message' && v)
    .map(([k, v]) => `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
    .join('');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: from, name: 'Site LBA Factory' },
      to: [{ email: to }],
      replyTo: { email: data.email, name },
      subject: `Contact site : ${data.sujet || 'nouveau message'} (${name})`,
      htmlContent: `<table>${rows}</table><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`,
      textContent: `${Object.entries(data).map(([k, v]) => `${k} : ${v}`).join('\n')}`,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error('[contact] échec Brevo', res?.status);
    return reply(502, { ok: false, error: 'Envoi impossible pour le moment. Réessayez ou écrivez-nous directement.' }, request);
  }
  return reply(200, { ok: true }, request);
};
