import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)

    // No contact API yet — simulate a successful send
    setTimeout(() => {
      toast.success('Message sent! We’ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setSending(false)
    }, 600)
  }

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4 space-y-10 pb-10">
      <div className="text-center md:text-left space-y-2">
        <p className="text-[#e93c3d] font-bold tracking-wide uppercase text-sm">Contact</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#331512]">Get in touch</h1>
        <p className="text-[#513336] font-medium max-w-2xl">
          Questions about a booking, the fleet, or partnership? Send a message — we’re happy to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[
            {
              icon: MapPin,
              title: 'Visit us',
              text: '12 Fleet Street\nDowntown Auto District',
            },
            {
              icon: Phone,
              title: 'Call',
              text: '+1 (555) 014-2200',
            },
            {
              icon: Mail,
              title: 'Email',
              text: 'hello@topcar.rent',
            },
            {
              icon: Clock,
              title: 'Hours',
              text: 'Mon–Sat · 8:00 – 20:00\nSunday · 10:00 – 16:00',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-stone-200 p-4 bg-gradient-to-br from-[#faf7f5] to-white"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e93c3d]/10 text-[#e93c3d] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#331512]">{item.title}</h3>
                  <p className="text-sm text-gray-500 whitespace-pre-line mt-1">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 shadow-xl p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              id="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] resize-none"
              placeholder="Tell us a bit more…"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto px-8 py-3 bg-[#e93c3d] hover:bg-[#d13435] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
