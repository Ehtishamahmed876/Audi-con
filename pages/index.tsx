import Image from 'next/image'
import { Inter } from 'next/font/google'
import AudioVisualization from './audio'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
 
    <div className=' h-screen bg-gray-600 p-3'>
    <h1 className='text-center bg-black rounded-lg p-5 font-sans font-bold text-xl text-white'>Audio Visualization</h1>
    <AudioVisualization />

  </div>

  )
}
