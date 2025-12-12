interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full h-2 bg-background-light">
      <div className="bg-green-light duration-300 transition-all h-full" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
