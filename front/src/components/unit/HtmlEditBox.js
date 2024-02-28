import React, { useState, useEffect } from "react";
import HtmlEditor, { Toolbar, MediaResizing, ImageUpload, Item } from "devextreme-react/html-editor";

const HtmlEditBox = ({ column, data, setData, value }) => {
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  return (
    <div>
      <HtmlEditor
        height="725px"
        id={column.dataField}
        value={editorValue}
        focusStateEnabled={true}
        onValueChanged={(e) => {
          setEditorValue(e.value);
          setData({ ...data, [column.dataField]: e.value });
        }}
      >
        <MediaResizing enabled={true} />
        <ImageUpload fileUploadMode="base64" />
        <Toolbar>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item name="size" acceptedValues={sizeValues} options={fontSizeOptions} />
          <Item name="font" acceptedValues={fontValues} options={fontFamilyOptions} />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
          <Item name="separator" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="alignJustify" />
          <Item name="separator" />
          <Item name="orderedList" />
          <Item name="bulletList" />
          <Item name="separator" />
          <Item name="header" acceptedValues={headerValues} options={headerOptions} />
          <Item name="separator" />
          <Item name="color" />
          <Item name="background" />
          <Item name="separator" />
          <Item name="link" />
          <Item name="separator" />
          <Item name="clear" />
          <Item name="codeBlock" />
          <Item name="blockquote" />
          <Item name="separator" />
        </Toolbar>
      </HtmlEditor>
    </div>
  );
};
const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  const fontValues = [
    "Arial",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];
  const headerValues = [false, 1, 2, 3, 4, 5];
  const fontSizeOptions = {
    inputAttr: {
      "aria-label": "Font size",
    },
  };
  const fontFamilyOptions = {
    inputAttr: {
      "aria-label": "Font family",
    },
  };
  const headerOptions = {
    inputAttr: {
      "aria-label": "Font family",
    },
  };

export default HtmlEditBox;
