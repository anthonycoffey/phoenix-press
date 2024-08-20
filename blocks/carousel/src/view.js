import React from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./view.scss";

document.addEventListener("DOMContentLoaded", () => {
  const carouselElements = document.querySelectorAll(
    ".wp-block-literati-example-carousel",
  );

  carouselElements.forEach((element) => {
    const transitionTime =
      parseInt(element.getAttribute("data-transition-time"), 10) || 5;
    const promotions = JSON.parse(
      element.getAttribute("data-promotions") || "[]",
    );

    const sliderSettings = {
      arrows: true,
      centerMode: true,
      dots: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: transitionTime * 1000,
    };

    ReactDOM.render(
      <>
        <Slider {...sliderSettings}>
          {promotions.map((promotion, index) => (
            <div key={index}>
              <div className="card">
                <div className="image">
                  {promotion.image && (
                    <img src={promotion.image} alt={promotion.title} />
                  )}
                </div>

                <div className="content">
                  <h2>{promotion.header}</h2>
                  <p>{promotion.text}</p>

                  {promotion.button && (
                    <a href={promotion.button} className="button">
                      READ MORE
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
        {/* <div class="wp-block-literati-example-carousel__controls">
          <div class="prev">
            <button onClick={() => sliderRef.current.slickPrev()}>
              <span class="dashicons dashicons-arrow-left-alt2"></span>
            </button>
          </div>
          <div class="next">
            <button onClick={() => sliderRef.current.slickNext()}>
              <span class="dashicons dashicons-arrow-right-alt2"></span>
            </button>
          </div>
        </div> */}
      </>,
      element,
    );
  });
});
