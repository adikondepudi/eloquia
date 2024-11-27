interface ProgressBarProps {
    progress: number;
  }
  
  export const ProgressBar = ({ progress }: ProgressBarProps) => {
    return (
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };