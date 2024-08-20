import React from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";
import "./editor.scss";

document.addEventListener("DOMContentLoaded", () => {
  const carouselElements = document.querySelectorAll(
    ".wp-block-literati-example-carousel",
  );

  carouselElements.forEach((element) => {
    // Get the transition time and promotions data
    const transitionTime =
      parseInt(element.getAttribute("data-transition-time"), 10) || 5;
    const promotions = JSON.parse(
      element.getAttribute("data-promotions") || "[]",
    );

    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: transitionTime * 1000,
      arrows: true,
    };

    // Render the carousel using ReactDOM
    ReactDOM.render(
      <Slider {...sliderSettings}>
        {promotions.map((promotion, index) => (
          <div key={index}>
            <h2>{promotion.header}</h2>
            <p>{promotion.text}</p>
            {promotion.image && (
              <img
                src={promotion.image}
                alt={promotion.title}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            {promotion.button && (
              <a href={promotion.button} className="button">
                READ MORE
              </a>
            )}
          </div>
        ))}
      </Slider>,
      element,
    );
  });
});
