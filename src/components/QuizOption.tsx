import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface QuizOptionProps {
  label: string;
  index: number;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  wasSelected: boolean;
  onClick: () => void;
}

const letters = ["A", "B", "C", "D"];

export const QuizOption = ({ label, index, selected, revealed, isCorrect, wasSelected, onClick }: QuizOptionProps) => {
  const getStyles = () => {
    if (revealed && isCorrect) return "bg-correct border-correct-border border-2 shadow-md";
    if (revealed && wasSelected && !isCorrect) return "bg-wrong border-wrong-border border-2 shadow-md animate-shake";
    if (selected) return "bg-quiz-option-selected border-quiz-option-selected-border border-2 shadow-md";
    return "bg-quiz-option border-quiz-option-border border-2 hover:bg-quiz-option-hover hover:border-muted-foreground/30 hover:shadow-sm";
  };

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={cn(
        "relative w-full rounded-2xl p-4 text-left font-body font-semibold text-foreground transition-all duration-200",
        "flex items-center gap-3",
        "disabled:cursor-default",
        !revealed && !selected && "active:scale-[0.98]",
        getStyles()
      )}
    >
      <span className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
        revealed && isCorrect ? "bg-success text-success-foreground" :
        revealed && wasSelected && !isCorrect ? "bg-destructive text-destructive-foreground" :
        selected ? "bg-primary text-primary-foreground" :
        "bg-muted text-muted-foreground"
      )}>
        {revealed && isCorrect ? <Check className="h-4 w-4" /> :
         revealed && wasSelected && !isCorrect ? <X className="h-4 w-4" /> :
         letters[index]}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
};
