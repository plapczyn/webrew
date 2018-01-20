import './webrewInput.html';
import '../../styles/common.css';
import Common from '../scripts/common.js'

Template.webrewInput.onCreated(function () {
    this.isMouseDown = new ReactiveVar(false);
    this.highlightedIndex = new ReactiveVar(-2);
    this.range = new ReactiveVar([0, this.data.rowCount || 5]);
    this.items = new ReactiveVar([]);
    this.isDropDownOpen = new ReactiveVar(false);
});

Template.webrewInput.helpers({
    items: function () {
        Template.instance().items.set([
            { value: "Item 1", key: "1" },
            { value: "Item 2", key: "2" },
            { value: "Item 3", key: "3" },
            { value: "Item 4", key: "4" },
            { value: "Item 5", key: "5" },
            { value: "Item 6", key: "6" },
            { value: "Item 7", key: "7" },
            { value: "Item 8", key: "8" },
            { value: "Item 9", key: "9" },
            { value: "Item 10", key: "10" },
            { value: "Item 11", key: "11" }]);

        return Template.instance().items.get();
    }
});

Template.webrewInput.events({
    'click .clearInput': function (event, template){
        event.preventDefault();
        Common.WebrewInput.ClearInput(template);
        console.log("input cleared")
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

        // let list = template.$(".webrew-input-list").children().toArray();
        // let index = -1;
        // let element = list.filter((element, i) => {
        //     if (element == event.target) {
        //         index = i;
        //         return element == event.target;
        //     }
        // });

        // template.highlightedIndex.set(index);

    },
    'mouseleave .webrew-input-list-item': function (event, template) {
        template.$(event.target).removeClass("webrew-item-highlight")
    },

    'mousedown .webrew-input-list-item': function (event, template) {
        event.stopPropagation();
        event.preventDefault();
        template.$(".webrew-input-list-item").toggleClass("webrew-input-active-click", false);
        template.$(event.target).addClass("webrew-input-active-click");
        template.$(".webrew-input-control-container").trigger("webrew-input-mousedown");
    },
    'mouseup .webrew-input-list-item': function (event, template) {
        template.$(".webrew-input-list-item").toggleClass("webrew-input-active", false);
        template.$(event.target).toggleClass("webrew-input-active", true);
        Common.WebrewInput.SetSelectedValue(template);
        Common.WebrewInput.ToggleDropdown(template);
        template.$("#" + template.data.elementId).focus();
        template.jqElement.trigger("webrew-input-mouseup");
    },
    'click .webrew-input-list-item': function (event, template) {

    },
    // Custom Events for the control
    'mouseleave webrew-dynamic-input': function (event, template) {

    },
    'mouseenter webrew-dynamic-input': function (event, template) {

    },
    'webrew-input-dropdown-hide': function (event, template) {
        template.highlightedIndex.set(-2);
        template.range.set([0, template.data.rowCount || 5])
        template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
        template.$('.webrew-input-list-item').toggleClass("webrew-input-active", false)
        template.$('.webrew-input-list-item').toggleClass("webrew-input-active-click", false)
        console.log("webrew-input-dropdown-hide");
    },
    'webrew-input-dropdown-show': function (event, template) {
        console.log("webrew-input-dropdown-show");
    },
    'webrew-input-selection-changed': function(event, template){
        template.$(".webrew-input-clear-button").toggleClass("webrew-input-clear-hidden", false);
        console.log("webrew-input-selection-changed")
    },
    'webrew-input-mousedown': function(event, template){
        template.isMouseDown.set(true);
        console.log("webrew-input-mousedown")
    },
    'webrew-input-mouseup': function (event, template){
        template.isMouseDown.set(false);
        console.log("webrew-input-mousedown")
    },
    'webrew-input-toggle-dropdown-mousedown': function (event, template){
        console.log("webrew-input-toggle-dropdown-mousedown");
        template.jqElement.trigger("webrew-input-mousedown");
    },
    'webrew-input-toggle-dropdown-mouseup': function(event, template){
        if(template.isMouseDown.get()){
            template.$("#" + template.data.elementId).focus();
            template.highlightedIndex.set(template.highlightedIndex.get() + 1);
            Common.WebrewInput.ToggleDropdown(template)
        }
        template.jqElement.trigger("webrew-input-mouseup");
        console.log("webrew-input-toggle-dropdown-mousedown");
    }
});

Template.webrewInput.onRendered(function () {
    var template = Template.instance();
    this.jqElement = template.$(".webrew-input-control-container");
    // Set Height of dropdown
    let height = template.data.rowCount || 6;
    height = height * 44;
    $($(".webrew-input-list-container")[0]).css("height", height)

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
        Common.WebrewInput.HideDropdown(template);
    });

    template.$("#" + template.data.elementId).keydown((event) => {
        let index = template.highlightedIndex.get();
        let list = $(".webrew-input-list").children().toArray();
        let range = [...template.range.get()];

        switch (event.which) {
            case 13: // enter
                Common.WebrewInput.SetSelectedValue(template);
                Common.WebrewInput.HideDropdown(template);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 38: // up
                if (index == 0) {
                    if (template.$(".webrew-input-list-container").hasClass("webrew-input-list-open")) {
                        Common.WebrewInput.HideDropdown(template);
                        break;
                    }
                }
                else if (index == -1) {
                    template.highlightedIndex.set(index - 1);
                    Common.WebrewInput.HideDropdown(template);
                    break;
                }
                else if (index == -2){
                    break;
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

                Common.WebrewInput.SetSelectedValue(template);
                break;

            case 39: // right
                break;

            case 40: // down
                if (template.$(".webrew-input-list-container").hasClass("webrew-input-list-hidden")) {
                    Common.WebrewInput.ShowDropdown(template);
                }

                if (index == -2) {
                    template.highlightedIndex.set(index + 1);
                }
                else if (index == template.items.get().length - 1) {
                    break;
                }
                else {
                    template.$(list[index]).toggleClass("webrew-input-active", false)
                    template.$(list[index + 1]).addClass("webrew-input-active")
                    template.highlightedIndex.set(index + 1);
                    Common.WebrewInput.SetSelectedValue(template);
                }
                if(index == range[1]){
                    template.range.set([range[0] + 1, range[1] + 1])
                    template.$(".webrew-input-list-container").scrollTop((range[0] + 1) * 44)
                }

                if(index < range[0] || index > range[1]){
                    template.$(".webrew-input-list-container").scrollTop((index - 1) * 44)
                }

                console.log(index, range);
                break;

            default: return; 
        }

        event.preventDefault();
    });

    // Setting the range of where the hell we are in the scroll
    template.$(".webrew-input-list-container").scroll((event) => {
        let range = template.range.get();
        
        if(Math.round(template.$(event.target).scrollTop() / 44) <= template.$(event.target).scrollTop() / 44){
            template.range.set([Math.round(template.$(event.target).scrollTop() / 44), Math.round(template.$(event.target).scrollTop() / 44 + 5)]);
            console.log(template.range.get());
        }
    })
});