import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface ProjectInfoProps {
  title: string;
  description: string;
  contributors: {
    count: number; // Number of contributors
    tonCollected: number; // TON collected
    daysPassed: number; // Days passed
    totalDays: number; // Total number of days
  };
  steps: string[]; // Array of step names
  currentStep: number; // The index of the current step (1-based)
}

export default function ProjectInfo({ title, description, contributors, steps, currentStep }: ProjectInfoProps){
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-secondary text-white rounded-lg p-6 max-w-4xl mx-6 shadow-lg">
      {/* Card Header */}
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-300" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-300" />
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 mt-4">{description}</p>

      {/* Contributor Info */}
      <p className="text-sm text-gray-400 mt-2">
        {contributors.count} contributors, {contributors.tonCollected} TON collected,{" "}
        {contributors.daysPassed} days out of {contributors.totalDays} passed
      </p>

      {/* Progress Bar */}
      {isExpanded && (
        <div className="mt-6">
          <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center w-full p-2 border ${
                  index + 1 <= currentStep
                    ? "border-blue-500 bg-gray-800 text-white"
                    : "border-gray-700 bg-gray-900 text-gray-400"
                } rounded-lg`}
              >
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    index + 1 <= currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Step Label */}
                <div className="ml-4 text-sm font-medium">{step}</div>

                {/* Line Between Steps */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-grow h-1 mx-4 ${
                      index + 1 < currentStep ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
