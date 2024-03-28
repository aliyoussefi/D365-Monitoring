import Contact from "../src/ts/contact";
import Telemetry from "../src/js/trackTelemetry.js";
const { test } = require("../src/js/trackTelemetry.js");
import { XrmMockGenerator, FormContextMock } from "xrm-mock";
import * as sinon from "sinon"

describe("Contact", () => {
  beforeEach(() => {
    XrmMockGenerator.initialise();
    XrmMockGenerator.Attribute.createString("firstname", "Joe");
  });

  it("should run a javascript function", () => {
    var context = XrmMockGenerator.getEventContext();
    test(context);
  });

  it("should change name to Bob onLoad", () => {
    var context = XrmMockGenerator.getEventContext();
    Contact.onLoad(context);
    let name = context.formContext.getAttribute("firstname").getValue();
    expect(name).toBe("Bob"); // Pass
  });

  it("should see tab label change to Notes (2)", () => {
    XrmMockGenerator.Tab.createTab("notes", "Notes", true);
    //XrmMockGenerator.Tab.createTab();
    var context = XrmMockGenerator.getEventContext();
    const stub = sinon.stub(Xrm.WebApi, "retrieveMultipleRecords").resolves({
        entities: ["1", "2"],
        nextLink: ""
      });
    Contact.showAttachmentCount(context);
    let tab = context.formContext.ui.tabs.get('notes');

    expect(tab.getLabel()).toBe("Notes (2)"); // Pass
  });
});