import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import CategoryCard from "./CategoryCard";
import { FOOD_ITEMS } from "../data";

type ExploreMenuSliderProps = {
  setActiveTab: (tab: "home" | "menu" | "about" | "contact") => void;
};

const ExploreMenuSlider = ({
  setActiveTab,
}: ExploreMenuSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
      }),
    ]
  );
  const scrollPrev = () => emblaApi?.scrollPrev();

const scrollNext = () => emblaApi?.scrollNext();

  const categories = Object.values(
    FOOD_ITEMS.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          title: item.category,
          image: item.image,
          count: 1,
        };
      } else {
        acc[item.category].count++;
      }

      return acc;
    }, {} as Record<
      string,
      {
        title: string;
        image: string;
        count: number;
      }
    >)
  );

  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">

          <h2 className="text-4xl font-bold text-yellow-400">
            What Are You Craving Today
          </h2>

          <p className="text-gray-400 mt-3">
            Explore Our Signature Dishes.
          </p>

        </div>

        <div className="max-w-7xl mx-auto px-10 relative">
          

  <button
    onClick={scrollPrev}
    className="absolute -left-16 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 shadow-xl hover:scale-110 transition"
  >
    <ChevronLeft />
  </button>

  <button
    onClick={scrollNext}
    className="absolute -right-16 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 shadow-xl hover:scale-110 transition"
  >
    <ChevronRight />
  </button>
  </div>

  <div
    className="overflow-hidden"
    ref={emblaRef}
  >
    <div className="flex">
      {categories.map((category) => (
        <div
          key={category.title}
          className="flex-[0_0_100%] md:flex-[0_0_50%] xl:flex-[0_0_25%] px-3"
        >
          <CategoryCard
    title={category.title}
    image={category.image}
    count={category.count}
    onClick={() => {
        localStorage.setItem("selectedCategory", category.title);
        setActiveTab("menu");
    }}
/>
        </div>
      ))}
    </div>
  </div>

</div>
    </section>
  );
  };

export default ExploreMenuSlider;