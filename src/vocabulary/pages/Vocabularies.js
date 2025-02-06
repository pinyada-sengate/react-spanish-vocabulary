import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import VocabularyList from "../components/VocabularyList";

const Vocabularies = () => {
  const [loadedVocabularies, setLoadedVocabularies] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchVocabulariesBycategoryId = async (categoryId) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/vocabulary/${categoryId}`
        );
        setLoadedVocabularies(responseData.vocabularies);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVocabulariesBycategoryId(categoryId);
  }, [sendRequest, categoryId]);

  const vocabularyDeletedHandler = (deletedVocabularyID) => {
    setLoadedVocabularies((prevVocabularies) =>
      prevVocabularies.filter(
        (vocabulary) => vocabulary.id !== deletedVocabularyID
      )
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedVocabularies && (
        <VocabularyList
          items={loadedVocabularies}
          onDeleteCategory={vocabularyDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Vocabularies;
