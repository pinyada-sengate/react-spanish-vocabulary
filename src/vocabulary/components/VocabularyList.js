import React from "react";
import { useParams } from "react-router-dom";

import "./VocabularyList.css";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import VocabularyItem from "./VocabularyItem";

const VocabularyList = (props) => {
  const { categoryId } = useParams();

  if (props.items.length === 0) {
    return (
      <div className="vocabulary-list center">
        <Card>
          <h2>No vocabulary found.</h2>
          <Button
            to={`/vocabulary/add/${categoryId}`}
            path="/vocabulary/add/:categoryId"
          >
            Add Vocabulary
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="vocabulary-list">
      {props.items.map((vocabulary) => (
        <VocabularyItem
          key={vocabulary._id}
          id={vocabulary._id}
          image={vocabulary.image}
          es={vocabulary.es}
          en={vocabulary.en}
          onDelete={props.onDeleteVocabulary}
        />
      ))}
    </ul>
  );
};

export default VocabularyList;
