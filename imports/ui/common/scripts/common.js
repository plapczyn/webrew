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
    static Show(message, title, type)
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
        this.verifyOptions(options);
        if(this.initialized)
        {
            this.reRender(options);
        }
        else
        {
            this.render(options)
        }
        
        $("#webrewModalDialog").modal("show");
    }

    static reRender(options)
    {
        Blaze.remove(this.renderedTemplate);
        this.renderedTemplate = null;

       this.SetTemplateHelpers(options)

        this.renderedTemplate = Blaze.render(Template.webrewModal, $("body")[0]);
    }

    static render(options)
    {
        Template.webrewModal.events({
            'click .ok': (event, template) => 
            {
                if(typeof options.okCallback == "function")
                {
                    options.okCallback(event);
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

        this.SetTemplateHelpers(options)

        this.renderedTemplate = Blaze.render(Template.webrewModal, $("body")[0]);
        this.initialized = true;
    }

    static Hide()
    {
        $("#webrewModalDialog").modal("hide");
    }

    static verifyOptions(options){
        if(typeof options.template == "undefined")
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

    static SetTemplateHelpers(options)
    {
        Template.webrewModal.helpers({
            modalBody: options.template,
            title: options.title || "",
            coffeeOk: options.coffeeOk || false,
            data: options.data
        });
    }
}

module.exports = {
    WebrewToast: WebrewToast,
    WebrewModal: WebrewModal
}