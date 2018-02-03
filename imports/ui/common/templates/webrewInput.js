import './webrewInput.html';
import '../../styles/common.css';
import Common from '../scripts/common.js'

Template.webrewInput.onCreated(function () {
    //TODO make this nicer
    this.data.mode = this.data.mode || "default";
    this.isMultipleSelection = false || this.data.mode == "checkbox";

    this.instance = new Common.WebrewInput(this);

    this.instance.registerEvents(this);
    this.instance.registerHelpers(this);

    this.isMouseDown = new ReactiveVar(false);
    this.highlightedIndex = new ReactiveVar(-2);
    this.data.rowCount = this.data.rowCount || 5
    this.data.maxVisibleRange = this.data.rowCount - 1;
    this.range = new ReactiveVar([0, this.data.rowCount - 1]);
    this.items = new ReactiveVar([]);
    this.isDropDownOpen = new ReactiveVar(false);
    this.searchText = new ReactiveVar("");
    this.searching = new ReactiveVar(false);
    this.searchBoxHeight = new ReactiveVar((this.data.rowCount) * 44 + 2)
    this.key = new ReactiveVar(this.data.key || "");
    this.selectedItems = new ReactiveVar([]);
    // this.data.checkbox = this.data.mode == "checkbox";

    this.dataBind = (forceBind) => {
        if(this.searching.get() || forceBind){
            Meteor.call(this.data.method, this.searchText.get(), this.key.get(), (err, res) => {
                if(!err){
                    this.items.set(res);

                    if(this.key.get() != "")
                    {
                        this.instance.setValue(res[0].value)
                    }

                    if(res.length == 0){
                        this.instance.setKey("");
                        // TODO
                        // this.$("#" + this.data.elementId).toggleClass("webrew-dynamic-input-new", true);
                    }
                    else
                    {
                        // TODO
                        // this.$("#" + this.data.elementId).toggleClass("webrew-dynamic-input-new", false);
                    }

                    if(res.length < (this.data.rowCount)){
                        this.range.set([0, res.length]);
                        this.searchBoxHeight.set(res.length * 44 + 2);
                        this.$(this.$(".webrew-input-list-container")[0]).css("height", this.searchBoxHeight.get())
                    }
                    else{
                        this.range.set([0, (this.data.maxVisibleRange)]);
                        this.searchBoxHeight.set((this.data.rowCount) * 44 + 2);
                        this.$(this.$(".webrew-input-list-container")[0]).css("height", this.searchBoxHeight.get())
                    }
                }
                else{
                }
            });
        }
    }

    if(typeof this.data.initialize === "function"){
        this.data.initialize(this.instance);
    }

    this.dataBind(true);
});



// Template.webrewInput.events({
//     'keydown .webrew-dynamic-input': function(event, template){
//         template.instance.keyDown(event);
//     },
//     'keyup .webrew-dynamic-input': function(event, template){
//         template.instance.keyUp(event);
//     },
//     'click .clearInput': function (event, template){
//         event.preventDefault();
//         template.searching.set(false);
//         template.instance.clearInput();
//     },
//     'mousedown .toggleDropdown': function (event, template) {
//         event.preventDefault();
//         event.stopPropagation();
//         template.jqElement.trigger("webrew-input-toggle-dropdown-mousedown");
//     },
//     'click .toggleDropdown': function (event, template) {
//         event.preventDefault();
//         event.stopPropagation();
//     },
//     'mouseup .toggleDropdowntest': function (event, template) {
//         event.preventDefault();
//         event.stopPropagation();
//         template.jqElement.trigger("webrew-input-toggle-dropdown-mouseup");
//     },
//     'mouseleave .webrew-input-list-container': function (event, template) {
//         if(template.isMouseDown.get()){
//             template.$(".webrew-input-list-item").removeClass("webrew-input-active-click", false)
//         }
//         template.$(".webrew-input-list-item").toggleClass("webrew-item-highlight", false)
//     },
//     'mouseenter .webrew-input-list-item': function (event, template) {
//         if (template.isMouseDown.get()) {
//             template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false)
//             template.$(event.target).toggleClass("webrew-input-active-click", true)
//         }
//         else{
//             template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
//             template.$(event.target).addClass("webrew-item-highlight")
//         }
//     },
//     'mouseleave .webrew-input-list-item': function (event, template) {
//         template.$(event.target).removeClass("webrew-item-highlight")
//     },
//     'mousedown .webrew-input-list-item': function (event, template) {
//         event.stopPropagation();
//         event.preventDefault();
//         template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false);
//         template.$(event.currentTarget).addClass("webrew-input-active-click");

//         if(template.mode == "default"){

//         }
//         else{

//         }

//         template.$(".webrew-input-control-container").trigger("webrew-input-mousedown");
//     },
//     'mouseup .webrew-input-list-item': function (event, template) {
//         if(template.mode == "checkbox"){
//             $(event.currentTarget).find(".fa-check").toggleClass("webrew-input-checkbox-unchecked")
//             $(event.currentTarget).find(".fa-check").toggleClass("webrew-input-checkbox-checked")
//             template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false);
//         }
//         else{
//             template.$(event.currentTarget).toggleClass("webrew-input-active", true);
//             template.instance.setSelectedValue();
//             template.instance.toggleDropdown();
//         }

//         template.$("#" + template.data.elementId).focus();
//         template.jqElement.trigger("webrew-input-mouseup");
//     },
//     'click .webrew-input-list-item': function (event, template) {

//     },
//     // Custom Events for the control
//     'mouseleave webrew-dynamic-input': function (event, template) {

//     },
//     'mouseenter webrew-dynamic-input': function (event, template) {

//     },
//     'webrew-input-dropdown-hide': function (event, template) {
//         template.highlightedIndex.set(-2);
//         template.range.set([0, template.data.maxVisibleRange])
//         template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
//         template.$('.webrew-input-list-item').toggleClass("webrew-input-active", false)
//         template.$('.webrew-input-list-item').toggleClass("webrew-input-active-click", false)
//         // console.log("webrew-input-dropdown-hide");
//     },
//     'webrew-input-dropdown-show': function (event, template) {
//         // console.log("webrew-input-dropdown-show");
//     },
//     'webrew-input-selection-changed': function(event, template){
//         template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", false);
//         template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", false);
//         template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", false);

//         // console.log("webrew-input-selection-changed")
//     },
//     'webrew-input-mousedown': function(event, template){
//         template.isMouseDown.set(true);
//         // console.log("webrew-input-mousedown")
//     },
//     'webrew-input-mouseup': function (event, template){
//         template.isMouseDown.set(false);
//         // console.log("webrew-input-mouseup")
//     },
//     'webrew-input-toggle-dropdown-mousedown': function (event, template){
//         // console.log("webrew-input-toggle-dropdown-mousedown");
//         template.jqElement.trigger("webrew-input-mousedown");
//     },
//     'webrew-input-toggle-dropdown-mouseup': function(event, template){
//         if(template.isMouseDown.get()){
//             template.$("#" + template.data.elementId).focus();
//             template.highlightedIndex.set(template.highlightedIndex.get() + 1);
//             template.instance.toggleDropdown()
//         }
//         template.jqElement.trigger("webrew-input-mouseup");
//         // console.log("webrew-input-toggle-dropdown-mousedown");
//     },
//     'webrew-input-clear': function(event, template){
//         template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", false);
//         template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", false);
//         // console.log('webrew-input-clear');
//     },
//     'webrew-input-deselection': function(event, template){
//         if(template.instance.getValue() != ""){
            
//             template.$(".webrew-input-clear-icon").toggleClass("webrew-input-clear-icon-new", template.instance.getKey() == "");
//             template.$("#" + template.data.elementId).toggleClass("webrew-dynamic-input-new", template.instance.getKey() == "");
//         }
//     }
// });

Template.webrewInput.onRendered(function () {
    var template = Template.instance();
    this.jqElement = template.$(".webrew-input-control-container");
    // Set Height of dropdown
    let height = template.data.rowCount;
    height = height * 44;
    $($(".webrew-input-list-container")[0]).css("height", height)

    if(template.data.required){
        template.$(".webrew-dynamic-input").attr("required", "required");
    }

    $(document).on("mousedown", function (event) {
        let inputFields = template.$(".webrew-input-control-container").children().toArray();
        let inputWasClicked = inputFields.some((element) => { return element == event.target });

        if (inputWasClicked) {
            template.$(".webrew-dynamic-input").focus();
        }
        else {
            template.$(".webrew-dynamic-input").blur();
        }

        template.isMouseDown.set(true);
    });

    $(document).on("mouseup", function () {
        template.isMouseDown.set(false);
    });

    template.$("#" + template.data.elementId).blur((event) => {
        if(!template.isMultipleSelection)
        {
            if(template.items.get().some(value => template.instance.getValue() == value.value)){
                let key = template.items.get().filter(value => value.value == template.instance.getValue())[0].key

                    template.instance.setKey(key);
            }
            else{
                template.instance.setKey("");
            }
        }
        
        template.instance._setTemporaryKeyboardSelectedItem(null);
        template.jqElement.trigger("webrew-input-deselection")
        template.instance.hideDropdown();
    });

    // Setting the range of where the hell we are in the scroll
    template.$(".webrew-input-list-container").scroll((event) => {
        let range = template.range.get();
        let maxRange = template.data.maxVisibleRange

        if(Math.round(template.$(event.target).scrollTop() / 44) <= template.$(event.target).scrollTop() / 44){
            template.range.set([Math.round(template.$(event.target).scrollTop() / 44), Math.round(template.$(event.target).scrollTop() / 44 + maxRange)]);
            // console.log(template.range.get());
        }
    })
});