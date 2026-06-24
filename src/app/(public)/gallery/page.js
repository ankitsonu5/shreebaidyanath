"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlayCircle } from "react-icons/fa";

export default function PublicGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetchGallery();
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-cms/gallery`);
      const data = await res.json();
      if (data.success) {
        setPageData(data.page);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to fetch page data:", err);
      }
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imgObj) => {
    const img = imgObj.image;
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Banner Section */}
        <div
          className="relative bg-cover bg-center py-30 px-4 text-center overflow-hidden shadow-md text-white mb-12"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(153, 27, 27, 0.7), rgba(120, 53, 4, 0.7), rgba(66, 32, 6, 0.4))${
              pageData?.bannerImage
                ? `, url('${
                    pageData.bannerImage.startsWith("http")
                      ? pageData.bannerImage
                      : `${process.env.NEXT_PUBLIC_API_URL}/${pageData.bannerImage}`
                  }')`
                : ""
            }`,
            backgroundColor: !pageData?.bannerImage ? "#78350f" : "transparent"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,transparent_70%)]"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {pageData?.heroHeading || "Our Gallery"}
            </h1>
            <p className="text-amber-100/80 mt-4 max-w-xl mx-auto text-base leading-relaxed font-medium">
              {pageData?.heroSubheading || "Explore our latest moments and memories."}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full font-medium transition ${filter === "all" ? "bg-amber-600 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("photo")}
              className={`px-6 py-2 rounded-full font-medium transition ${filter === "photo" ? "bg-amber-600 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100"}`}
            >
              Photos
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`px-6 py-2 rounded-full font-medium transition ${filter === "video" ? "bg-amber-600 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100"}`}
            >
              Videos
            </button>
          </div>

          {(() => {
            const filteredImages = images.filter((img) => {
              if (filter === "all") return true;
              return img.mediaType === filter;
            });

            return loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500 text-lg">No media found for this category. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((item, index) => (
                  <div
                    key={item._id}
                    className="group relative rounded-2xl overflow-hidden bg-gray-200 aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setLightboxIndex(index)}
                  >
                    {item.mediaType === "video" && item.image === "video-link" && item.videoUrl ? (
                      <iframe src={item.videoUrl} className="w-full h-full border-0 pointer-events-none" title="Video" />
                    ) : item.mediaType === "video" ? (
                      <video src={getImageUrl(item)} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={getImageUrl(item)}
                        alt={item.title || "Gallery Item"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    
                    {item.mediaType === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                         <FaPlayCircle size={48} className="text-white/80 group-hover:text-white transition-colors" />
                      </div>
                    )}
                    
                    {item.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white p-4 font-medium text-lg truncate w-full">
                          {item.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (() => {
        const filteredImages = images.filter((img) => filter === "all" ? true : img.mediaType === filter);
        if (!filteredImages[lightboxIndex]) return null;
        
        const currentItem = filteredImages[lightboxIndex];
        return (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-amber-500 z-50 transition"
            >
              <FaTimes size={30} />
            </button>
            
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 z-50 p-2 transition"
                >
                  <FaChevronLeft size={40} />
                </button>
                <button
                  onClick={() => setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-500 z-50 p-2 transition"
                >
                  <FaChevronRight size={40} />
                </button>
              </>
            )}

            <div className="max-w-5xl max-h-screen relative flex flex-col items-center justify-center w-full h-full p-4">
              {currentItem.mediaType === "video" && currentItem.image === "video-link" && currentItem.videoUrl ? (
                <iframe
                  src={currentItem.videoUrl}
                  className="w-full h-[70vh] border-0 rounded shadow-xl"
                  allowFullScreen
                />
              ) : currentItem.mediaType === "video" ? (
                <video
                  src={getImageUrl(currentItem)}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] object-contain rounded shadow-xl"
                />
              ) : (
                <img
                  src={getImageUrl(currentItem)}
                  alt={currentItem.title || "Gallery"}
                  className="max-w-full max-h-[80vh] object-contain rounded shadow-xl"
                />
              )}
              
              {currentItem.title && (
                <div className="mt-4 text-center">
                  <p className="text-white text-xl font-medium tracking-wide">
                    {currentItem.title}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
      <Footer />
    </>
  );
}
