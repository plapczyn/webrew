import './webrewInput.html';
import '../../styles/common.css';
import Common from '../scripts/common.js'

Template.webrewInput.onCreated(function () {
    this.isMouseDown = new ReactiveVar(false);
    this.highlightedIndex = new ReactiveVar(-1);
    this.items = new ReactiveVar([]);
});

Template.webrewInput.helpers({
    items: function (){
        Template.instance().items.set([
        { value: "Item 1", key: "1" },
        { value: "Item 2", key: "2" },
        { value: "Item 3", key: "3" },
        { value: "Item 4", key: "4" },
        { value: "Item 2", key: "2" },
        { value: "Item 3", key: "3" },
        { value: "Item 4", key: "4" }]);

        return Template.instance().items.get();
    }
});

Template.webrewInput.events({
    'click .toggleDropdown': function (event, template) {
        event.preventDefault();
        Common.WebrewInput.ToggleDropdown(template)
    },
    'mouseenter .webrew-input-list-item': function(event, template){
        if(template.isMouseDown.get()){
            template.$(event.target).toggleClass("testtest", true)
            template.$(event.fromElement).toggleClass("testtest", false)
        }

        template.$('.webrew-input-list-item').toggleClass("webrew-item-highlight", false)
        template.$(event.target).addClass("webrew-item-highlight")
    },
    'mouseleave .webrew-input-list-item': function(event, template){
        template.$(event.target).removeClass("webrew-item-highlight")
    },
    'mouseleave .webrew-input-list-container': function(event, template){
        template.$(".webrew-input-list-item").toggleClass("testtest", false)
    },
    'mousedown .webrew-input-list-item': function(event, template){
        template.$(event.target).addClass("testtest");
    },
    'mouseup .webrew-input-list-item': function(event, template){
        template.$(event.target).removeClass("testtest")
        let value = template.$(event.target).attr("data-value")
        let key = template.$(event.target).attr("data-key")
        template.$("#" + template.data.elementId).val(value);
        template.$("#" + template.data.elementId + "_hiddenKey").val(key);
        Common.WebrewInput.ToggleDropdown(template);
    },
    'click .webrew-input-list-item': function(event, template){

    }
});

Template.webrewInput.onRendered(function (){
    var template = Template.instance();
    $(document).on("mousedown", function(){
        template.isMouseDown.set(true);
    });

    $(document).on("mouseup", function(){
        template.isMouseDown.set(false);
    });
});