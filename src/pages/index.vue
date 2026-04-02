<template>
  <main class="flex flex-col">
    <section class="px-6 lg:px-20 py-8">
      <div
        class="relative overflow-hidden rounded-xl bg-slate-200 min-h-[500px] flex flex-col items-center justify-center text-center p-8 lg:p-16"
      >
        <div class="absolute inset-0 z-0">
          <img
            alt="A happy dachshund puppy playing in a garden"
            class="w-full h-full object-cover opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4JYF3EO3tCRRvreEDoMFXPFGMfeMl9FagS6axuSvq4yaDfC3hnQC8qdI4w7kxpZ2HpsSX4SFFSa_QZPJaHlY2onQtCI6zOuz8UfG6sH11OOHWei2FaFKX0-D2KYsdY1p_rin2QL-UYR7H_fQDkUjJ6z-im_9i1YUVannGaCivshGBYpgz0fpLdU0a4uSYYJtnurtjW7bfOoBoSxCN9JGfMhIXpHoktO0T7mhaOLQcNglwINsb1Y4RuwLUwwnFML2sfDJIDVFY-0A"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-3xl">
          <h1 class="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Celebrate the Doxie Life: Daily Logs, Curated Gear &amp; More
          </h1>
          <p class="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            Join the premium community for dachshund lovers. Discover curated boutique gear, daily
            stories, and local expert services.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              class="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-base font-bold hover:scale-105 transition-transform"
            >
              Explore Community
            </button>
            <button
              class="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white text-slate-900 text-base font-bold hover:bg-slate-50 transition-colors"
            >
              Shop Boutique
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 lg:px-20 py-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900">Daily Logs</h2>
          <p class="text-slate-500">Glimpses into the life of our favorite long friends.</p>
        </div>
        <button class="text-primary font-bold flex items-center gap-1 hover:underline">
          View all logs <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group cursor-pointer">
          <div class="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
            <img
              alt="Dachshund looking at a sunrise"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT8kL29gCLS9jNOpPBMOwcxPL7QHOEqbvuk5ew8JiuRXaNtwkHVfWQgpFpDSlhEwyDUUDb4r2H1q7bNIVeKwWdOoOvdbj-N4MBsOGveUpExoRvsApbq-i671jr5Z8h-rUwlLVk6ICZPdQFRaItmbQRugAvh1xPDPqRWP3efLu4VId5aEUS0pOfP1UustciyFKDQM6Pydi4VTFnteW5_6Wmgz0sPCbWUYaBpJgH9QMdILD9KXrjdkmDvwUIG8nnLO_pClu6e5-TlJY"
            />
            <div
              class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary"
            >
              Community
            </div>
          </div>
          <h3 class="text-lg font-bold group-hover:text-primary transition-colors">Morning Sunsets</h3>
          <p class="text-slate-500 text-sm line-clamp-2 mt-1">
            A peaceful start to the day as Cooper watches the early light hit the dew on the grass.
          </p>
        </div>

        <div class="group cursor-pointer">
          <div class="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
            <img
              alt="Cute dachshund playing with a toy"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFj-NQouzoRoSiMm0QgI0h-b0DMEbxcVp9AN0pVd7oTT9OekbTGArFdheiWSXriQGHR3_el-o2DyFekF-ladtP5nxKef0VFT_Z4yksK5VD2OzDksE-oKZjXz63ex0gnz9cAqzxC03S9c1c2Fb_kcjVEbp3WsegM_OMzBnK6WJx56-hj8FEBaR_Az-F1EQLAnGO8knpi1cseXV0AigJNAwXe4Y1nRhxY3caWH_7ujb78Dj1AyUGzANe0mC96Qx5iqKqMTx1qLxs6rA"
            />
            <div
              class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary"
            >
              Product Test
            </div>
          </div>
          <h3 class="text-lg font-bold group-hover:text-primary transition-colors">New Toy Alert</h3>
          <p class="text-slate-500 text-sm line-clamp-2 mt-1">
            Testing the latest organic cotton squeaky plush. Verdict: Tail wags were off the charts!
          </p>
        </div>

        <div class="group cursor-pointer">
          <div class="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
            <img
              alt="Dachshund in autumn leaves"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuooncApxi7nsLpvKMLzALLHdSJtSWXRKYZnK4wCTX9nXyexkb8poLBeN91QVnRuGBckoBIl2RQd_KKjpQT2iCFiNnCJ_i2MGtJlcg6L3yRB_6iI95jXNfAOa6gxMe33g6nFwYfHsUjGKeabBM5Vi4CFCcf93F4B0ClMX4xYAsJV1bOY81RVxmKEy64HL_wzxssMrxqNl-OcLNuNLr57gXjKRulYCiH0ThfnMPIJ0ik-Y0hvY-pFIuBllFYj9k_MRhYStSVrDR4xY"
            />
            <div
              class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary"
            >
              Adventure
            </div>
          </div>
          <h3 class="text-lg font-bold group-hover:text-primary transition-colors">Park Adventures</h3>
          <p class="text-slate-500 text-sm line-clamp-2 mt-1">
            Running through the autumn leaves can be a challenge for short legs, but we managed!
          </p>
        </div>
      </div>
    </section>

    <section class="bg-primary/5 py-20 px-6 lg:px-20">
      <div class="flex flex-col lg:flex-row gap-12 items-center">
        <div class="lg:w-1/2">
          <h2 class="text-primary text-sm font-bold uppercase tracking-widest mb-4">
            Exclusively Curated
          </h2>
          <h3 class="text-3xl md:text-5xl font-extrabold mb-6">The Doxie Boutique</h3>
          <p class="text-slate-600 text-lg mb-8">
            We source only the best products specifically designed for the unique anatomy and playful
            spirit of dachshunds. From custom-fit sweaters to spine-friendly ramps.
          </p>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-primary/10">
              <span class="material-symbols-outlined text-primary mb-2">check_circle</span>
              <h4 class="font-bold">Spine-Safe Gear</h4>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-primary/10">
              <span class="material-symbols-outlined text-primary mb-2">check_circle</span>
              <h4 class="font-bold">Organic Treats</h4>
            </div>
          </div>

          <button
            class="bg-primary text-white font-bold h-14 px-10 rounded-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Shop the Boutique
            <span class="material-symbols-outlined">shopping_cart</span>
          </button>
        </div>

        <div class="lg:w-1/2 grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-4">
            <div class="bg-white p-2 rounded-xl shadow-md rotate-[-2deg]">
              <img
                alt="Dog sweater"
                class="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkci9nvuMWImb4Ug4ewJ7-GBE1uEy_PBAat82k43fz5SHzPol0zjyT3Gg9ANb2L2JiWccrSZGAArSf2b6dAhDRN54b2ccDU6t0trbdpFGeGIDTL_VTfleJkJmYd7ljIDAeifbLj0iihSl2p2yFgxi_FZlRYdZdL3ULzCwO8txeqArZZa14a1LTpFxdCGyNMlIcFgXih7u3pIW97cG1fwclLdGbhmtS33f1TB1UDlnUxk25AF54ZzwTx6eOy8_3C_-tTAaMPj5uAY8"
              />
              <p class="text-center font-bold text-sm py-2">Cozy Knits</p>
            </div>

            <div class="bg-white p-2 rounded-xl shadow-md rotate-[3deg]">
              <img
                alt="Organic treats"
                class="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGxHUQgRpz0efR2NOfSKE9f1ck_6rqr77qWbs2irghvUPHi1F7peXjRQImpNDdesFNz_Wrbcx1dmMoIgXc3BTb_CtoPu_eWAsna_qLAC8L1z39zFTDgueF7TMqHi9ylzOeiuoKRXXnPljDm7h3MK_aHRPZl0p3_nJdfQtQPifTzogLycLiEQkGtPWHxUl9ItEI7ESysCsmnbY7F65MouUaUj9I5IcG_tZu7hU5vDdcAdGDgHK6cVqCwqazDAB2brYpo7KyyF7zl9E"
              />
              <p class="text-center font-bold text-sm py-2">Daily Chews</p>
            </div>
          </div>

          <div class="flex flex-col gap-4 mt-8">
            <div class="bg-white p-2 rounded-xl shadow-md rotate-[2deg]">
              <img
                alt="Dog toys"
                class="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDFPUIdk05vKAkRfZDpcrNDD9XRIYG3KStJU2bTnXaeUbRQqxMKp5PnAUiZKKpgGXVnaPFX8Wj3jjvXPJmW6cJlN6UaYEcw3FB0JT4KlzSzpKDsuQqRKr5lPUj0fqmltv8CnDwl7XMUCv-7qgLW2HXO-Ok5XIby4hWxg8reo6JVU_cTaFbKOuVweIYAlMQqfX-dg552f0_rMIhgS4qBhNKi62LRHGUKh6IJLh6bsiKA1uYUypRtdLZsa1YuSD-irVJgjIw0zLqTV4"
              />
              <p class="text-center font-bold text-sm py-2">Tough Toys</p>
            </div>

            <div class="bg-white p-2 rounded-xl shadow-md rotate-[-3deg]">
              <img
                alt="Harness"
                class="rounded-lg w-full h-48 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVWVhHomnNamVTcuLDW-U6n0kH4_6GGbugC60FkU4xLhca56xwapEMmlo8RZffAkrdvJcKzlM8Nsn28oK39DyyqC9xNHLr31cJExJ3Mk7ZorDqAB3mJqXY9cxyNR_Ay1hqgXQKhvWkMpISnPimGuR821PgpaKEWlQJO1skDMDznKTPMQgTkbJ1w3svuDGx8zhIlIFB1z28-Ncfs0vviRg4ceZDV3AyNTtMHdJ40dMFzzYvtszpgnzrvkvT7rgCEv1IMXtKaoeB5u0"
              />
              <p class="text-center font-bold text-sm py-2">Safe Harnesses</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 lg:px-20 py-20 bg-background-light">
      <div class="grid lg:grid-cols-3 gap-12">
        <div class="lg:col-span-1">
          <h2 class="text-3xl font-extrabold mb-4">Dog Service Discovery</h2>
          <p class="text-slate-500 mb-8">
            Find trusted, dachshund-friendly services right in your neighborhood.
          </p>

          <div class="space-y-4">
            <div class="bg-white p-4 rounded-xl flex gap-4 items-center border border-slate-200">
              <div
                class="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined">health_and_safety</span>
              </div>
              <div>
                <h4 class="font-bold">Vet-Ready Experts</h4>
                <p class="text-xs text-slate-500">IVDD Specialists nearby</p>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl flex gap-4 items-center border border-slate-200">
              <div
                class="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined">content_cut</span>
              </div>
              <div>
                <h4 class="font-bold">Top Groomers</h4>
                <p class="text-xs text-slate-500">Long-hair &amp; Wire-hair specialists</p>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl flex gap-4 items-center border border-slate-200">
              <div
                class="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined">hotel</span>
              </div>
              <div>
                <h4 class="font-bold">Doxie Sitter Network</h4>
                <p class="text-xs text-slate-500">Safe homes for short-legged friends</p>
              </div>
            </div>
          </div>

          <button
            class="w-full mt-6 border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary hover:text-white transition-all"
          >
            Find Services Near You
          </button>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div class="flex items-center gap-4 mb-6">
              <span class="material-symbols-outlined text-primary text-3xl">lightbulb</span>
              <h3 class="text-2xl font-bold">Expert Tip of the Week</h3>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
              <div class="md:w-1/3">
                <img
                  alt="Dachshund jumping"
                  class="rounded-xl w-full h-40 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB47RKzGnrltvBEbxxG8FHB4jVZ0OnUp3n24oNQ9E_OJXOV18CnE8r7soxRVoqXDO3qBFO37EAvnBxl1U9cZr4lRI_aq0UcSH_SYopFcp7PsXOmN06rIAxvFYZqDH8hKFrXXpXxHHFlvZ3DxC4eo-E4pdX0AH4omcSonMV2KLGPcZ7pg0442n1dqsLyYpv2uP217_cB4zpRZEg_RwQuXvexqy34NHyWEgh_H0geMA7tF-1yEqNDH8whDGc0VbZOb6T0VGaHN4598ZE"
                />
              </div>

              <div class="md:w-2/3">
                <h4 class="text-xl font-bold mb-2">Protecting the Doxie Spine</h4>
                <p class="text-slate-600 mb-4 leading-relaxed">
                  Avoid letting your dachshund jump from high furniture. Their elongated spine is
                  susceptible to IVDD. Invest in ramps for the couch and bed to keep their backs safe
                  and healthy for years to come.
                </p>
                <a class="text-primary font-bold flex items-center gap-1" href="#">
                  Read Health Guide
                  <span class="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>