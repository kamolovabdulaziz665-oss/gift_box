import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index.js";
import { fetchDevices } from "../http/deviceApi.js";
import Participate from "../modals/Participate.js";
import { getImgSrc } from "../utils/getImgSrc.js";
import { observer } from "mobx-react-lite";

const About = observer(() => {
  const { device } = useContext(Context);
  const [participateVisible, setParticipateVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchDevices().then((data) => {
      // API возвращает { rows: [...] }, сохраняем массив напрямую
      device.setDevices(data.rows || []);
    });
  }, []);

  // Получаем товары из device store для карусели рекомендаций
  const allDevices = Array.isArray(device.devices) ? device.devices : device.devices?.rows || [];
  const recommendations = allDevices.slice(0, 5).map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    oldPrice: Math.round(item.price * 1.2), // Примерная старая цена
    discount: Math.round(Math.random() * 30 + 10), // Случайная скидка 10-40%
    img: getImgSrc(item.img) || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  }));

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (recommendations.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % recommendations.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [recommendations.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] font-sans text-[var(--color-text-primary)] pb-16">

      {/* FON BEZAKLARI (Luxury Light Theme) */}
      <div className="pointer-events-none absolute -right-32 top-0 h-[600px] w-[600px] rounded-full border border-[var(--color-accent)]/10 opacity-80" aria-hidden />
      <div className="pointer-events-none absolute left-[-20%] top-[10%] h-[500px] w-[500px] rounded-full bg-[var(--color-accent-soft)] blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute right-[-10%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-[#3b82f6]/5 blur-[150px]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply luxury-noise" aria-hidden />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* --- 1. ASOSIY QISM (Matn saqlanib, rasm dizayni klassik va jiddiyroq ko'rinishga o'tkazildi) --- */}
        <section className="relative flex flex-col items-center justify-between lg:flex-row pt-16 pb-16 gap-12 lg:gap-20">
          
          {/* ЛЕВАЯ ЧАСТЬ: Контент */}
          <div className="relative z-20 flex w-full flex-col items-start lg:w-[50%]">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[1px] w-12 bg-[var(--color-accent)]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                Eksklyuziv Sovg'alar
              </span>
            </div>
            
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Mo'jizani <br />
              <span className="italic font-light text-[var(--color-text-muted)]">kashf</span>{" "}
              <span className="bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] bg-clip-text text-transparent">
                Eting.
              </span>
            </h1>
            
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--color-text-muted)]">
              Biz oddiy daqiqalarni unutilmas xotiralarga aylantiruvchi dabdabali sovg'a qutilarini yaratamiz. Har bir detal mehr va e'tibor bilan tanlanadi.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <button onClick={() => setParticipateVisible(true)} className="group relative flex items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-text-primary)] px-8 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-text-primary)] hover:text-white active:scale-95">
                <span className="relative z-10">To'plamni ko'rish</span>
              </button>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Креативная анимация рекомендационных товаров */}
          <div className="relative w-full lg:w-[45%] flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000">
            <div className="relative w-full max-w-sm aspect-[3/4]">
              
              {/* Декоративная рамка сзади */}
              <div className="absolute -inset-4 rounded-3xl border border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent backdrop-blur-sm -rotate-3 transition-transform duration-700"></div>

              {/* Контейнер карточек */}
              <div className="relative w-full h-full">
                {recommendations.map((item, index) => {
                  const isActive = index === activeSlide;
                  return (
                    <div 
                      key={item.id}
                      className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-white transition-all duration-1000 ease-in-out transform ${
                        isActive 
                          ? "opacity-100 translate-y-0 scale-100 rotate-0 z-20" 
                          : "opacity-0 translate-y-12 scale-90 rotate-2 z-10 pointer-events-none"
                      }`}
                    >
                      {/* Бейдж скидки */}
                      <div className="absolute top-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-sm font-bold text-white shadow-lg animate-bounce-slow">
                        -{item.discount}%
                      </div>

                      {/* Изображение товара */}
                      <div className="relative h-[65%] w-full overflow-hidden">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isActive ? 'scale-110' : 'scale-100'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>

                      {/* Инфо о товаре */}
                      <div className="relative h-[35%] bg-white p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-1">Tavsiya etamiz</p>
                          <h3 className="font-display text-xl font-bold text-[var(--color-text-primary)] leading-tight line-clamp-2">
                            {item.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-end justify-between mt-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-2">
                              {item.oldPrice} UZS
                            </span>
                            <span className="text-lg font-extrabold text-[#3b82f6]">
                              {item.price} <span className="text-xs font-normal">UZS</span>
                            </span>
                          </div>
                          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-transform hover:scale-110 hover:bg-[var(--color-accent)] hover:text-white">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Пагинация (точки) под карточкой */}
              <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                {recommendations.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeSlide ? "w-6 bg-[var(--color-accent)]" : "w-1.5 bg-[var(--color-accent)]/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. MAHSULOT TOIFALARI (Ikonkalar, animatsiyalar, zamonaviy grid uslubi) --- */}
        <section className="py-16">
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">To'plamlarimiz</h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)] max-w-xl">
              Har bir ehtiyoj va did uchun maxsus yaratilgan sovg'a turlari.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Eksklyuziv Qutilar */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/60 p-8 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">Eksklyuziv Qutilar</h3>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">O'ziga xos dizayn va hashamatli detallarga ega mukammal qutilar.</p>
              </div>
            </div>

            {/* 2. Premium Shokoladlar */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/60 p-8 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[#3b82f6]/20 text-[#3b82f6] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">Shirinliklar</h3>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">Belgiya shokoladlari va eng sara ta'mlar uyg'unligi.</p>
              </div>
            </div>

            {/* 3. Parfyum va Aksessuarlar */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/60 p-8 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[#8b5cf6]/20 text-[#8b5cf6] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">Noyob Iforlar</h3>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">Jahon brendlari parfyumeriyasi va nozik dizayndagi aksessuarlar.</p>
              </div>
            </div>

            {/* 4. Noyob Guldastalar */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/60 p-8 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ec4899]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[#ec4899]/20 text-[#ec4899] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">Guldastalar</h3>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">Niderlandiyadan keltirilgan eng sarxil gullardan guldastalar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. MIJOZLAR FIKRI (Endi rasmsiz, faqat chiroyli matn va kartochkalar) --- */}
        <section className="py-16">
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Mijozlarimiz Fikrlari</h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)] max-w-xl">Haqiqiy daqiqalar va bizning xizmatimiz haqida samimiy so'zlar.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { text: "Turmush o'rtog'imga yubordim. Uning xursandchilik ko'z yoshlari barcha xarajatlarni oqladi. Har bir detal shunchaki mukammal darajada ishlangan. Ajoyib xizmat!", author: "Davron M." },
              { text: "Hamkorlarimiz lol qolishdi. Bu oddiy korporativ sovg'a emas, bu insonga bo'lgan chinakam e'tibor namunasi. Yana albatta buyurtma beramiz.", author: "Sevara K." },
              { text: "Qutini ochgandagi ifor... lentalarning nozikligi... va ayniqsa xattotlik maktubi. Men hech qachon bunday go'zal va o'ylangan sovg'a olmagandim.", author: "Zarina R." }
            ].map((review, i) => (
              <div key={i} className="relative rounded-[24px] bg-white p-8 border border-[var(--color-border)] shadow-sm transition-shadow hover:shadow-lg">
                {/* Orqa fondagi tirnoq belgisi (Watermark) */}
                <div className="absolute top-6 right-6 text-[var(--color-accent)] opacity-10 pointer-events-none">
                  <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>

                {/* Yulduzchalar */}
                <div className="flex gap-1 mb-6 text-[#fbbf24] relative z-10">
                  {[1, 2, 3, 4, 5].map(star => <svg key={star} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>

                {/* Fikr matni */}
                <p className="text-sm italic leading-relaxed text-[var(--color-text-muted)] mb-8 relative z-10">
                  "{review.text}"
                </p>

                {/* Mijoz ismi */}
                <div className="flex items-center gap-4 relative z-10 mt-auto">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-bold text-[var(--color-accent)]">
                    {review.author.charAt(0)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-primary)]">{review.author}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. MANZIL VA ALOQA (Zich va ixcham - o'zgarishsiz qoldirildi) --- */}
        <section className="py-12">
          <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white shadow-lg flex flex-col md:flex-row">
            <div className="w-full md:w-5/12 relative h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                alt="Butigimiz"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex w-full flex-col justify-center p-8 md:w-7/12 md:p-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">Butigimizga Tashrif Buyuring</h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-lg">
                To'plamlarimizni o'z ko'zingiz bilan ko'ring. Maxsus iforlarni his qiling, lentalarni tanlang va mutaxassislarimiz bilan birga o'z mukammal qutingizni yarating.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Manzil</h4>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Toshkent sh., Yunusobod tumani,<br />Amir Temur shoh ko'chasi, 15-uy</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Ish vaqti</h4>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Dush - Shan: 10:00 - 20:00<br />Yakshanba: Dam olish kuni</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Aloqa</h4>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">+998 90 123 45 67<br />info@luxurygifts.uz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Participate
        show={participateVisible}
        onHide={() => setParticipateVisible(false)}
      />
    </div>
  );
});

export default About;
