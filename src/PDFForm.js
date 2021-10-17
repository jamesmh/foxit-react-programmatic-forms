import React from "react";
import * as UIExtension from "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.full.js";
import "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.css";
import "./PDFForm.css";

export default class PDFForm extends React.Component {
  constructor() {
    super();
    this.elementRef = React.createRef();
  }

  render() {
    return <div className="foxit-PDF" ref={this.elementRef} />;
  }

  async componentDidMount() {
    const element = this.elementRef.current;
    const libPath = "/foxit-lib/";
    this.pdfui = new UIExtension.PDFUI({
      viewerOptions: {
        libPath,
        jr: {
          readyWorker: window.readyWorker,
        },
      },
      renderTo: element,
      appearance: UIExtension.appearances.adaptive,
      addOns: libPath + "uix-addons/allInOne.js",
    });

    window.pdfui = this.pdfui;
    const pdfViewer = this.pdfui.pdfViewer;
    const PDFViewCtrl = UIExtension.PDFViewCtrl;
    const FieldTypes = PDFViewCtrl.PDF.form.constant.Field_Type;

    const formFieldsJson = [
      {
        pageIndex: 0,
        fieldName: "policyNumber",
        fieldType: FieldTypes.Text,
        rect: {
          left: 50,
          right: 300,
          top: 650,
          bottom: 600,
        },
      },
      {
        pageIndex: 0,
        fieldName: "claimType",
        fieldType: FieldTypes.ComboBox,
        rect: {
          left: 50,
          right: 300,
          top: 550,
          bottom: 500,
        },
      },
    ];

    pdfViewer
      .getEventEmitter()
      .on(PDFViewCtrl.Events.openFileSuccess, function (PDFDoc) {
        PDFDoc.loadPDFForm().then(function (PDFForm) {
          PDFDoc.getPDFForm();

          const taskList = formFieldsJson.map((json) =>
            PDFForm.addControl(
              json.pageIndex,
              json.fieldName,
              json.fieldType,
              json.rect
            )
          );

          Promise.all(taskList).then(function (results) {
            results.map(function (result, index) {
              if (!result) {
                console.error("Cannot add control");
                return;
              }
              const fieldName = formFieldsJson[index].fieldName;
              const field = PDFForm.getField(fieldName);

              if (fieldName === "claimType") {
                field.setOptions([
                  {
                    label: "Car Accident",
                    value: "0",
                    selected: true,
                    defaultSelected: true,
                  },
                  {
                    label: "House Fire",
                    value: "1",
                    selected: false,
                    defaultSelected: false,
                  },
                ]);
              }
              field.setValue("", null);
            });
          });
        });
      });

    const response = await fetch("InsuranceClaim.pdf");
    const file = await response.blob();
    await this.pdfui.openPDFByFile(file);
  }

  componentWillUnmount() {
    this.pdfui.destroy();
  }
}
