import React from "react";
import { GameRule } from "../../../src/types";
import "../styles/RulesDisplay.css";

interface RulesDisplayProps {
  activeRules: GameRule[];
  availableRules: GameRule[];
  onRuleToggle?: (rule: GameRule) => void;
  isEditable?: boolean;
}

const RulesDisplay: React.FC<RulesDisplayProps> = ({
  activeRules,
  availableRules,
  onRuleToggle,
  isEditable = false
}) => {
  // Helper for short rule description
  const getRuleDescription = (rule: GameRule): string => {
    const descriptions: Record<GameRule, string> = {
      Open: "All cards visible",
      Random: "Random card placement",
      Same: "Same values capture adjacent cards",
      Plus: "Sum of values capture adjacent cards",
      "Same Wall": "Card values can match with walls",
      Elemental: "Elements provide bonuses",
      "Sudden Death": "Tie results in rematch"
    };

    return descriptions[rule];
  };

  return (
    <div className="rules-display">
      <h3>Active Rules</h3>
      <ul className="rules-list">
        {activeRules.map((rule) => (
          <li key={rule} className="rule-item active">
            <span className="rule-name">{rule}</span>
            <span className="rule-description">{getRuleDescription(rule)}</span>
            {isEditable && (
              <button
                className="rule-toggle"
                onClick={() => onRuleToggle && onRuleToggle(rule)}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {isEditable && availableRules.length > 0 && (
        <>
          <h3>Available Rules</h3>
          <ul className="rules-list">
            {availableRules
              .filter((rule) => !activeRules.includes(rule))
              .map((rule) => (
                <li key={rule} className="rule-item">
                  <span className="rule-name">{rule}</span>
                  <span className="rule-description">
                    {getRuleDescription(rule)}
                  </span>
                  <button
                    className="rule-toggle"
                    onClick={() => onRuleToggle && onRuleToggle(rule)}
                  >
                    Add
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default RulesDisplay;
