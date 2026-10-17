import type { ProfileQrStyle, QrCornerStyle } from "@/lib/profile-qr";

/**
 * The /qr generator keeps its style in page state; the profile-hub picker sits
 * deep inside the form. This tiny bridge lets the picker's "Opslaan" read the
 * design currently on screen without threading props through every layer.
 */
let current: { fgColor: string; bgColor: string; dotStyle: string } | null = null;

export function publishQrDesign(design: { fgColor: string; bgColor: string; dotStyle: string }): void {
  current = design;
}

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Maps generator styling onto the profile QR style stored in display_prefs.qrSettings. */
export function toProfileQrStyle(design: { fgColor: string; bgColor: string; dotStyle: string } | null): ProfileQrStyle {
  const fg = design && HEX.test(design.fgColor) ? design.fgColor : "#1A1A1A";
  const bg = design && HEX.test(design.bgColor) ? design.bgColor : "#FFFFFF";
  const dot = design?.dotStyle ?? "square";
  const cornerStyle: QrCornerStyle = dot === "dots" ? "dots" : /round|classy/.test(dot) ? "smooth" : "square";
  return { fgColor: fg, bgColor: bg, cornerStyle, emblem: true };
}

export function currentProfileQrStyle(): ProfileQrStyle {
  return toProfileQrStyle(current);
}
