import React from 'react'

const CTA = () => {
  return (
     <section className="py-20 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join millions of users who trust Toking Allvez for their video meetings
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => routeTo('/auth')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            Start free trial
                        </button>
                        <button 
                            onClick={() => routeTo('/alajd123')}
                            className="border border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Join a meeting
                        </button>
                    </div>
                </div>
            </section>
  )
}

export default CTA