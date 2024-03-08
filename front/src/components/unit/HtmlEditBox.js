import React, { useState, useEffect } from "react";
import HtmlEditor, { Toolbar, MediaResizing, ImageUpload, Item } from "devextreme-react/html-editor";
import { Validator, RequiredRule } from 'devextreme-react/validator'

const HtmlEditBox = ({ column, data, setData, value, placeholder }) => {
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
        placeholder={placeholder}
        focusStateEnabled={true}
        onValueChanged={(e) => {
          setEditorValue(e.value);
          setData({ ...data, [column.dataField]: e.value });
        }}
      >
        <Validator>
          <RequiredRule message='내용은 필수입니다'  />
        </Validator>
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
  "함초롱바탕",
  "나눔고딕",
  "굴림체",
  "맑은 고딕",
  "돋움체",
  "궁서체",
  "바탕체",
  "함초롱바탕",
  "나눔스퀘어",
  "나눔스퀘어 Bold",
  "나눔고딕 ExtraBold",
  "나눔명조 ExtraBold",
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
