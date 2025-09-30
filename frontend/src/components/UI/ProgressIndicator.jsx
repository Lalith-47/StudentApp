import React from "react";
import { CheckCircle, Clock, Circle } from "lucide-react";

const ProgressIndicator = ({ currentStage, stages = [] }) => {
  const defaultStages = [
    { id: "submitted", label: "Submitted", completed: true },
    { id: "initial_review", label: "Initial Review", completed: currentStage !== "submitted" },
    { id: "detailed_review", label: "Detailed Review", completed: ["approved", "rejected", "requires_changes"].includes(currentStage) },
    { id: "verification", label: "Verification", completed: ["approved", "rejected"].includes(currentStage) },
    { id: "completed", label: "Completed", completed: ["approved", "rejected"].includes(currentStage) }
  ];

  const progressStages = stages.length > 0 ? stages : defaultStages;
  const currentIndex = progressStages.findIndex(stage => stage.id === currentStage);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {progressStages.map((stage, index) => {
          const isCompleted = stage.completed || index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-200 border-gray-300 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                {index < progressStages.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-full w-8 h-0.5 transform -translate-y-1/2 ${
                      isPast ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs mt-2 text-center max-w-20 ${
                  isCompleted || isCurrent
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;

