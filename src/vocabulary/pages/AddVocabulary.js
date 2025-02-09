import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./VocabularyForm.css";

const AddVocabulary = () => {
  const { categoryId } = useParams();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      es: {
        value: "",
        isValid: false,
      },
      en: {
        value: "",
        isValid: false,
      },
      categoryId: {
        value: categoryId,
        isValid: true,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const vocabularySubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("es", formState.inputs.es.value);
      formData.append("en", formState.inputs.en.value);
      formData.append("categoryId", formState.inputs.categoryId.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/vocabulary/add`,
        "POST",
        formData,
        {
          Authorization: "Barrer " + auth.token,
        }
      );

      //redirect user to all categories
      history.push("/category/getCategories");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="vocabulary-form" onSubmit={vocabularySubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="es"
          element="input"
          type="text"
          label="Spanish"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a Spanish vocabulary."
          onInput={inputHandler}
        />
        <Input
          id="en"
          element="input"
          type="text"
          label="English"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter an English vocabulary."
          onInput={inputHandler}
        />
        <Input
          id="categoryId"
          element="input"
          type="text"
          label="Category Id"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid category id."
          onInput={inputHandler}
          initialValue={categoryId}
          initialValid={true}
        />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD VOCABULARY
        </Button>
      </form>
    </React.Fragment>
  );
};

export default AddVocabulary;
