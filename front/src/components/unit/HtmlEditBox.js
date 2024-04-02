import React, { useState, useCallback } from "react";
import HtmlEditor, { Toolbar, MediaResizing, ImageUpload, Item } from "devextreme-react/html-editor";

const HtmlEditBox = ({ column, data, setData, placeholder, value }) => {
  const [valueContent, setValueContent] = useState(value);
  
  const valueChanged = useCallback(
    (e) => {
      setValueContent(e.value);
    },
    [valueContent],
  );

  return (
    <div>
      <HtmlEditor
        height="725px"
        id={column.dataField}
        placeholder={placeholder}
        value={valueContent ?? value}  //valueContent가 null이나 undefined일 경우 value를 사용 그 외 falsy(0,"",false)한 값은 valueContent를 사용
        onValueChanged={valueChanged}
        onFocusOut={(e) => {
          setData({ ...data, [column.dataField]: valueContent });
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
          <Item name="insertTable" />
          <Item name="deleteTable" />
          <Item name="insertRowAbove" />
          <Item name="insertRowBelow" />
          <Item name="deleteRow" />
          <Item name="insertColumnLeft" />
          <Item name="insertColumnRight" />
          <Item name="deleteColumn" />
          <Item name="separator" />
          <Item name="cellProperties" />
          <Item name="tableProperties" />
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
