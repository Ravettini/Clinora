import { createContext, useContext, useState, type ReactNode } from "react";

interface UIContextValue {
  newIncomeOpen: boolean;
  openNewIncome: (patientId?: string) => void;
  closeNewIncome: () => void;
  prefillPatientId?: string;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [newIncomeOpen, setNewIncomeOpen] = useState(false);
  const [prefillPatientId, setPrefill] = useState<string | undefined>();

  return (
    <UIContext.Provider
      value={{
        newIncomeOpen,
        prefillPatientId,
        openNewIncome: (patientId?: string) => {
          setPrefill(patientId);
          setNewIncomeOpen(true);
        },
        closeNewIncome: () => setNewIncomeOpen(false),
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
