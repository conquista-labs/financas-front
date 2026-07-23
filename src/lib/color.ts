/**
 * Realce automático de cor de categoria (regra de negócio de UI).
 *
 * Cores de categoria vêm dos dumps com tons pastéis/parecidos. Para garantir
 * legibilidade e diferenciação tanto no tema claro quanto no escuro, a UI
 * converte a cor para HSL, força saturação >= 0.55 e luminosidade entre 0.40 e
 * 0.60, mantendo o matiz. O valor original (hex do backend) é preservado no
 * dado; o realce é aplicado apenas na exibição.
 *
 * Portado de `enhance()` do protótipo (design_handoff).
 */
export function enhance(hex?: string | null): string {
  const fallback = "#8E7CC3";
  if (!hex || hex[0] !== "#") return hex || fallback;

  let h = hex.slice(1);
  if (h.length === 8) h = h.slice(0, 6);
  if (h.length === 3)
    h = h
      .split("")
      .map((x) => x + x)
      .join("");

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  let hh = 0;
  let s = 0;
  const l = (mx + mn) / 2;

  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) hh = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) hh = (b - r) / d + 2;
    else hh = (r - g) / d + 4;
    hh /= 6;
  }

  s = Math.max(s, 0.55);
  const lClamped = Math.min(Math.max(l, 0.4), 0.6);

  const hue2 = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = lClamped < 0.5 ? lClamped * (1 + s) : lClamped + s - lClamped * s;
  const p = 2 * lClamped - q;
  const to = (v: number): string =>
    ("0" + Math.round(hue2(p, q, v) * 255).toString(16)).slice(-2);

  return "#" + to(hh + 1 / 3) + to(hh) + to(hh - 1 / 3);
}
