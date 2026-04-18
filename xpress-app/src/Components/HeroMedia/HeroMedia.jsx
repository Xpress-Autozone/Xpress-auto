import React, { useState, useEffect, useRef } from "react";

/**
 * HeroMedia Component
 * Handles the transition from a placeholder image to a video once buffered.
 * 
 * @param {string} type - 'video' or 'image'
 * @param {string} src - Image source (for 'image' type)
 * @param {string} poster - Poster image source (for 'video' type)
 * @param {string} videoWebm - WebM video source
 * @param {string} videoMp4 - MP4 video source
 * @param {boolean} isActive - Whether this media is currently active in the sequence
 */
const HeroMedia = ({ 
  type, 
  src, 
  poster, 
  videoWebm, 
  videoMp4, 
  isActive 
}) => {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (type === "video" && videoRef.current) {
      if (isActive && isReady) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("[HeroMedia] Autoplay blocked or failed:", error);
          });
        }
      } else {
        videoRef.current.pause();
        if (!isActive) {
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, [isActive, isReady, type]);

  const handleCanPlayThrough = () => {
    console.log(`[HeroMedia] Video ready: ${videoMp4}`);
    setIsReady(true);
  };

  if (type === "image") {
    return (
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isActive ? "opacity-60" : "opacity-0"
        }`}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        isActive ? "opacity-60" : "opacity-0"
      }`}
    >
      {/* Poster Image - Shown until video is ready OR as a fallback */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          isReady && isActive ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: `url(${poster})` }}
      />

      {/* Video Element */}
      <video
        ref={videoRef}
        onCanPlayThrough={handleCanPlayThrough}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={videoWebm} type="video/webm" />
        <source src={videoMp4} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroMedia;
