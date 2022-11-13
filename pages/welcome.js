import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Welcome() {
  return (
    <div className='h-full'>
      <Head>
        <title>Followgram - Welcome</title>
        <meta name="description" content="Followgram share posts & text with your friend" />
      </Head>

      <div className='flex flex-wrap m-3 md:py-10 lg:py-16'>
          <span className='md:w-1/2 w-full text-center'>
            <Image src={"/network.png"} height={300} width={300} />
          <hr className='block h-2 text-black md:hidden'/>
          </span>
          <span className='md:w-1/2 w-full text-center'>
            <Image src={"/social-media.png"} height={300} width={300} />
          </span>
      </div>
      <div className='text-center'>
        <p className='text-2xl font-bold'>Post wherever you are , whatever you are doing.. with your friends</p>
        <p className='text-xl'>Don't Register yet ? <Link href={"/signup"}><a className='font-bold px-2 hover:border-b-2 border-black '>Click here</a></Link></p>
      </div>
    </div>
  )
}
