import Card from '../common/Card';

export default function FoodCard({ food, onMore }) {
  return (
    <Card className='flex h-[405px] w-[270px] shrink-0 flex-col overflow-hidden sm:w-[280px]'>
      <div className='h-[145px] w-full shrink-0 overflow-hidden'>
        <img
          src={food.image}
          alt={food.name}
          className='h-full w-full object-cover'
        />
      </div>

      <div className='flex flex-1 flex-col p-4'>
        <p className='min-h-[20px] font-body text-body-sm font-semibold text-text'>
          {food.category}
        </p>

        <h3 className='mt-2 h-[58px] overflow-hidden font-heading text-heading-lg font-semibold leading-tight text-text'>
          {food.name}
        </h3>

        <div className='mt-4 grid min-h-[44px] grid-cols-3 gap-2 font-body text-[13px] leading-snug text-text'>
          <span>
            Protein:
            <br />
            {food.protein}g
          </span>

          <span>
            Karbo:
            <br />
            {food.carbs}g
          </span>

          <span>
            Lemak:
            <br />
            {food.fat}g
          </span>
        </div>

        <button
          type='button'
          onClick={() => onMore?.(food)}
          className='mt-auto w-full rounded-lg bg-accent py-2.5 font-body text-body-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.99]'
        >
          Selengkapnya
        </button>
      </div>
    </Card>
  );
}
