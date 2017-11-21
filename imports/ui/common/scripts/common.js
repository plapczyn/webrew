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
        this.render(options);
        $("#webrewModalDialog").modal("show");
    }

    static render(options)
    {
        if(typeof this.renderedTemplate != "undefined")
        {
            Blaze.remove(this.renderedTemplate);
            this.renderedTemplate = null;
        }

        Template.webrewModal.events({
            'click .ok': (event) => 
            {
                if(typeof options.okCallback == "function")
                {
                    options.okCallback(event);
                    this.Hide();
                }
            }
        });

        Template[options.template].onRendered = () => {}
        Template.webrewModal.helpers({
            modalBody: options.template,
            title: options.title || ""
        })
        
        this.renderedTemplate = Blaze.render(Template.webrewModal, $("body")[0]);
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
}

module.exports = {
    WebrewToast: WebrewToast,
    WebrewModal: WebrewModal
}