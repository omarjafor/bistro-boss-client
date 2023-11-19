
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import FoodCard from "../../../Components/FoodCard/FoodCard";

const OrderTab = ({ items }) => {

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };

    return (
        <div >
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div className='grid md:grid-cols-3 gap-10 my-10'>
                        {
                            items.slice(0, 6).map(item => <FoodCard
                                key={item._id}
                                item={item}
                            ></FoodCard>)
                        }
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='grid md:grid-cols-3 gap-10 my-10'>
                        {
                            items.slice(6, 12).map(item => <FoodCard
                                key={item._id}
                                item={item}
                            ></FoodCard>)
                        }
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='grid md:grid-cols-3 gap-10 my-10'>
                        {
                            items.slice(12, 18).map(item => <FoodCard
                                key={item._id}
                                item={item}
                            ></FoodCard>)
                        }
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default OrderTab;