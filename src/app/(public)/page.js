"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Banner Section Start */}
      <section className="relative w-full h-[70vh] md:h-[calc(100vh-140px)] overflow-hidden">
        <div className="w-full h-full relative flex items-center transition-all duration-700">
          <div className="absolute inset-0 z-0">
            <img
              src="/banner.webp"
              alt="banner"
              className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
            />
          </div>
        </div>
      </section>
      {/* Banner Section End */}

      {/* Baidyanath - India's Most Trusted Ayurvedic Brand Start */}
      <section>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Baidyanath - India's Most Trusted Ayurvedic Brand
            </h2>
          </div>
        </div>
      </section>
      {/* Baidyanath - India's Most Trusted Ayurvedic Brand End */}

      {/* Shop By Collections Start */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shop By Collections
            </h2>
            <div className="w-20 h-1 bg-amber-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {[
              {
                name: "Immunity Booster",
                img: "/shopbycolletions/immunitybooster.webp",
              },
              { name: "Pure Herbs", img: "/shopbycolletions/pure_herbs.webp" },
              { name: "Hair Care", img: "/shopbycolletions/hair_care.webp" },
              { name: "Remedies", img: "/shopbycolletions/remedies.webp" },
              {
                name: "Herbal Juices",
                img: "/shopbycolletions/herbal_juices.webp",
              },
              {
                name: "Health & Wellness",
                img: "/shopbycolletions/health_wellness.webp",
              },
              { name: "Diabetes", img: "/shopbycolletions/diabetes.webp" },
              {
                name: "Cough & Cold",
                img: "/shopbycolletions/cough_cold.webp",
              },
              {
                name: "Classical Range",
                img: "/shopbycolletions/classical_range.webp",
              },
              {
                name: "Chyawanprash",
                img: "/shopbycolletions/chyawanprash.webp",
              },
              { name: "Digestion", img: "/shopbycolletions/digestion.webp" },
              { name: "Honey", img: "/shopbycolletions/honey.webp" },
            ].map((collection, index) => (
              <div
                key={index}
                className="group flex flex-col items-center cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-amber-600 transition-all duration-300 shadow-md group-hover:shadow-xl">
                  <img
                    src={collection.img}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/shopbycolletions/immunitybooster.webp"; // Fallback to existing image
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                  {collection.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-200 uppercase tracking-wider text-sm">
              View All
            </button>
          </div>
        </div>
      </section>
      {/* Shop By Collections End */}

      {/* Discount Banner */}
      <section className="w-full">
        <img
          src="/herobanner.webp"
          alt="Ayurveda Consultation"
          className="w-full h-auto block"
          loading="lazy"
        />
      </section>

      {/* Deals of the Day Start */}
      <section className="bg-white py-12 md:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-5">
              Deals of the Day
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {[
              {
                name: "Immunity Booster",
                img: "/dealsofday/Chayanvit.webp",
              },
              { name: "Pure Herbs", img: "/dealsofday/Chyawanprash.webp" },
              { name: "Hair Care", img: "/dealsofday/Chyawanprash.webp" },
              { name: "Remedies", img: "/dealsofday/Chyawanprash.webp" },
              {
                name: "Herbal Juices",
                img: "/dealsofday/Chyawanprash.webp",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="group flex flex-col items-center cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent">
                  <img
                    src={collection.img}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/dealsofday/Chayanvit.webp"; // Fallback to existing image
                    }}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-800">
                  {collection.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-200 uppercase tracking-wider text-sm">
              View All
            </button>
          </div>
        </div>
      </section>
      {/* Deals of the Day End */}

      {/* Herbal Juices Start */}
      <section className="bg-white py-12 md:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-5">
              Herbal Juices
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {[
              {
                name: "Immunity Booster",
                img: "/dealsofday/Chayanvit.webp",
              },
              { name: "Pure Herbs", img: "/herbaljuices/Amla_Juice.webp" },
              { name: "Hair Care", img: "/herbaljuices/Amla_Juice.webp" },
              { name: "Remedies", img: "/herbaljuices/Amla_Juice.webp" },
              {
                name: "Herbal Juices",
                img: "/herbaljuices/Amla_Juice.webp",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="group flex flex-col items-center cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent">
                  <img
                    src={collection.img}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/herbaljuices/Amla_Juice.webp"; // Fallback to existing image
                    }}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-800">
                  {collection.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-200 uppercase tracking-wider text-sm">
              View All
            </button>
          </div>
        </div>
      </section>
      {/* Herbal Juices End */}

      {/* Discount Banner */}
      <section className="w-full mx-auto">
        <div className="flex gap-5 items-center justify-center">
          <div className="cursor-pointer">
            <img
              src="/offerbanner.webp"
              alt="Ayurveda Consultation"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
          <div className="cursor-pointer">
            <img
              src="/offerbanner.webp"
              alt="Ayurveda Consultation"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Start */}
      <section className="bg-white py-12 md:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-5">
              Best Sellers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {[
              {
                name: "Immunity Booster",
                img: "/bestsellers/kaishore.webp",
              },
              { name: "Pure Herbs", img: "/bestsellers/kaishore.webp" },
              { name: "Hair Care", img: "/bestsellers/kaishore.webp" },
              { name: "Remedies", img: "/bestsellers/kaishore.webp" },
              {
                name: "Herbal Juices",
                img: "/bestsellers/kaishore.webp",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="group flex flex-col items-center cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent">
                  <img
                    src={collection.img}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/bestsellers/kaishore.webp"; // Fallback to existing image
                    }}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-800">
                  {collection.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-200 uppercase tracking-wider text-sm">
              View All
            </button>
          </div>
        </div>
      </section>
      {/* Best Sellers End */}

      {/* New Launches Start */}
      <section className="bg-white py-12 md:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-5">
              New Launches
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {[
              {
                name: "Immunity Booster",
                img: "/bestsellers/kaishore.webp",
              },
              { name: "Pure Herbs", img: "/bestsellers/kaishore.webp" },
              { name: "Hair Care", img: "/bestsellers/kaishore.webp" },
              { name: "Remedies", img: "/bestsellers/kaishore.webp" },
              {
                name: "Herbal Juices",
                img: "/bestsellers/kaishore.webp",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="group flex flex-col items-center cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent">
                  <img
                    src={collection.img}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/bestsellers/kaishore.webp"; // Fallback to existing image
                    }}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-800">
                  {collection.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-200 uppercase tracking-wider text-sm">
              View All
            </button>
          </div>
        </div>
      </section>
      {/* New Launches End */}

      {/* Popular Products Start */}
      <section className="bg-white py-12 md:py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-5">
              Popular Products
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
            {[
              {
                name: "Immunity Booster",
                img: "/bestsellers/kaishore.webp",
              },
              { name: "Pure Herbs", img: "/bestsellers/kaishore.webp" },
              { name: "Hair Care", img: "/bestsellers/kaishore.webp" },
              { name: "Remedies", img: "/bestsellers/kaishore.webp" },
              {
                name: "Herbal Juices",
                img: "/bestsellers/kaishore.webp",
              },
            ].map((collection, index) => (
              <div
                key={index}
                className="group flex flex-col items-center cursor-pointer">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent">
                  <img
                    src={collection.img}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/bestsellers/kaishore.webp"; // Fallback to existing image
                    }}
                  />
                </div>
                <p className="text-center text-sm md:text-base font-semibold text-gray-800">
                  {collection.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-200 uppercase tracking-wider text-sm">
              View All
            </button>
          </div>
        </div>
      </section>
      {/* Popular Products End */}

      {/* Youtube Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/PWoNp1q8raU"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen></iframe>
          </div>
        </div>
      </section>

      {/* Blogs Section Start */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-100">
            <div className="flex-1 text-center translate-x-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Blogs
              </h2>
            </div>
            <a
              href="#"
              className="text-amber-600 font-semibold hover:underline flex items-center gap-1 group">
              View all{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Featured Blog - Left Side */}
            <div className="lg:col-span-8 group cursor-pointer">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img
                  src="/banner.webp"
                  alt="10 Morning Drinks for Weight Loss"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-4xl font-bold text-red-700 leading-tight group-hover:text-red-800 transition-colors">
                  10 Morning Drinks for Weight Loss
                </h3>
                <p className="text-xl md:text-2xl font-medium text-gray-700 border-l-4 border-amber-600 pl-4 py-1">
                  Reduce Belly Fat Naturally at Home
                </p>
              </div>
            </div>

            {/* Blogs List - Right Side */}
            <div className="lg:col-span-4 space-y-8 divide-y divide-gray-100">
              {[
                {
                  title:
                    "Broccoli Benefits: Nutritional Value, Health Advantages & How to Eat It Right",
                  date: "FEB 14, 2026",
                  img: "/banner.webp",
                },
                {
                  title:
                    "Ajwain Benefits: 7 Ayurvedic Health Benefits of Carom Seeds",
                  date: "JAN 29, 2026",
                  img: "/banner.webp",
                },
                {
                  title:
                    "How Dimag Paushtik Rasayan Supports Memory and Brain Nourishment",
                  date: "JAN 27, 2026",
                  img: "/banner.webp",
                },
              ].map((blog, idx) => (
                <div
                  key={idx}
                  className={`pt-8 first:pt-0 group cursor-pointer flex gap-4`}>
                  <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-20 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={blog.img}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm md:text-md font-bold text-gray-800 leading-tight line-clamp-3 group-hover:text-amber-700 transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                      {blog.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Blogs Section End */}
    </>
  );
}
