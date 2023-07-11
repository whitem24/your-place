import './globals.css';
import { Nunito } from 'next/font/google';
import Nabvar from './components/nabvar/Nabvar';
import LoginModal from './components/modals/LoginModal';
import RentModal from './components/modals/RentModal';
import SearchModal from './components/modals/SearchModal';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import getCurrentUser from './actions/getCurrentUser';
import ClientOnly from './components/ClientOnly';

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'Your place',
  description: 'Travel in the safest way',
  icons: {
     rel: 'icon',
     sizes: '48x48',
     url: '/icon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ClientOnly>
          <ToasterProvider/>
          <SearchModal/>
          <LoginModal/>
          <RegisterModal/>
          <RentModal/>
          <Nabvar currentUser={currentUser}/>
          
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div>
      </body>
    </html>
  )
}
