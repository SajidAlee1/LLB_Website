import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeComponent from "./HomeComponent";

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    fade:true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setActiveSlide(next),
    afterChange: current => setActiveSlide2(current),
  };

  return (
    <div className="relative z-0 min-h-screen w-full">
      <Slider {...settings} className="w-full overflow-hidden">
        <div>
          <img src="/image/lawlogo.jpg" alt="Slide 1" className=" w-full h-96 rounded-lg" />
        </div>
        <div>
          <img src="/image/lawlogo2.webp" alt="Slide 1" className=" w-full h-96 rounded-lg" />
        </div>
        <div>
          <img src="/image/carousalimg1.jpg" alt="Slide 1" className=" w-full h-96 rounded-lg" />
        </div>
        <div>
        <img src="/image/carousalimg2.jpg" alt="Slide 1" className="w-full h-96 rounded-lg" />
        </div>
        <div>
        <img src="/image/carousalimg3.jpg" alt="Slide 1" className="w-full h-96 rounded-lg" />
        </div>
        <div>
        <img src="/image/carousalimg4.jpg" alt="Slide 1" className="w-full h-96 rounded-lg" />
        </div>
      </Slider>
      <br />
      <br />
      <br className=" hidden md:block" />
      <br className=" hidden md:block" />
      <HomeComponent/>
      </div>
    
  );
}

export default Home;
