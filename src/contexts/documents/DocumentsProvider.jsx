import { useState } from "react";

import { DocumentsContext } from "./DocumentsContext";

export default function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState([]);

  const addDocument = ({ type, title, imageUri }) => {
    const newDocument = {
      id: Date.now().toString(),
      type,
      title,
      imageUri,
      createdAt: new Date().toISOString(),
    };

    setDocuments((prevDocuments) => [newDocument, ...prevDocuments]);
  };

  const value = {
    documents,
    addDocument,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}
