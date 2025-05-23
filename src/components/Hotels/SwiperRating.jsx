import { useState, useEffect } from "react";
import styles from "./Swiper.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import { getTopRating } from "@api/getHotelApi";
import { SkeletonHotels } from "@components/Skeleton/SkeletonHotels";
import ErrorMessage from "@components/ErrorMessage/ErrorMessage";
import star from "../../assets/images/filled-star-icon.svg";
import { motion } from "framer-motion";
import { animationsHotels } from "./animations";

const SwiperRating = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const imagesBaseUrl = import.meta.env.VITE_IMAGES_BASE_URL;

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        const data = await getTopRating();
        setHotels(data.topRatedHotels);
      } catch (err) {
        setError(err.massage);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  let content;
  if (loading) {
    content = <SkeletonHotels />;
  } else if (error) {
    content = <ErrorMessage />;
  } else {
    content = (
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={animationsHotels.swiper}
        viewport={{ once: true, amount: 0.5 }}
      >
        <Swiper
          modules={[Scrollbar]}
          spaceBetween={25}
          scrollbar={{ hide: false }}
          grabCursor={true}
          slidesPerView="auto"
          loop={true}
          className={styles["swiper-rating"]}
        >
          {hotels.map((hotel) => (
            <SwiperSlide className={styles["swiper-slide"]} key={hotel.id}>
              <article>
                <section className={styles["section-img"]}>
                  <img src={`${imagesBaseUrl}${hotel.hotel_photos}`} alt="" />
                </section>
                <section className={styles["section-info"]}>
                  <div>
                    <p className={styles["hotel-location"]}>
                      {hotel.country}, {hotel.city}
                    </p>
                    <h4 className={styles["hotel-mane"]}>{hotel.name}</h4>
                    <div className={styles["stars"]}>
                      {[...Array(Number(hotel.star_rating) || 0)].map(
                        (_, index) => (
                          <img
                            key={`star-${index + 1}`}
                            src={star}
                            alt="Star"
                            className={styles["star-icon"]}
                          />
                        )
                      )}
                    </div>
                    <p className={styles["hotel-review-rating"]}>
                      <span className={styles["rating"]}>
                        {isNaN(Number(hotel.average_rating))
                          ? 0
                          : Number(hotel.average_rating).toFixed(1)}
                      </span>{" "}
                      {hotel.review_count} відгуків
                    </p>
                  </div>
                  <ul className={styles["amenities-list"]}>
                    {Array.isArray(hotel.amenities) &&
                    hotel.amenities.length > 0 ? (
                      hotel.amenities.map((amenity, index) => (
                        <li key={`amenity-${index + 1}`}>{amenity}</li>
                      ))
                    ) : (
                      <li>без опису</li>
                    )}
                  </ul>
                </section>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    );
  }

  return (
    <section className="container">
      <motion.h3
        initial="hidden"
        whileInView="visible"
        variants={animationsHotels.text}
        viewport={{ once: true, amount: 0.5 }}
        className={styles["title-rating"]}
      >
        Бестселери
      </motion.h3>
      <motion.p
        initial="hidden"
        whileInView="visible"
        variants={animationsHotels.text}
        viewport={{ once: true, amount: 0.5 }}
        className={styles["text"]}
      >
        Готелі, які найчастіше бронюють наші клієнти
      </motion.p>
      {content}
    </section>
  );
};

export default SwiperRating;
