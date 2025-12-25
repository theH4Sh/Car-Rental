import { Link } from 'react-router-dom'
import { Car, ShieldCheck, Clock, HeartHandshake } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Trusted fleet',
    text: 'Every vehicle is inspected and maintained so you drive with confidence.',
  },
  {
    icon: Clock,
    title: 'Fast booking',
    text: 'Pick your dates, confirm in seconds, and hit the road without the paperwork maze.',
  },
  {
    icon: HeartHandshake,
    title: 'Support that shows up',
    text: 'Our team is here before, during, and after your rental if anything comes up.',
  },
]

const steps = [
  { step: '01', title: 'Browse', text: 'Explore available cars by brand, price, and style.' },
  { step: '02', title: 'Book', text: 'Choose your dates and reserve the car that fits your trip.' },
  { step: '03', title: 'Drive', text: 'Pick up, enjoy the ride, and leave a review when you’re done.' },
]

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4 space-y-16 pb-10">
      <section className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="flex-1 space-y-5 text-center lg:text-left">
          <p className="text-[#e93c3d] font-bold tracking-wide uppercase text-sm">About TOPCAR</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#331512] leading-tight">
            Built for people who love the drive
          </h1>
          <p className="text-[#513336] font-medium text-lg max-w-xl mx-auto lg:mx-0">
            TOPCAR makes renting a reputable car simple — whether you need a weekend getaway,
            a business trip upgrade, or something memorable for a special occasion.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/rent"
              className="bg-[#e93c3d] hover:bg-[#d13435] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse cars
            </Link>
            <Link
              to="/contact"
              className="border border-[#513336] text-[#513336] hover:bg-[#513336] hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
        <div className="w-full max-w-md lg:max-w-lg">
          <img src="/ferrari.png" alt="TOPCAR fleet" className="w-full object-contain" />
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-6">
        {[
          { label: 'Car brands', value: '50+' },
          { label: 'Happy clients', value: '10k+' },
          { label: 'Cities served', value: '25+' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-stone-200 bg-gradient-to-br from-[#faf7f5] to-white p-6 text-center"
          >
            <p className="text-4xl font-bold text-[#e93c3d]">{stat.value}</p>
            <p className="mt-2 font-semibold text-[#513336]">{stat.label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#331512]">What we stand for</h2>
          <p className="text-[#513336] mt-2 max-w-2xl mx-auto">
            A clear promise: quality cars, transparent pricing, and a booking flow that respects your time.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-2xl border border-stone-200 p-6 space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#e93c3d]/10 text-[#e93c3d] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#331512]">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-[#2c090a] text-white px-6 py-10 md:px-10">
        <div className="flex items-center gap-3 mb-8">
          <Car className="w-6 h-6 text-[#e93c3d]" />
          <h2 className="text-2xl md:text-3xl font-bold">How TOPCAR works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ step, title, text }) => (
            <div key={step} className="space-y-2">
              <p className="text-[#e93c3d] font-bold text-sm tracking-widest">{step}</p>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-stone-300 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About
