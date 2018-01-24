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
    // options;
    template;

    constructor(template)
    {
        this.template = template;
        let index = -1;
        let hasInstance = WebrewInput.instances.some((instance, i) => {
            if(template.data.elementId == instance.temp.data.elementId){
                index = i;
            }

            return template.data.elementId == instance.temp.data.elementId;
        });

        if(hasInstance)
        {
            WebrewInput.instances.splice(index, 1);
        }

        WebrewInput.instances.push(this);
    }

    getValue()
    {
        return this.template.$("#" + this.template.data.elementId + "_hiddenKey").val();
    }

    static GetById(id)
    {
        return WebrewInput.instances.filter((instance) => {
            return instance.template.data.elementId == id;
        })[0];
    }

    static ToggleDropdown(template){
        if(template.$(".webrew-input-list-container").hasClass("webrew-input-list-open"))
        {
            this.HideDropdown(template);
        }
        else
        {
            this.ShowDropdown(template);
        }
    }

    static HideDropdown(template)
    {
        this.hideShowDropDown(template, false);
    }

    static ShowDropdown(template)
    {
        this.hideShowDropDown(template, true);
    }

    static hideShowDropDown(template, show)
    {
        let hide;
        hide = (typeof show == "undefined" ? undefined : !show);

        template.$(".webrew-input-list-container").toggleClass("webrew-input-list-hidden", hide)
        template.$(".webrew-input-list-container").toggleClass("webrew-input-list-open", show)
        template.$("#webrew-input-icon").toggleClass("fa-chevron-down", !show)
        template.$("#webrew-input-icon").toggleClass("fa-chevron-up", show)
        template.$(".webrew-input-list-container").scrollTop(true);

        if(show)
        {
            template.$(".webrew-input-control-container").trigger("webrew-input-dropdown-show");
        }
        else
        {
            template.$(".webrew-input-control-container").trigger("webrew-input-dropdown-hide");
        }
        
        template.isDropDownOpen.set(show);
    }

    static SetSelectedValue(template){
        let element = template.$(".webrew-input-active")[0];
        let value = template.$(element).attr("data-value")
        let key = template.$(element).attr("data-key")
        this.SetValue(template, key, value);
    }

    static SetValue(template, key, value){
        template.$("#" + template.data.elementId).val(value);
        template.$("#" + template.data.elementId + "_hiddenKey").val(key);
        template.$(".webrew-input-control-container").trigger("webrew-input-selection-changed")
    }

    static ClearInput(template)
    {
        this.SetValue(template, -1, "");
        if(template.isDropDownOpen.get())
        {
            template.highlightedIndex.set(-1);
        }
        else
        {
            template.highlightedIndex.set(-2);
        }

        template.searchText.set("");
        template.searching.set(false);
        template.dataBind(true);
        template.$(".webrew-input-list-item").toggleClass("webrew-input-active", false);
        template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", true);
        template.$("#" + template.data.elementId).focus();
    }

    static KeyDown(event, template)
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
                    WebrewInputKeys.ArrowDown(event, template);
                    handled = true;
                    break;
                }
                case "ArrowUp":
                {
                    WebrewInputKeys.ArrowUp(event, template);
                    handled = true;
                    break;
                }
                case "Enter":
                {
                    WebrewInputKeys.Enter(event, template);
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
            // Suppress "double action" if event handled
          }
    }

    static KeyUp(event, template)
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
                    let text = template.$(event.target).val();
                    if(text == ""){
                        WebrewInput.ClearInput(template)
                    }
            
                    template.searchText.set(text)
                    template.dataBind(true);
                    switch (event.which){
                        case 13:
                        break;
                        case 38:
                        break;
                        case 40:
                        break;
                        default: 
                        {
                            if(template.$(".webrew-input-list-container").hasClass("webrew-input-list-hidden")){
                                WebrewInput.ShowDropdown(template);
                            }
                            template.searching.set(true);
                        }
                    }
                    console.log("input change")
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
            WebrewInput.ShowDropdown(template);
        }

        if (index == -2) {
            template.highlightedIndex.set(index + 1);
        }
        else if (index == template.items.get().length - 1) {
            return;
        }
        else {
            template.$(list[index]).toggleClass("webrew-input-active", false)
            template.$(list[index + 1]).addClass("webrew-input-active")
            template.highlightedIndex.set(index + 1);
            WebrewInput.SetSelectedValue(template);
        }
        if(index == range[1]){
            template.range.set([range[0] + 1, range[1] + 1])
            template.$(".webrew-input-list-container").scrollTop((range[0] + 1) * 44)
        }

        if(index < range[0] || index > range[1]){
            template.$(".webrew-input-list-container").scrollTop((index - 1) * 44)
        }

        console.log(index, range);
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
                WebrewInput.HideDropdown(template);
                return;
            }
        }
        else if (index == -1) {
            template.highlightedIndex.set(index - 1);
            WebrewInput.HideDropdown(template);
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
            console.log(index, range);
            template.range.set([range[0] - 1, range[1] - 1])
            template.$(".webrew-input-list-container").scrollTop((range[0] - 1) * 44)
        }

        if(index < range[0] || index > range[1]){
            template.$(".webrew-input-list-container").scrollTop((index - 1) * 44)
        }

        WebrewInput.SetSelectedValue(template);
        template.searching.set(false);
        return;
    }

    static Enter(event, template)
    {
        WebrewInput.SetSelectedValue(template);
        WebrewInput.HideDropdown(template);
        template.searching.set(false);
        event.preventDefault();
        event.stopPropagation();
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