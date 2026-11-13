import { createContext, useContext } from "react";

export const DocumentsContext = createContext();

export function useDocumentsContext() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error(
      "useDocumentsContext must be used within a DocumentsProvider",
    );
  }

  return context;
}
