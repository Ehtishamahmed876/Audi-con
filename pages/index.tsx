import Image from 'next/image'
import { Inter } from 'next/font/google'
import AudioVisualization from './audio'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='bg-green-500'>
    <h1 className='text-center p-5 font-sans font-bold text-xl text-white'>Audio Visualization</h1>
    <AudioVisualization />
  </div>
  )
}
