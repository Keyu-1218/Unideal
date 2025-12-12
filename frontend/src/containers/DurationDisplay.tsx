const DurationDisplay = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const displayDays = diffDays === 0 ? 1 : diffDays;

  return (
    <div className="mt-4 bg-green-dark text-white rounded-lg p-4 text-center">
      <p className="text-sm opacity-90">Duration</p>
      <p className="text-2xl font-bold">
        {displayDays} {displayDays === 1 ? "day" : "days"}
      </p>
    </div>
  );
};

export default DurationDisplay;
