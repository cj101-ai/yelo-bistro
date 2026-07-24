type CategoryCardProps = {
  title: string;
  image: string;
  count: number;
  onClick?: () => void;
};

const CategoryCard = ({
  title,
  image,
  count,
  onClick,
}: CategoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-900 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-2xl font-bold text-white">
            {title}
          </h3>

          <p className="mt-2 text-white/80">
            {count} delicious {title.toLowerCase()}
          </p>

          <div className="mt-4 inline-flex items-center rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition group-hover:bg-red-500">
            Explore →
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;