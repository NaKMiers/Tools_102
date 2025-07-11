import Divider from '@/components/Divider'
import { LucideUploadCloud } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const navItems = [
  {
    title: 'Posting',
    href: '/posting',
    image: '/images/posting.png',
    icon: LucideUploadCloud,
  },
]
async function Home() {
  return (
    <div className="mx-auto h-full min-h-screen w-full max-w-[900px]">
      <Divider size={16} />

      <h1 className="font-body text-primary px-21 text-center text-4xl font-semibold tracking-widest">
        Tools 102
      </h1>

      <Divider size={10} />

      <div className="text-dark flex flex-wrap text-xl font-semibold">
        {navItems.map(link => (
          <div
            className="p-21-2 xs:w-1/2 w-full md:w-1/3 md:p-6 lg:p-8"
            key={link.href}
          >
            <Link
              href={link.href}
              className="group flex aspect-square w-full flex-col items-center justify-center gap-8 rounded-3xl bg-white p-8 shadow-lg"
            >
              <div className="trans-300 group-hover:scale-90">
                <Image
                  className="h-full w-full object-contain"
                  src={link.image}
                  width={200}
                  height={200}
                  alt={link.title}
                />
              </div>

              <h2 className="trans-200 font-body text-secondary text-center text-lg font-semibold tracking-wider md:text-2xl">
                {link.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>

      <Divider size={50} />
    </div>
  )
}

export default Home
