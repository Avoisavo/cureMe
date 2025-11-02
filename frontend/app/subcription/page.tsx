"use client";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ✨ PsyCatrist Time
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
            Choose Your Wellness Plan
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Start your journey to better mental health with our AI-powered
            virtual psychiatrist
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-10 border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
            <div className="text-center mb-8">
              <div className="inline-block bg-indigo-100 rounded-full p-3 mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Starter</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Begin your mental wellness journey
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RM0
                </span>
                <span className="text-gray-500 text-xl">/ month</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <FeatureItem text="Basic mood tracking and journaling" />
              <FeatureItem text="Daily mental health check-ins" />
              <FeatureItem text="AI-powered initial assessments" />
              <FeatureItem text="Access to wellness resources" />
              <FeatureItem text="Community support forum" />
              <FeatureItem text="Limited AI therapy sessions (3 per month)" />
              <FeatureItem text="Basic progress insights" />
            </div>

            {/* CTA Button */}
            <button className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              Start Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 lg:p-10 border-4 border-indigo-300 relative hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
            {/* Most Popular Badge */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                ⭐ Most Popular
              </span>
            </div>

            <div className="text-center mb-8 text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-3 mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3">Premium</h2>
              <p className="text-white/90 mb-6 text-lg">
                Complete mental health support at your fingertips
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-white">RM10</span>
                <span className="text-white/80 text-xl">/ month</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <FeatureItemPremium text="Everything in Starter plan" />
              <FeatureItemPremium text="Unlimited AI therapy sessions" />
              <FeatureItemPremium text="Advanced mood analytics & patterns" />
              <FeatureItemPremium text="Personalized treatment plans" />
              <FeatureItemPremium text="24/7 crisis support & resources" />
              <FeatureItemPremium text="Voice & video therapy sessions" />
              <FeatureItemPremium text="Sleep & wellness tracking" />
              <FeatureItemPremium text="Meditation & mindfulness exercises" />
              <FeatureItemPremium text="Family & relationship counseling" />
              <FeatureItemPremium text="Priority AI psychiatrist access" />
              <FeatureItemPremium text="Detailed progress reports & insights" />
              <FeatureItemPremium text="Export & share wellness data" />
            </div>

            {/* CTA Button */}
            <button
              onClick={() =>
                (window.location.href =
                  "https://buy.stripe.com/test_bJedRbahe0DF3lDbigdby02")
              }
              className="w-full py-4 px-6 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
            >
              Get Premium ✨
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Trusted by thousands of users worldwide
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// Feature Item Component for Free Tier
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className="w-5 h-5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className="text-gray-700 text-base leading-relaxed">{text}</span>
    </div>
  );
}

// Feature Item Component for Premium Tier
function FeatureItemPremium({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className="text-white text-base leading-relaxed font-medium">
        {text}
      </span>
    </div>
  );
}
