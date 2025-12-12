import { useState, useCallback, type ReactNode } from "react";
import {
  AddProductContext,
  initialData,
  type AddProductData, 
} from "./AddProductContext";

const AddProductProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AddProductData>(initialData);
  const [errors, setErrorsState] = useState<Record<string, string>>({});

  const updateData = useCallback((key: keyof AddProductData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setErrors = useCallback((newErrors: Record<string, string>) => {
    setErrorsState(newErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
    setErrorsState({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrorsState((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return (
    <AddProductContext.Provider
      value={{
        data,
        updateData,
        resetData,
        clearErrors,
        errors,
        setErrors,
        clearFieldError,
      }}
    >
      {children}
    </AddProductContext.Provider>
  );
};

export { AddProductProvider };
