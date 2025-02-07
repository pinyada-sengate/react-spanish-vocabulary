import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./CategoryForm.css";

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

const EditCategory = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCategory, setLoadedCategory] = useState();
  const history = useHistory();

  const categoryId = useParams().id;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
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
    const fetchCategory = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/category/${categoryId}`
        );

        setLoadedCategory(responseData.category);

        setFormData(
          {
            title: {
              value: responseData.category.title,
              isValid: true,
            },
            image: {
              value: responseData.category.image,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchCategory();
  }, [sendRequest, categoryId, setFormData]);

  const categoryUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (typeof formState.inputs.image.value === "string") {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/category/edit/${categoryId}`,
          "PATCH",
          JSON.stringify({
            title: formState.inputs.title.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } else {
        const formData = new FormData();
        formData.append("title", formState.inputs.title.value);
        formData.append("image", formState.inputs.image.value);
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/category/edit/${categoryId}`,
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

  if (!loadedCategory && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find category!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onclear={clearError} />
      {!isLoading && loadedCategory && (
        <form className="category-form" onSubmit={categoryUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedCategory.title}
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
            UPDATE CATEGORY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default EditCategory;
