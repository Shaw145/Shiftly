import { FaTruck, FaBox, FaCarSide, FaCalendarCheck } from "react-icons/fa";

const StepProgress = ({ currentStep, setCurrentStep }) => {
  const steps = [
    { number: 1, icon: <FaTruck />, label: "Addresses" },
    { number: 2, icon: <FaBox />, label: "Goods" },
    { number: 3, icon: <FaCarSide />, label: "Vehicle" },
    { number: 4, icon: <FaCalendarCheck />, label: "Schedule" }
  ];

  return (
    <div className="w-full py-2 px-2 sm:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0">
        {steps.map((step) => (
          <div 
            key={step.number}
            onClick={() => setCurrentStep(step.number)}
            className={`
              flex flex-col items-center cursor-pointer group
              transition-all duration-300 p-2 sm:p-3 rounded-lg
              ${step.number <= currentStep ? 'hover:bg-red-50' : 'opacity-60'}
            `}
          >
            <div className={`
              w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
              transition-all duration-300 mb-2
              ${step.number <= currentStep 
                ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                : 'bg-gray-100 text-gray-400'
              }
              ${step.number === currentStep && 'ring-4 ring-red-100 scale-110'}
              group-hover:scale-105
            `}>
              <span className="text-lg sm:text-xl">{step.icon}</span>
            </div>
            <span className={`
              text-xs sm:text-sm font-medium text-center
              ${step.number <= currentStep ? 'text-red-500' : 'text-gray-400'}
            `}>
              {step.label}
            </span>
            <span className={`
              text-[10px] sm:text-xs mt-1
              ${step.number === currentStep ? 'text-red-500' : 'text-gray-400'}
            `}>
              Step {step.number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;