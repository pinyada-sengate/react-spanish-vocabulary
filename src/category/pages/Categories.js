import React, { useEffect, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CategoryList from "../components/CategoryList";

const Categories = () => {
  const [loadedCategories, setLoadedCategories] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/category/getCategories`
        );
        setLoadedCategories(responseData.categories);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, [sendRequest]);

  const categoryDeletedHandler = (deletedCategoryID) => {
    setLoadedCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== deletedCategoryID)
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
      {!isLoading && loadedCategories && (
        <CategoryList
          items={loadedCategories}
          onDeleteCategory={categoryDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Categories;
