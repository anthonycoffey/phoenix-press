import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, RangeControl } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
  const { transitionTime = 5 } = attributes;

  // Fetch published promotions
  const promotions = useSelect((select) => {
    return select("core").getEntityRecords("postType", "promotion", {
      status: "publish",
      _embed: true,
      per_page: -1,
    });
  }, []);

  // Slider settings with adjusted speed and autoplay speed
  const sliderSettings = {
    centerMode: true,

    dots: false,
    infinite: true,
    speed: 500, // Duration of the transition effect (in milliseconds)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: transitionTime * 1000, // Time between slides (in milliseconds)
    arrows: true,
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__("Settings", "literati-example-carousel")}>
          <RangeControl
            label={__("Transition Time (seconds)", "literati-example-carousel")}
            value={transitionTime}
            onChange={(value) => setAttributes({ transitionTime: value })}
            min={1}
            max={10}
          />
        </PanelBody>
      </InspectorControls>
      <div className="wp-block-literati-example-carousel">
        {promotions && promotions.length > 0 ? (
          <Slider {...sliderSettings}>
            {promotions.map((promotion) => (
              <div key={promotion.id}>
                <div className="card">
                  <div className="image">
                    {promotion._promotion_image && (
                      <img
                        src={promotion._promotion_image}
                        alt={promotion.title.rendered}
                      />
                    )}
                  </div>
                  <div className="content">
                    <h2>{promotion.title.rendered}</h2>
                    <p>{promotion._promotion_text}</p>

                    {promotion._promotion_button && (
                      <a href={promotion._promotion_button} className="button">
                        READ MORE
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p>{__("No promotions found", "literati-example-carousel")}</p>
        )}
      </div>
    </div>
  );
}
