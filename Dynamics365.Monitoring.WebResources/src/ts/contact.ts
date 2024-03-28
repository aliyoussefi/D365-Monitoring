export default class Contact {
    public static onLoad(context: Xrm.Events.EventContext) {
      const formContext = context.getFormContext();
      formContext.getAttribute("firstname").setValue("Bob");
    }
    
    public static showAttachmentCount(context: Xrm.Events.EventContext) {
        const formContext = context.getFormContext();

        var filter = "?$select=subject&$filter=_objectid_value eq (" + formContext.data.entity.getId() + ")";
        console.log('about to retrieve annotations');
        Xrm.WebApi.retrieveMultipleRecords("annotation", filter).then(notes => {
            if (notes.entities.length > 0) {
                var tab = formContext.ui.tabs.get('notes');
                
                if (tab !== null) {
                    console.log(tab.getLabel());
                    console.log(notes.entities.length.toString());
                    tab.setLabel(tab.getLabel() + ' (' + notes.entities.length.toString() + ')');
                    console.log(tab.getLabel());
                }
            }
        }).catch();
    }
}