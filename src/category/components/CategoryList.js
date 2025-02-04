import React from "react";

import "./CategoryList.css";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import CategoryItem from "./CategoryItem";

const CategoryList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="category-list center">
        <Card>
          <h2>No category found. Maybe create one?</h2>
          <Button to="/category/add">Add Category</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="category-list">
      {props.items.map((category) => (
        <CategoryItem
          key={category.id}
          id={category.id}
          image={category.image_url}
          title={category.title}
          onDelete={props.onDeleteCategory}
        />
      ))}
    </ul>
  );
};

export default CategoryList;
