import Counter from '../../components/common/Counter';

export default function WeightHeight({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}) {
  const increaseHeight = () => {
    if (height < 250) {
      onHeightChange(height + 1);
    }
  };

  const decreaseHeight = () => {
    if (height > 100) {
      onHeightChange(height - 1);
    }
  };

  const increaseWeight = () => {
    if (weight < 300) {
      onWeightChange(weight + 1);
    }
  };

  const decreaseWeight = () => {
    if (weight > 20) {
      onWeightChange(weight - 1);
    }
  };

  return (
    <div className='w-full'>
      {/* Tinggi */}
      <section>
        <h1 className='text-center font-heading text-heading-xl font-bold text-text'>
          Tinggi Anda
        </h1>

        <div className='mt-8 flex justify-center'>
          <Counter
            value={height}
            unit='cm'
            direction='vertical'
            onIncrease={increaseHeight}
            onDecrease={decreaseHeight}
            onChange={onHeightChange}
            min={100}
            max={250}
          />
        </div>
      </section>

      {/* Berat */}
      <section className='mt-14'>
        <h2 className='text-center font-heading text-heading-xl font-bold text-text'>
          Berat Anda
        </h2>

        <div className='mx-auto mt-8 w-full max-w-[420px]'>
          <Counter
            value={weight}
            unit='kg'
            direction='horizontal'
            onIncrease={increaseWeight}
            onDecrease={decreaseWeight}
            onChange={onWeightChange}
            min={20}
            max={300}
          />
        </div>
      </section>
    </div>
  );
}
