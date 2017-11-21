import './webrewModal.html';

class WebrewModalTemplate
{
    static isRendered = false;

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
        if(this.isRendered)
        {
            Blaze.remove(Template.webrewModal.instance());
            this.isRendered = false;
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

        Blaze.render(Template.webrewModal, $("body")[0]);
        this.isRendered = true;
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
    WebrewModalTemplate: WebrewModalTemplate
}

// Template["webrewModal"].onCreated(() => {
//   template.searchQuery = new ReactiveVar();
//   template.searching   = new ReactiveVar( false );

//   template.autorun( () => {
//     template.subscribe( 'coffeeSearch', template.searchQuery.get(), () => {
//       setTimeout( () => {
//         template.searching.set( false );
//       }, 300 );
//     });
//   });
// })


// Template["webrewModal"].helpers({

// });

// Template["webrewModal"].events({
// });

// BlazeLayout.render('webrewModal', {main:'brew'});