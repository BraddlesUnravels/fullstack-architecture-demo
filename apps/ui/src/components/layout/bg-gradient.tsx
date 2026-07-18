import { component$, Slot } from '@builder.io/qwik';

export default component$(() => (
  <div
    id="bg-gradient-wrapper"
    class="relative min-h-dvh w-full overflow-hidden bg-[#06111b] text-slate-100"
  >
    {/* Base dark navy gradient */}
    <div
      id="bg-gradient-base"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#070f1a_0%,#111936_28%,#0b1b2c_54%,#06151d_78%,#051018_100%)]"
    />

    {/* Soft violet / indigo glow - upper left */}
    <div
      id="violet-glow-upper-left"
      aria-hidden="true"
      class="pointer-events-none absolute -left-10 -top-32 h-[34rem] w-[44rem] rounded-full bg-indigo-500/22 blur-[140px]"
    />

    {/* Dark diagonal wash - keeps top right deep */}
    <div
      id="dark-blue-diagonal"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_0%,transparent_30%,rgba(5,15,29,0.32)_52%,rgba(3,10,20,0.74)_100%)]"
    />

    {/* Soft edge vignette */}
    <div
      id="edge-vignette"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(2,6,12,0.34)_100%)]"
    />

    {/* Teal / blue glow radiating from lower-left corner */}
    <div
      id="teal-glow-lower-left"
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-[32rem] -left-[28rem] h-[76rem] w-[82rem] bg-[radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.42)_0%,rgba(20,184,166,0.28)_30%,rgba(14,116,144,0.16)_52%,transparent_74%)] blur-[80px] mix-blend-screen"
    />

    {/* Dim teal / cyan glow - lower right */}
    <div
      id="teal-glow-bottom-right"
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-56 -right-40 h-[42rem] w-[56rem] rounded-full bg-cyan-400/18 blur-[170px] mix-blend-screen"
    />

    {/* Soft inner teal lift - lower right / centre */}
    <div
      id="soft-teal-lift"
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[-18rem] right-24 h-[34rem] w-[42rem] rounded-full bg-teal-300/10 blur-[150px] mix-blend-screen"
    />

    <div>
      <Slot />
    </div>
  </div>
));
