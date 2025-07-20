import React from 'react'

const Stats = () => {
  return (
     <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
                            <div className="text-gray-600">Monthly Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                            <div className="text-gray-600">Uptime Guarantee</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                            <div className="text-gray-600">Countries Supported</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                            <div className="text-gray-600">Customer Support</div>
                        </div>
                    </div>
                </div>
            </section>
  )
}

export default Stats