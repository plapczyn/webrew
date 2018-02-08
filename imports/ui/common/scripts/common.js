import '../templates/webrewModal.html';

class WebrewToast
{
    constructor()
    {
    }

    static options;

    /**
     * type: string ('error', 'info', 'success', 'warning')
     */
    static Show(message, type, title)
    {
        Toast.options = this.defaultOptions();
        if(type === 'error')
        {
            Toast.error(message || "", title);
        }
        else if(type === "info")
        {
            Toast.info(message || "", title);
        }
        else if(type === "success")
        {
            Toast.success(message || "", title);
        }
        else if(type === "warning")
        {
            Toast.warning(message || ""), title;
        }
    }

    static defaultOptions()
    {
        if(typeof this.options == "undefined")
        {
            this.options =  {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                showEasing: 'swing',
                hideEasing: 'linear',
                showMethod: 'fadeIn',
                hideMethod: 'fadeOut',
                timeOut: 1500
              };
        }
        
        return this.options;
    }
}

class WebrewModal
{
    static renderedTemplate;
    static initialized;
    static options;

    /**
     * options: 
     * {
     *      template: string,
     *      title?: string,
     *      okCallback?: Function
     * }
     */
    static Show(options)
    {
        this.options = null;
        this.options = options;
        this.verifyOptions();
        if(!this.initialized)
        {
            this.init();
        }

        this.render()
        $("#webrewModalDialog").one("shown.bs.modal", function() {
            if(typeof $(".modal-body :input")[0] != 'undefined'){
                $(".modal-body :input")[0].focus();
            }
        })
        $("#webrewModalDialog").modal("show");
        
    }

    static render()
    {
        if(typeof this.renderedTemplate != "undefined" || this.renderedTemplate != null)
        {
            Blaze.remove(this.renderedTemplate);
        }

        this.renderedTemplate = null;

        this.SetTemplateHelpers()
        this.renderedTemplate = Blaze.render(Template.webrewModal, $("body")[0]);
    }

    static init()
    {
        Template.webrewModal.events({
            'click .ok': (event, template) => 
            {
                if(typeof this.options.okCallback == "function")
                {
                    this.options.okCallback(event);
                    this.Hide();
                }
                else
                {
                    if(!document.getElementById("modalOk").form.checkValidity()){
                        document.getElementById("modalOk").click();
                    }
                    else
                    {
                        $("#modalOk").trigger("submit");
                    }
                }
            }
        });

        this.initialized = true;
    }

    static Hide()
    {
        $("#webrewModalDialog").modal("hide");
    }

    static verifyOptions(){
        if(typeof this.options.template == "undefined")
        {
            console.error("Error: WebrewModal.Show(options)  - You must set options.template to a blaze template name")
        }
    }

    static GetForm(event)
    {
        if(!event)
        {
            return [];
        }

        return event.target.form;
    }

    static IsFormValid(event)
    {
        return event.target.form.checkValidity()
    }

    static SetTemplateHelpers()
    {
        Template.webrewModal.helpers({
            modalBody: this.options.template,
            title: this.options.title || "",
            coffeeOk: this.options.coffeeOk || false,
            data: this.options.data
        });
    }
}

class WebrewLoader
{
    static Show()
    {
        
    }

    static Hide()
    {

    }
}

class WebrewColorPallet
{
    static LightRoast = {Name: "Light Roast", Color: "#D5BDAE"};
    static LightMediumRoast = {Name: "Light-Medium Roast", Color: "#B18367"};
    static MediumRoast = {Name: "Medium Roast", Color: "#975934"};
    static MediumDarkRoast = {Name: "Medium-Dark Roast", Color: "#653B23"};
    static DarkRoast = {Name: "Dark Roast", Color: "#321E11"};
    
    static LightGrey = {Name: "LightGrey", Color: "#e8e9eb"};
    static Grey = {Name: "Grey", Color: "#a9a9ab"};
    static LightBrown = {Name: "LightBrown", Color: "#b69476"};
    static DarkBrown = {Name: "DarkBrown", Color: "#66290b"};
    static BlackBrown = {Name: "BlackBrown", Color: "#120907"};

    static GetColor(roastName)
    {
        if(typeof roastName !== 'string'){
            console.error("Enter a roast name as a string");
            return;
        }

        switch(roastName)
        {
            case this.LightRoast.Name:
            {
                return this.LightRoast.Color
            }
            case this.MediumRoast.Name:
            {
                return this.MediumRoast.Color
            }
            case this.MediumDarkRoast.Name:
            {
                return this.MediumDarkRoast.Color
            }
            case this.DarkRoast.Name:
            {
                return this.DarkRoast.Color
            }
            default:
            {
                console.error("Color name is not in the pallet!")
                return "red";
            }
        }
    }
}

class WebrewInput
{
    static instances = [];
    template;
    temporaryKeyboardSelectedItem = {};
    templateEvents = {};
    templateHelpers = {};
    
    static helpersAreRegistered = false;
    static eventsAreRegistered = false;

    constructor(template)
    {
        this.template = template;
        let index = -1;
        let hasInstance = WebrewInput.instances.some((instance, i) => {
            if(template.data.elementId == instance.template.data.elementId){
                index = i;
            }

            return template.data.elementId == instance.template.data.elementId;
        });

        if(hasInstance)
        {
            WebrewInput.instances.splice(index, 1);
        }

        WebrewInput.instances.push(this);
    }

    getKey()
    {
        // return this.template.$("#" + this.template.data.elementId + "_hiddenKey").val();
        if(this.template.isMultipleSelection)
        {
            return this.getKeys()[0] || "";
        }
        else
        {
            return this.template.key.get();
        }
    }

    getKeys()
    {
        return this.template.selectedItems.get().map(item => item.key);
    }

    setKey(key)
    {
        // this.template.$("#" + this.template.data.elementId + "_hiddenKey").val(key);
        if(this.template.isMultipleSelection)
        {
            console.error("Method is invalid with multiple selection");
            throw new Meteor.Error("Set Key", "Method is invalid with multiple selection");
        }
        else
        {
            this.template.key.set(key);
        }
    }

    getValue()
    {
        if(this.template.isMultipleSelection)
        {
            return this.template.selectedItems.get().map(item => item.value)[0] || "";
        }
        else
        {
            return this.template.$("#" + this.template.data.elementId).val();
        }
    }

    setValue(value)
    {
        if(this.template.isMultipleSelection)
        {
            //TODO Find a bette way to handle this...
            // this.template.$("#" + this.template.data.elementId).val(value);
        }
        else
        {
            this.template.$("#" + this.template.data.elementId).val(value);
            // TODO
            // this.template.$(".webrew-input-control-container").trigger("webrew-input-selection-changed");
        }
    }

    selectItem(item)
    {
        if(this.template.isMultipleSelection)
        {
            this.template.selectedItems.set([...this.template.selectedItems.get(), item]);
        }
        else
        {
            this.template.selectedItems.set([item]);
        }
    }

    deselectItem(item)
    {
        if(this.template.isMultipleSelection)
        {
            this.template.selectedItems.set([...this.template.selectedItems.get().filter(iItem => iItem.key != item.key)]);
        }
        else
        {
            this.template.selectedItems.set([]);
        }
    }

    _setTemporaryKeyboardSelectedItem(item)
    {
        this.temporaryKeyboardSelectedItem = item;
    }

    static GetById(id)
    {
        return WebrewInput.instances.filter((instance) => {
            return instance.template.data.elementId == id;
        })[0];
    }

    toggleDropdown(){
        if(this.template.$(".webrew-input-list-container").hasClass("webrew-input-list-open"))
        {
            this.hideDropdown();
        }
        else
        {
            this.showDropdown();
        }
    }

    hideDropdown()
    {
        this.hideShowDropDown(false);
    }

    showDropdown()
    {
        this.hideShowDropDown(true);
    }

    hideShowDropDown(show)
    {
        let hide;
        hide = (typeof show == "undefined" ? undefined : !show);

        this.template.$(".webrew-input-list-container").toggleClass("webrew-input-list-hidden", hide)
        this.template.$(".webrew-input-list-container").toggleClass("webrew-input-list-open", show)
        this.template.$("#webrew-input-icon").toggleClass("fa-chevron-down", !show)
        this.template.$("#webrew-input-icon").toggleClass("fa-chevron-up", show)
        this.template.$(".webrew-input-list-container").scrollTop(true);

        if(show)
        {
            this.template.$(".webrew-input-control-container").trigger("webrew-input-dropdown-show");
        }
        else
        {
            this.template.$(".webrew-input-control-container").trigger("webrew-input-dropdown-hide");
        }
        
        this.template.isDropDownOpen.set(show);
    }

    setSelectedValue(item){
        this.selectItem(item);
        this.template.jqElement.trigger("wi-selection-changed", [item]);
    }

    clearInput()
    {
        if (this.template.isDropDownOpen.get())
        {
            this.template.highlightedIndex.set(-1);
        }
        else
        {
            this.template.highlightedIndex.set(-2);
        }
        
        this.template.searchText.set("");
        this.template.searching.set(false);
        this.template.$(".webrew-input-list-item").toggleClass("webrew-input-active", false);
        this.template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", true);
        this.template.$("#" + this.template.data.elementId).focus();
        this.template.$(".webrew-input-control-container").trigger("webrew-input-clear");
    }

    keyDown(event)
    {
        if (event.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
          }
        
        var handled = false;
        if (event.key !== undefined) 
        {
            switch(event.key)
            {
                case "ArrowDown":
                {
                    WebrewInputKeys.ArrowDown(event, this.template);
                    handled = true;
                    break;
                }
                case "ArrowUp":
                {
                    WebrewInputKeys.ArrowUp(event, this.template);
                    handled = true;
                    break;
                }
                case "Enter":
                {
                    WebrewInputKeys.Enter(event, this.template);
                    handled = true;
                    break;
                }
            }
            // Handle the event with KeyboardEvent.key and set handled true.
          } else if (event.keyIdentifier !== undefined) {
            // Handle the event with KeyboardEvent.keyIdentifier and set handled true.
          } else if (event.keyCode !== undefined) {
            // Handle the event with KeyboardEvent.keyCode and set handled true.
          }
        
          if (handled) {
            event.preventDefault(); 
          }
    }

    keyUp(event)
    {
        if (event.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
          }
        
        var handled = false;
        if (event.key !== undefined) 
        {
            switch(event.key)
            {
                case "ArrowDown":
                {
                    break;
                }
                case "ArrowUp":
                {
                    break;
                }
                case "Enter":
                {
                    break;
                }
                default: 
                {
                    let text = this.template.$(event.target).val();
                    if(text == "")
                    {
                        this.clearInput();
                    }
                    else
                    {
                        this.template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", false);
                    }
            
                    this.template.searchText.set(text);
                    this.template.highlightedIndex.set(-1);
                    this.template.jqElement.trigger("wi-internal-keyup");
                    switch (event.which){
                        case 13:
                        break;
                        case 38:
                        break;
                        case 40:
                        break;
                        default: 
                        {
                            if(this.template.$(".webrew-input-list-container").hasClass("webrew-input-list-hidden")){
                                this.template.instance.showDropdown();
                            }
                            this.template.searching.set(true);
                            this.template.key.set("");
                        }
                    }
                    // console.log("input change")
                }
            }
            // Handle the event with KeyboardEvent.key and set handled true.
          } else if (event.keyIdentifier !== undefined) {
            // Handle the event with KeyboardEvent.keyIdentifier and set handled true.
          } else if (event.keyCode !== undefined) {
            // Handle the event with KeyboardEvent.keyCode and set handled true.
          }
        
          if (handled) {
            // Suppress "double action" if event handled
          }

          
    }

    registerEvents(instance){
        this.initDefaultEvents();

        switch(instance.data.mode)
        {
            case "checkbox":
            {
                this.checkboxEventsOverride();
                break;
            }
        }

        this.registerDefaultEvents();
    }

    registerHelpers(instance)
    {
        this.initDefaultHelpers();

        switch(instance.data.mode)
        {
            case "checkbox":
            {
                this.checkBoxHelpersOverride();
                break;
            }
        }

        this.registerDefaultHelpers();
    }

    initDefaultHelpers()
    {
        this.templateHelpers = {
            items: function () {
                let template = Template.instance();
                return template.items.get();
            },
            textArray: function(text){
                let template = Template.instance();
                let searchText = template.searchText.get();
                let textChunckArray = [];
        
                function expandString(string, search, topLevel){
                    if(typeof topLevel === "undefined" && string.indexOf(search) == 0 && search != ""){
                        return ["", search, ...expandString(string.slice(string.indexOf(search) + search.length), search, false)];
                    }
        
                    if(search == ""){
                        return [string]
                    }
                    let array = [];
                    let newString = string.slice(0, string.indexOf(search));
        
                    if(string.indexOf(search) == 0){
                        return [search, ...expandString(string.slice(string.indexOf(search) + search.length), search, false)];
                    }
        
                    if(!(newString != "" && (string.indexOf(search) >= 0))){
                        return [string];
                    }
        
                    return [newString, search, ...expandString(string.slice(string.indexOf(search) + search.length), search, false)];
                }
                
                let splitArray = expandString(text, searchText);
            
                if(template.searching.get()){
                    splitArray.forEach((value, index) => {
                        if(value == ""){
                            return;
                        }
                        if(!(index % 2)){
                            textChunckArray.push({
                                highlight: false,
                                text: value.replace(/ /g, '\u00a0')
                            });
                        }
                        else{
                            textChunckArray.push({
                                highlight: true,
                                text: template.searchText.get().replace(/ /g, '\u00a0')
                            });
                        }
                    });
                }
                else{
                    textChunckArray = [{
                        highlight: false,
                        text: text
                    }];
                }
        
                return textChunckArray;
            }
        }
    }

    registerDefaultHelpers()
    {
        if(WebrewInput.helpersAreRegistered)
        {
            return;
        }

        Template.webrewInput.helpers({
            items: function() {
                let instance = Template.instance();
                return instance.instance.templateHelpers.items();
            },
            textArray: function(text) {
                let instance = Template.instance();
                return instance.instance.templateHelpers.textArray(text);
            },
            checkbox: function() {
                let instance = Template.instance();
                return instance.instance.templateHelpers.checkbox;
            },
            selectedItemCount: function(){
                let instance = Template.instance();
                return instance.selectedItems.get().length;
            },
            checkedAll: function(){
                let template = Template.instance();
                return template.instance.templateHelpers.checkedAll();
            },
            checkedSome: function(){
                let template = Template.instance();
                return template.instance.templateHelpers.checkedSome();
            },
            checkedNone: function(){
                let template = Template.instance();
                return template.instance.templateHelpers.checkedNone();
            },
            checkAllState: function(){
                let template = Template.instance();
                return template.instance.templateHelpers.checkAllState();
            }
        });

        WebrewInput.helpersAreRegistered = true;
    }
    
   checkBoxHelpersOverride()
    {
        let overrideHelpers = {
            checkbox: true,
            checkedAll: function(){
                let template = Template.instance();
                return template.selectedItems.get().length == template.totalRecordCount.get();
            },
            checkedSome: function(){
                let template = Template.instance();
                return template.selectedItems.get().length > 0 && template.selectedItems.get().length < template.totalRecordCount.get();
            },
            checkedNone: function(){
                let template = Template.instance();
                return template.selectedItems.get().length == 0;
            },
            checkAllState: function(){
                let template = Template.instance();
                
                if (template.selectedItems.get().length == template.totalRecordCount.get()){
                    return "true";
                }
                if(template.selectedItems.get().length > 0 && template.selectedItems.get().length < template.totalRecordCount.get()){
                    return "mixed";
                }
                if(template.selectedItems.get().length == 0){
                    return "false";
                }
            },
            items: function(){
                let template = Template.instance();
                
                if(template.searchText.get() == ""){
                    return template.items.get();
                }
                else{
                    let searchText = template.searchText.get();
                    return template.items.get().filter(item => item.value.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
                }
            }
        }

        Object.keys(overrideHelpers).forEach((key) => {
            this.templateHelpers[key] = overrideHelpers[key];
        });
    }

    checkboxEventsOverride()
    {
       let overrideEvents = {
            'click .clearInput': function (event, template){
                event.preventDefault();
                template.searching.set(false);
                template.instance.clearInput();
            },
            'mouseup .webrew-input-list-item': function (event, template) {
                event.currentTarget.dataset.checked = !(event.currentTarget.dataset.checked === "true");
                template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false);

                if(event.currentTarget.dataset.checked === "true"){
                    template.instance.selectItem(event.currentTarget.dataset);
                    let items = template.items.get();
                    items.filter(value => value.key == event.currentTarget.dataset.key)[0].checked = true;
                    template.items.set(items);
                }
                else{
                    template.instance.deselectItem(event.currentTarget.dataset);
                    let items = template.items.get();
                    items.filter(value => value.key == event.currentTarget.dataset.key)[0].checked = false;
                    template.items.set(items);
                }

                template.$("#" + template.data.elementId).focus();
                template.jqElement.trigger("webrew-input-mouseup");
            },
            'webrew-input-selection-changed': function(event, template){

            },
            'webrew-input-clear': function(event, template){
                template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", false);
                template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", false);
                template.instance.showDropdown();
            },
            'webrew-input-deselection': function(event, template){
                if(template.instance.getValue() != ""){
                    
                    template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", template.instance.getKey() == "");
                    template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", template.instance.getKey() == "");
                }
            },
            'wi-selection-changed': function(event, template, item){
                template.jqElement.trigger('wi-internal-selection-changed', [item]);

                if(typeof template.data.onSelectionChanged === "function"){
                    template.data.onSelectionChanged(event, template, item);
                }
            },
            'wi-internal-selection-changed': function(event, template, item){
            },
            'wi-internal-keyup': function(event, template){
                template.dataBind();
            },
            'wi-internal-enter': function(event, template, target){
                target.dataset.checked = !(target.dataset.checked === "true");

                if(target.dataset.checked === "true"){
                    template.instance.selectItem(target.dataset);
                    let items = template.items.get();
                    items.filter(value => value.key == target.dataset.key)[0].checked = true;
                    template.items.set(items);
                }
                else{
                    template.instance.deselectItem(target.dataset);
                    let items = template.items.get();
                    items.filter(value => value.key == target.dataset.key)[0].checked = false;
                    template.items.set(items);
                }

                template.$("#" + template.data.elementId).focus();
            },
            'click .js-check-all': function(event, template){
                let checkState = $(event.target).attr("aria-checked");

                template.items.set(template.items.get().map(item => {
                    item.checked = (checkState === "false");
                    return item;
                }));

                template.$('.webrew-input-list-item').toArray().forEach((item) => {
                    if(checkState === "false"){
                        item.dataset.checked = true;
                        template.instance.selectItem(item.dataset);
                    }
                    else{
                        item.dataset.checked = false;
                        template.instance.deselectItem(item.dataset);
                    }
                });


                template.$("#" + template.data.elementId).focus();
                template.instance.showDropdown();
            },
            'mousedown .js-check-all': function(event, template){
                event.preventDefault();
                event.stopPropagation();
            }
        }

        Object.keys(overrideEvents).forEach((key) => {
            this.templateEvents[key] = overrideEvents[key];
        });
    }

    initDefaultEvents()
    {
        this.templateEvents = {
            'keydown .webrew-dynamic-input': function(event, template){
                template.instance.keyDown(event);
            },
            'keyup .webrew-dynamic-input': function(event, template){
                template.instance.keyUp(event);
            },
            'click .clearInput': function (event, template){
                event.preventDefault();
                template.searching.set(false);
                template.instance.clearInput();
            },
            'mousedown .toggleDropdown': function (event, template) {
                event.preventDefault();
                event.stopPropagation();
                template.jqElement.trigger("webrew-input-toggle-dropdown-mousedown");
            },
            'click .toggleDropdown': function (event, template) {
                event.preventDefault();
                event.stopPropagation();
            },
            'mouseup .toggleDropdowntest': function (event, template) {
                event.preventDefault();
                event.stopPropagation();
                template.jqElement.trigger("webrew-input-toggle-dropdown-mouseup");
            },
            'mouseleave .webrew-input-list-container': function (event, template) {
                if(template.isMouseDown.get()){
                    template.$(".webrew-input-list-item").removeClass("webrew-input-active-click", false)
                }
                template.$(".webrew-input-list-item").toggleClass("webrew-item-highlight", false)
            },
            'mouseenter .webrew-input-list-item': function (event, template) {
                if (template.isMouseDown.get()) {
                    template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false)
                    template.$(event.target).toggleClass("webrew-input-active-click", true)
                }
                else{
                    template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
                    template.$(event.target).addClass("webrew-item-highlight")
                }
            },
            'mouseleave .webrew-input-list-item': function (event, template) {
                template.$(event.target).removeClass("webrew-item-highlight")
            },
            'mousedown .webrew-input-list-item': function (event, template) {
                event.stopPropagation();
                event.preventDefault();
                template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false);
                template.$(event.currentTarget).addClass("webrew-input-active-click");
                template.$(".webrew-input-control-container").trigger("webrew-input-mousedown");
            },
            'mouseup .webrew-input-list-item': function (event, template) {
                template.$(event.currentTarget).toggleClass("webrew-input-active", true);
                template.instance.setSelectedValue(event.currentTarget.dataset);
                template.instance.toggleDropdown();
                template.$("#" + template.data.elementId).focus();
                template.jqElement.trigger("webrew-input-mouseup");
            },
            // Custom Events for the control
            'mouseleave webrew-dynamic-input': function (event, template) {
        
            },
            'mouseenter webrew-dynamic-input': function (event, template) {
        
            },
            'webrew-input-dropdown-hide': function (event, template) {
                template.highlightedIndex.set(-2);
                template.range.set([0, template.data.maxVisibleRange])
                template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
                template.$('.webrew-input-list-item').toggleClass("webrew-input-active", false)
                template.$('.webrew-input-list-item').toggleClass("webrew-input-active-click", false)
                // console.log("webrew-input-dropdown-hide");
            },
            'webrew-input-dropdown-show': function (event, template) {
                // console.log("webrew-input-dropdown-show");
            },
            'webrew-input-selection-changed': function(event, template){
                template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", false);
                template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", false);
                template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", false);
        
                // console.log("webrew-input-selection-changed")
            },
            'webrew-input-mousedown': function(event, template){
                template.isMouseDown.set(true);
                // console.log("webrew-input-mousedown")
            },
            'webrew-input-mouseup': function (event, template){
                template.isMouseDown.set(false);
                // console.log("webrew-input-mouseup")
            },
            'webrew-input-toggle-dropdown-mousedown': function (event, template){
                // console.log("webrew-input-toggle-dropdown-mousedown");
                template.jqElement.trigger("webrew-input-mousedown");
            },
            'webrew-input-toggle-dropdown-mouseup': function(event, template){
                if(template.isMouseDown.get()){
                    template.$("#" + template.data.elementId).focus();
                    template.highlightedIndex.set(template.highlightedIndex.get() + 1);
                    template.instance.toggleDropdown()
                }
                template.jqElement.trigger("webrew-input-mouseup");
                // console.log("webrew-input-toggle-dropdown-mousedown");
            },
            'webrew-input-clear': function(event, template){
                template.key.set("");
                template.instance.setKey("");
                template.instance.setValue("");
                template.dataBind(true);
                template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", false);
                template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", false);
                // console.log('webrew-input-clear');
            },
            'webrew-input-deselection': function(event, template){
                if(template.instance.getValue() != ""){
                    template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", template.instance.getKey() == "");
                    template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", template.instance.getKey() == "");
                }
            },
            'wi-selection-changed': function(event, template, item){
                template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", false);
                template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", false);
                template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", false);

                template.instance.setValue(item.value);
                template.instance.setKey(item.key);

                if(typeof template.data.onSelectionChanged === "function"){
                    template.data.onSelectionChanged(event, template, item);
                }
            },
            'wi-internal-keyup': function(event, template){
                template.dataBind(true);
            },
            'wi-internal-enter': function(event, template, target){
                template.instance.setSelectedValue(target.dataset);
                template.instance.hideDropdown();
            }
        };
    }

    registerDefaultEvents()
    {
        if(WebrewInput.eventsAreRegistered)
        {
            return;
        }

        Template.webrewInput.events({
            'keydown .webrew-dynamic-input': function(event, template) { template.instance.templateEvents['keydown .webrew-dynamic-input'](event, template) },
            'keyup .webrew-dynamic-input': function(event, template) { template.instance.templateEvents['keyup .webrew-dynamic-input'](event, template) },
            'click .clearInput': function(event, template) { template.instance.templateEvents['click .clearInput'](event, template) },
            'mousedown .toggleDropdown': function(event, template) { template.instance.templateEvents['mousedown .toggleDropdown'](event, template) },
            'click .toggleDropdown': function(event, template) { template.instance.templateEvents['click .toggleDropdown'](event, template) },
            'click .js-check-all': function(event, template) { template.instance.templateEvents['click .js-check-all'](event, template) },
            'mousedown .js-check-all': function(event, template, target) { template.instance.templateEvents[ 'mousedown .js-check-all'](event, template) },
            'mouseup .toggleDropdowntest': function(event, template) { template.instance.templateEvents['mouseup .toggleDropdowntest'](event, template) },
            'mouseleave .webrew-input-list-container': function(event, template) { template.instance.templateEvents['mouseleave .webrew-input-list-container'](event, template) },
            'mouseenter .webrew-input-list-item': function(event, template) { template.instance.templateEvents['mouseenter .webrew-input-list-item'](event, template) },
            'mouseleave .webrew-input-list-item': function(event, template) { template.instance.templateEvents['mouseleave .webrew-input-list-item'](event, template) },
            'mousedown .webrew-input-list-item': function(event, template) { template.instance.templateEvents['mousedown .webrew-input-list-item'](event, template) },
            'mouseup .webrew-input-list-item': function(event, template) { template.instance.templateEvents['mouseup .webrew-input-list-item'](event, template) },
            'mouseleave webrew-dynamic-input': function(event, template) { template.instance.templateEvents['mouseleave webrew-dynamic-input'](event, template) },
            'mouseenter webrew-dynamic-input': function(event, template) { template.instance.templateEvents['mouseenter webrew-dynamic-input'](event, template) },
            'webrew-input-dropdown-hide': function(event, template) { template.instance.templateEvents['webrew-input-dropdown-hide'](event, template) },
            'webrew-input-dropdown-show': function(event, template) { template.instance.templateEvents['webrew-input-dropdown-show'](event, template) },
            'webrew-input-selection-changed': function(event, template) { template.instance.templateEvents['webrew-input-selection-changed'](event, template) },
            'webrew-input-mousedown': function(event, template) { template.instance.templateEvents['webrew-input-mousedown'](event, template) },
            'webrew-input-mouseup': function(event, template) { template.instance.templateEvents['webrew-input-mouseup'](event, template) },
            'webrew-input-toggle-dropdown-mousedown': function(event, template) { template.instance.templateEvents['webrew-input-toggle-dropdown-mousedown'](event, template) },
            'webrew-input-toggle-dropdown-mouseup': function(event, template) { template.instance.templateEvents['webrew-input-toggle-dropdown-mouseup'](event, template) },
            'webrew-input-clear': function(event, template) { template.instance.templateEvents['webrew-input-clear'](event, template) },
            'webrew-input-deselection': function(event, template) { template.instance.templateEvents['webrew-input-deselection'](event, template) },
            'wi-selection-changed': function(event, template, item) { template.instance.templateEvents['wi-selection-changed'](event, template, item) },
            'wi-internal-keyup': function(event, template) { template.instance.templateEvents['wi-internal-keyup'](event, template) },
            'wi-internal-enter': function(event, template, target) { template.instance.templateEvents['wi-internal-enter'](event, template, target) },
           
        });

        WebrewInput.eventsAreRegistered = true;
    }
}

class WebrewInputKeys
{
    static ArrowDown(event, template)
    {
        let index = template.highlightedIndex.get();
        let list = template.$(".webrew-input-list").children().toArray();
        let range = [...template.range.get()];   

        if (template.$(".webrew-input-list-container").hasClass("webrew-input-list-hidden")) {
            if(template.key.get() !== ""){
                let selectedIndex = 0;
                if(template.items.get().some((value, index) => {
                    if(value.key == template.key.get()){
                        selectedIndex = index;
                    }
                    return value.key == template.key.get()
                }))
                {
                    template.$(list[selectedIndex]).addClass("webrew-input-active")
                    template.highlightedIndex.set(selectedIndex);
                    template.instance.setValue(template.$(list[selectedIndex])[0].dataset.value);
                    template.instance._setTemporaryKeyboardSelectedItem(template.$(list[selectedIndex ])[0].dataset)

                    template.instance.showDropdown(template);
                    if(selectedIndex > template.data.maxVisibleRange){
                        template.$(".webrew-input-list-container").scrollTop((selectedIndex) * 44)
                    }
                }
            }
            else
            {
                template.instance.showDropdown(template);
            }
            return;
        }

        if (index == -2) {
            template.highlightedIndex.set(index + 1);
            index++;
        }
        if (index == template.items.get().length - 1) {
            return;
        }
        else {
            template.$(list[index]).toggleClass("webrew-input-active", false)
            template.$(list[index + 1]).addClass("webrew-input-active")
            template.highlightedIndex.set(index + 1);
            template.instance.setValue(template.$(list[index + 1])[0].dataset.value);
            template.instance._setTemporaryKeyboardSelectedItem(template.$(list[index + 1])[0].dataset)
        }
        if(index == range[1]){
            template.range.set([range[0] + 1, range[1] + 1])
            template.$(".webrew-input-list-container").scrollTop((range[0] + 1) * 44)
        }

        if(index < range[0] || index > range[1]){
            template.$(".webrew-input-list-container").scrollTop((index - 1) * 44)
        }

        template.searching.set(false);
        return;
    }

    static ArrowUp(event, template)
    {
        let index = template.highlightedIndex.get();
        let list = template.$(".webrew-input-list").children().toArray();
        let range = [...template.range.get()]; 

        if (index == 0) {
            if (template.$(".webrew-input-list-container").hasClass("webrew-input-list-open")) {
                template.instance.hideDropdown(template);
                return;
            }
        }
        else if (index == -1) {
            template.highlightedIndex.set(index - 1);
            template.instance.hideDropdown(template);
            return;
        }
        else if (index == -2){
            return;
        }
        else {
            template.$(list[index]).toggleClass("webrew-input-active", false)
            template.$(list[index - 1]).addClass("webrew-input-active")
            template.highlightedIndex.set(index - 1);
        }

        if(index == range[0]){
            // console.log(index, range);
            template.range.set([range[0] - 1, range[1] - 1])
            template.$(".webrew-input-list-container").scrollTop((range[0] - 1) * 44)
        }

        if(index < range[0] || index > range[1]){
            template.$(".webrew-input-list-container").scrollTop((index - 1) * 44)
        }

        template.instance.setValue(template.$(list[index - 1])[0].dataset.value);
        template.instance._setTemporaryKeyboardSelectedItem(template.$(list[index - 1])[0].dataset)
        
        template.searching.set(false);
        return;
    }

    static Enter(event, template)
    {
        event.preventDefault();
        event.stopPropagation();

        if(template.isDropDownOpen.get() && !template.searching.get())
        {
            template.jqElement.trigger("wi-internal-enter", [$(".webrew-input-active")[0]])
            template.instance._setTemporaryKeyboardSelectedItem(null);
            template.searching.set(false);
        }

        return;
    }

    static Backspace()
    {

    }
}

module.exports = {
    WebrewToast: WebrewToast,
    WebrewModal: WebrewModal,
    WebrewColorPallet: WebrewColorPallet,
    WebrewInput: WebrewInput
}