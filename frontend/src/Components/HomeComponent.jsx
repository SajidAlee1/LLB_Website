import React from 'react'

const HomeComponent = () => {
  return (
    <div>
      <div className='flex justify-center items-center w-full h-full'>
        <h1 className='text-center text-xl md:text-3xl font-bold border-b-3 border-green-500 px-2 inline-block mx-auto'>Undergraduate Degree In Law (LLB)</h1>
      </div>
      <br />
      <br />
      <div className='flex justify-between items-center'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
      <img src="/image/lawlogo.jpg" alt="law img" className='w-full h-full rounded-lg' />
      <div  className=" p-6 md:p-10 rounded-lg shadow-lg max-w-3xl mx-auto text-center">
      <h1 className="text-xl md:text-2xl font-bold  border-b-4 border-green-500 inline-block pb-2">About the LLB Website</h1>
      <br />
      <p  className="text-gray-700 text-justify leading-relaxed md:text-lg">This LLB website is designed to empower students at the University of Sindh by providing seamless access to essential learning materials. Our goal is to enhance knowledge, streamline the academic journey, and create a collaborative space where students can share insights, resources, and experiences.

By uniting LLB students on a single platform, we aim to foster a community of legal minds who support and inspire each other. From tracking academic activities throughout the year to expanding the reach of legal education beyond borders, this platform serves as a valuable hub for growth and knowledge-sharing.</p>
<br />
<p  className="text-gray-700 text-justify leading-relaxed md:text-lg">Join us in building a dynamic learning environment where students can connect, contribute, and excel in their legal studies.</p>
<p className="text-gray-800 text-justify leading-relaxed md:text-xl font-semibold mt-4">
  Created with 💼 by <span className="text-green-600 font-bold">Advocate Abdul Samad Nizamani</span> ⚖️
</p>
</div>
      </div>
      </div>
    </div>
  )
}

export default HomeComponent
