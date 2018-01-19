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
    // static instances = [];
    // options;
    // template;

    constructor(options)
    {
        // this.options = options;
        // this.options.elementId = "webrewInput" + this.options.renderOnId + WebrewInput.instances.length;
        // this.render();
    }
    
    render()
    {
        // this.template = Blaze.renderWithData(Template.webrewInput, this.options, $("#" + this.options.renderOnId)[0]);
        // WebrewInput.instances.push(this.template);
    }

    static ToggleDropdown(template){
        template.$(".webrew-input-list-container").toggleClass("webrew-input-list-hidden")
        template.$(".webrew-input-list-container").toggleClass("webrew-input-list-open")
        template.$("#webrew-input-icon").toggleClass("fa-chevron-down")
        template.$("#webrew-input-icon").toggleClass("fa-chevron-up")
        template.$(".webrew-input-list-container").scrollTop(true);
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
    }
}

module.exports = {
    WebrewToast: WebrewToast,
    WebrewModal: WebrewModal,
    WebrewColorPallet: WebrewColorPallet,
    WebrewInput: WebrewInput
}