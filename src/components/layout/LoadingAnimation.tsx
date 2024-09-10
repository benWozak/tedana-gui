import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/loading_brain.json";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-300">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LoadingAnimation;
