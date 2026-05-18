'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';

const slides = [
  {
    image: '/hero1.jpg',
    subtitle: 'New Collection 2024',
    title: 'Redefine Your Style',
    desc: 'Discover the latest trends in fashion curated just for you.',
    link: '/collections',
    btnText: 'Explore Collection',
  },
  {
    image: '/hero2.jpg',
    subtitle: 'Summer Essentials',
    title: 'Effortless Elegance',
    desc: 'Premium fabrics, timeless designs, made for the modern you.',
    link: '/shop',
    btnText: 'Shop Now',
  },
  {
    image: '/hero3.jpg',
    subtitle: 'Limited Edition',
    title: 'Exclusive Drops',
    desc: 'Get your hands on our most wanted pieces before they sell out.',
    link: '/shop',
    btnText: 'View Products',
  },
];

export default function HeroSwiper() {
  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="hero-slide">
              <img src={slide.image} alt={slide.title} className="hero-bg" />
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="hero-subtitle">{slide.subtitle}</span>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-desc">{slide.desc}</p>
                <Link href={slide.link} className="hero-btn">{slide.btnText}</Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
