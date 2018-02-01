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
        return this.template.$("#" + this.template.data.elementId + "_hiddenKey").val();
    }

    getValue()
    {
        return this.template.$("#" + this.template.data.elementId).val();
    }

    setKey(key)
    {
        this.template.$("#" + this.template.data.elementId + "_hiddenKey").val(key);
        this.template.key.set(key);
    }

    setValue(value)
    {
        this.template.$("#" + this.template.data.elementId).val(value);
        this.template.$(".webrew-input-control-container").trigger("webrew-input-selection-changed")
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

    setSelectedValue(){
        let element = this.template.$(".webrew-input-active")[0];
        let value = this.template.$(element).attr("data-value")
        let key = this.template.$(element).attr("data-key")
        this.setValue(value);
        this.setKey(key);
    }

    clearInput()
    {
        this.setKey("");
        this.setValue("");
        
        if(this.template.isDropDownOpen.get())
        {
            this.template.highlightedIndex.set(-1);
        }
        else
        {
            this.template.highlightedIndex.set(-2);
        }

        this.template.searchText.set("");
        this.template.searching.set(false);
        this.template.key.set("");
        this.template.dataBind(true);
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
                    this.template.dataBind(true);
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
                    template.instance.setSelectedValue(template);
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
            template.instance.setSelectedValue(template);
        }
        if(index == range[1]){
            template.range.set([range[0] + 1, range[1] + 1])
            template.$(".webrew-input-list-container").scrollTop((range[0] + 1) * 44)
        }

        if(index < range[0] || index > range[1]){
            template.$(".webrew-input-list-container").scrollTop((index - 1) * 44)
        }

        // console.log(index, range);
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

        template.instance.setSelectedValue(template);
        template.searching.set(false);
        return;
    }

    static Enter(event, template)
    {
        if(template.isDropDownOpen.get() && !template.searching.get())
        {
            template.instance.setSelectedValue();
            template.instance.hideDropdown();
            template.searching.set(false);
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            event.preventDefault();
            event.stopPropagation();
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