import './webrewInput.html';
import '../../styles/common.css';
import Common from '../scripts/common.js'

Template.webrewInput.onCreated(function () {
    this.isMouseDown = new ReactiveVar(false);
    this.highlightedIndex = new ReactiveVar(-2);
    this.range = new ReactiveVar([0, this.data.rowCount || 5]);
    this.items = new ReactiveVar([]);
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
    'click .toggleDropdown': function (event, template) {
        event.preventDefault();
        template.$("#" + template.data.elementId).focus();
        template.highlightedIndex.set(template.highlightedIndex.get() + 1);
        Common.WebrewInput.ToggleDropdown(template)
    },
    'mouseleave .webrew-input-list-container': function (event, template) {
        template.$(".webrew-input-list-item").toggleClass("testtest", false)
    },
    'mouseenter .webrew-input-list-item': function (event, template) {
        if (template.isMouseDown.get()) {
            template.$(event.target).toggleClass("testtest", true)
            template.$(event.fromElement).toggleClass("testtest", false)
        }

        let list = template.$(".webrew-input-list").children().toArray();
        let index = -1;
        let element = list.filter((element, i) => {
            if (element == event.target) {
                index = i;
                return element == event.target;
            }
        });

        template.highlightedIndex.set(index);

        template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
        template.$(event.target).addClass("webrew-item-highlight")
    },
    'mouseleave .webrew-input-list-item': function (event, template) {
        template.$(event.target).removeClass("webrew-item-highlight")
    },

    'mousedown .webrew-input-list-item': function (event, template) {
        template.$(event.target).addClass("testtest");
    },
    'mouseup .webrew-input-list-item': function (event, template) {
        template.$(event.target).removeClass("testtest")
        let value = template.$(event.target).attr("data-value")
        let key = template.$(event.target).attr("data-key")
        template.$("#" + template.data.elementId).val(value);
        template.$("#" + template.data.elementId + "_hiddenKey").val(key);
        Common.WebrewInput.ToggleDropdown(template);
    },
    'click .webrew-input-list-item': function (event, template) {

    },
    'mouseleave webrew-dynamic-input': function (event, template) {

    },
    'mouseenter webrew-dynamic-input': function (event, template) {

    },
    'webrew-input-dropdown-hide': function (event, template) {
        template.highlightedIndex.set(-2);
        template.range.set([0, template.data.rowCount || 5])
        template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
        console.log("webrew-input-dropdown-hide")
    },
    'webrew-input-dropdown-show': function (event, template) {
        console.log("webrew-input-dropdown-show")
    },
    'webrew-input-selection-changed': function(event, template){
        
    }
});

Template.webrewInput.onRendered(function () {
    var template = Template.instance();

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

    template.$("#" + template.data.elementId).keydown((event) => {
        let index = template.highlightedIndex.get();
        let list = $(".webrew-input-list").children().toArray();
        let range = [...template.range.get()];

        switch (event.which) {
            case 37: // left
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
                    template.$(list[index]).toggleClass("webrew-item-highlight", false)
                    template.$(list[index - 1]).addClass("webrew-item-highlight")
                    template.highlightedIndex.set(index - 1);
                }

                if(index == range[0]){
                    template.range.set([range[0] - 1, range[1] - 1])
                    template.$(".webrew-input-list-container").scrollTop((range[0] - 1) * 44)
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
                    template.$(list[index]).toggleClass("webrew-item-highlight", false)
                    template.$(list[index + 1]).addClass("webrew-item-highlight")
                    template.highlightedIndex.set(index + 1);
                    Common.WebrewInput.SetSelectedValue(template);
                }
                if(index == range[1]){
                    template.range.set([range[0] + 1, range[1] + 1])
                    template.$(".webrew-input-list-container").scrollTop((range[0] + 1) * 44)
                }

                break;

            default: return; // exit this handler for other keys
        }

        event.preventDefault(); // prevent the default action (scroll / move caret)
    });
});