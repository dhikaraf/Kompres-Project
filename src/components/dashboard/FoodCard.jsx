import Card from '../common/Card';

export default function FoodCard({ food, onMore }) {
  return (
    <Card className='flex h-[330px] w-[270px] shrink-0 flex-col overflow-hidden sm:w-[280px]'>
      <div className='flex flex-1 flex-col p-5'>
        <p className='font-body text-body-sm font-semibold text-primary'>
          {food.category}
        </p>

        <h3 className='mt-2 min-h-[58px] overflow-hidden font-heading text-heading-lg font-semibold leading-tight text-text'>
          {food.name}
        </h3>

        <div className='mt-6 grid grid-cols-3 gap-3 font-body text-[13px] text-text'>
          <div>
            <p>Protein</p>
            <p className='mt-1 font-semibold'>{food.protein}g</p>
          </div>

          <div>
            <p>Karbo</p>
            <p className='mt-1 font-semibold'>{food.carbs}g</p>
          </div>

          <div>
            <p>Lemak</p>
            <p className='mt-1 font-semibold'>{food.fat}g</p>
          </div>
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
