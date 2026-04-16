<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
    <div class="lg:col-span-7 space-y-16">
      <section>
        <div class="flex items-center gap-4 mb-8">
          <span class="text-xs font-bold font-inter bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full">01</span>
          <h2 class="text-2xl font-extrabold tracking-tight uppercase">Shipping Information</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div class="flex flex-col gap-2">
            <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">First Name</label>
            <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Enter first name" type="text" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Last Name</label>
            <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Enter last name" type="text" />
          </div>
          <div class="md:col-span-2 flex flex-col gap-2">
            <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Address Line 1</label>
            <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Street address, P.O. box, company name" type="text" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">City</label>
            <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="City" type="text" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Postal Code</label>
            <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="ZIP/Postal Code" type="text" />
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-4 mb-8">
          <span class="text-xs font-bold font-inter bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full">02</span>
          <h2 class="text-2xl font-extrabold tracking-tight uppercase">Shipping Method</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="relative group cursor-pointer">
            <input checked class="peer sr-only" name="shipping" type="radio" />
            <div class="p-6 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary transition-all rounded-lg flex justify-between items-start">
              <div class="space-y-1">
                <p class="font-bold text-sm uppercase tracking-tight">Standard Logistics</p>
                <p class="text-[11px] text-on-surface-variant font-inter uppercase">3-5 Business Days</p>
              </div>
              <span class="text-sm font-bold">$12.00</span>
            </div>
          </label>
          <label class="relative group cursor-pointer">
            <input class="peer sr-only" name="shipping" type="radio" />
            <div class="p-6 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary transition-all rounded-lg flex justify-between items-start">
              <div class="space-y-1">
                <p class="font-bold text-sm uppercase tracking-tight">Express Precision</p>
                <p class="text-[11px] text-on-surface-variant font-inter uppercase">Next Day Delivery</p>
              </div>
              <span class="text-sm font-bold">$45.00</span>
            </div>
          </label>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-4 mb-8">
          <span class="text-xs font-bold font-inter bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full">03</span>
          <h2 class="text-2xl font-extrabold tracking-tight uppercase">Payment Method</h2>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-3 gap-4">
            <label class="cursor-pointer">
              <input checked class="peer sr-only" name="payment" type="radio" />
              <div class="py-4 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary text-center rounded-lg transition-all">
                <span class="material-symbols-outlined text-2xl">credit_card</span>
                <p class="text-[10px] font-bold uppercase mt-1">Card</p>
              </div>
            </label>
            <label class="cursor-pointer">
              <input class="peer sr-only" name="payment" type="radio" />
              <div class="py-4 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary text-center rounded-lg transition-all">
                <span class="material-symbols-outlined text-2xl">account_balance</span>
                <p class="text-[10px] font-bold uppercase mt-1">Wire</p>
              </div>
            </label>
            <label class="cursor-pointer">
              <input class="peer sr-only" name="payment" type="radio" />
              <div class="py-4 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary text-center rounded-lg transition-all">
                <span class="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <p class="text-[10px] font-bold uppercase mt-1">Digital</p>
              </div>
            </label>
          </div>
          <div class="bg-surface-container-low p-8 rounded-xl space-y-6">
            <div class="flex flex-col gap-2">
              <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Card Number</label>
              <div class="relative">
                <input class="w-full bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all pr-10" placeholder="0000 0000 0000 0000" type="text" />
                <span class="material-symbols-outlined absolute right-0 top-3 text-outline-variant">lock</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-8">
              <div class="flex flex-col gap-2">
                <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Expiry Date</label>
                <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="MM/YY" type="text" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">CVV</label>
                <input class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="123" type="text" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-outline-variant/10">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary text-3xl">verified</span>
          <div>
            <h4 class="font-bold text-xs uppercase">5-Year Industrial Warranty</h4>
            <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Every component is backed by our signature long-term performance guarantee.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary text-3xl">shield</span>
          <div>
            <h4 class="font-bold text-xs uppercase">Secure Transaction</h4>
            <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">AES-256 bit encryption protocols protect your technical procurement data.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-5">
      <div class="sticky top-32 space-y-6">
        <div class="bg-surface-container-lowest shadow-[0_40px_40px_-15px_rgba(45,51,56,0.06)] p-10 rounded-xl border border-outline-variant/5">
          <h3 class="text-xl font-extrabold tracking-tight uppercase mb-8">Order Summary</h3>
          <div class="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">
            <div v-for="item in summaryItems" :key="item.name" class="flex gap-4">
              <div class="w-20 h-20 bg-surface-container-highest rounded overflow-hidden flex-shrink-0">
                <img class="w-full h-full object-cover" :alt="item.name" :src="item.image" />
              </div>
              <div class="flex-grow flex flex-col justify-between py-1">
                <div>
                  <p class="text-xs font-bold uppercase">{{ item.name }}</p>
                  <p class="text-[10px] text-on-surface-variant font-inter uppercase">SKU: {{ item.sku }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-inter">QTY: {{ item.qty }}</span>
                  <span class="text-sm font-bold">{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-3 pt-8 border-t border-outline-variant/10 font-inter">
            <div class="flex justify-between text-[11px] uppercase tracking-wider text-on-surface-variant">
              <span>Subtotal</span>
              <span>$1,748.00</span>
            </div>
            <div class="flex justify-between text-[11px] uppercase tracking-wider text-on-surface-variant">
              <span>Shipping</span>
              <span>$12.00</span>
            </div>
            <div class="flex justify-between text-[11px] uppercase tracking-wider text-on-surface-variant">
              <span>Tax (EST)</span>
              <span>$140.80</span>
            </div>
            <div class="flex justify-between text-lg font-black uppercase pt-4 border-t border-outline-variant/10">
              <span>Total</span>
              <span class="text-primary">$1,900.80</span>
            </div>
          </div>
          <button class="w-full mt-10 bg-primary hover:bg-primary-dim text-on-primary py-5 rounded-md font-extrabold uppercase tracking-[0.15em] text-sm transition-all active:scale-95 shadow-lg shadow-primary/20" type="button">
            Complete Purchase
          </button>
          <div class="mt-8 flex justify-center gap-6 opacity-30">
            <span class="material-symbols-outlined text-2xl">payments</span>
            <span class="material-symbols-outlined text-2xl">universal_currency</span>
            <span class="material-symbols-outlined text-2xl">qr_code_2</span>
          </div>
        </div>
        <div class="bg-surface-container-low p-6 rounded-lg text-center">
          <p class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant leading-relaxed">
            By placing this order, you agree to the
            <a class="underline text-on-surface font-bold" href="#">General Terms of Industrial Supply</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Rayforce | Checkout',
  description: 'Checkout seguro para pedidos industriales Rayforce.',
})

const summaryItems = [
  {
    name: 'Alpha-9 Power Relay',
    sku: 'RF-2900-X',
    qty: '02',
    price: '$498.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpQZrfzGoI6PT6khTswt8th3tpRK7NJjSzAO3YcNbL62Nbf7KPcnR7JL7LSniLv5nI36ndkbw2tVFIYq7QO4tc2ytxBqeuKNkr9M35Tpwd-rO1JaJDMr50G3XubYGuYcGX7QAb6IEbrTOkGZVDsCiZ3gIuAKiD5izdYqSRYOm4TIERFdkyo2MGAIVHnJPNkIi500LMMVYz6TypyQn7myN707kOwDKvz5n81aRMzVaUzKDAnbiPgTRPquKdnWlxSCJxd-o2YYmfbVoj',
  },
  {
    name: 'Logic Controller S-4',
    sku: 'RF-LC88-P',
    qty: '01',
    price: '$1,250.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiU4dAQ-3lTy6PlT5MlCddUbx7jhHbw81RjQZpJqJh8NRtFYfMczuOwTgdJcPxoGlA9bS1keGVFyVYdlmCv4CX89erUzPBrNluPr8CrJnS9n57sKPhzQQmbJkOh3YLEqdfTPV6VbooLRN0HJvmy7qyrRuaJCkfxbQKCFWga_rpCGSpY2M_pwrTQWuKtMm0tI5tXirYE4WddVJXPyNAtcyEV5R3pb3BXxuV8-K-KRcAPX7Ed_37sOhOyK3HatL9P5fAlNvVLXlh8o4-',
  },
]
</script>

