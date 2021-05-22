import React, { useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import ReactMarkdown from "react-markdown";
import "./index.css";

export default function AppExplanations() {
  const [expandedItems, setexpandedItems] = useState([]);

  // In case the user expands a node that is barely visible, we scroll the page to display it fully
  function handleExpand(update) {
    if (update.length > expandedItems.length) {
      const newExpandedItemUUID = update[update.length - 1];
      const itemButtonBottom = document
        .getElementById(`accordion__panel-${newExpandedItemUUID}`)
        .getBoundingClientRect().bottom;
      if (itemButtonBottom > window.innerHeight) {
        window.scrollBy(0, itemButtonBottom - window.innerHeight);
      }
    }
    setexpandedItems(update);
  }

  const lorem_help =
    // eslint-disable-next-line
    "Lorem \n\
    Ipsum";

  return (
    <Accordion allowZeroExpanded allowMultipleExpanded onChange={handleExpand}>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>Lorem ipsum</AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ReactMarkdown
            className="Explanations"
            children={lorem_help}
          ></ReactMarkdown>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}
