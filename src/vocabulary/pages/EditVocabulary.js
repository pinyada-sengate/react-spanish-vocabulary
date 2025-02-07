import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./VocabularyForm.css";

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const EditVocabulary = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedVocabulary, setLoadedVocabulary] = useState();
  const history = useHistory();

  const vocabularyId = useParams().id;

  const [formState, inputHandler, setFormData] = useForm(
    {
      es: {
        value: "",
        isValid: false,
      },
      en: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/vocabulary/getVocabularyById/${vocabularyId}`
        );

        setLoadedVocabulary(responseData.vocabulary);

        setFormData(
          {
            es: {
              value: responseData.vocabulary.es,
              isValid: true,
            },
            en: {
              value: responseData.vocabulary.en,
              isValid: true,
            },
            image: {
              value: responseData.vocabulary.image,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchVocabulary();
  }, [sendRequest, vocabularyId, setFormData]);

  const vocabularyUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (typeof formState.inputs.image.value === "string") {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/vocabulary/edit/${vocabularyId}`,
          "PATCH",
          JSON.stringify({
            es: formState.inputs.es.value,
            en: formState.inputs.en.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } else {
        const formData = new FormData();
        formData.append("es", formState.inputs.es.value);
        formData.append("en", formState.inputs.en.value);
        formData.append("image", formState.inputs.image.value);
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/vocabulary/edit/${vocabularyId}`,
          "PATCH",
          formData,
          {
            Authorization: "Barrer " + auth.token,
          }
        );
      }

      history.push("/category/getCategories");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedVocabulary && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find vocabulary!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onclear={clearError} />
      {!isLoading && loadedVocabulary && (
        <form
          className="vocabulary-form"
          onSubmit={vocabularyUpdateSubmitHandler}
        >
          <Input
            id="es"
            element="input"
            type="text"
            label="Spanish"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a Spanish vocabulary."
            onInput={inputHandler}
            initialValue={loadedVocabulary.es}
            initialValid={true}
          />
          <Input
            id="en"
            element="input"
            type="text"
            label="English"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter an English vocabulary."
            onInput={inputHandler}
            initialValue={loadedVocabulary.en}
            initialValid={true}
          />
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
            image={`${process.env.REACT_APP_ASSET_URL}/${formState.inputs.image.value}`}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE VOCABULARY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default EditVocabulary;
