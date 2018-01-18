import './webrewInput.html';
import '../../styles/common.css';
import Common from '../scripts/common.js'

Template.webrewInput.onCreated(() => {
    
});

Template.webrewInput.helpers({
    items: function (idk, template) {
        return [{ value: "Item 1", key: "1" },
        { value: "Item 2", key: "2" },
        { value: "Item 3", key: "3" },
        { value: "Item 4", key: "4" },
        { value: "Item 2", key: "2" },
        { value: "Item 3", key: "3" },
        { value: "Item 4", key: "4" }];
    }
});

Template.webrewInput.events({
    'click .toggleDropdown': function (event, template) {
        event.preventDefault();
        Common.WebrewInput.HideDropdown(template)
    },
    'mouseenter .webrew-input-list-item': function(event, template){
        template.$(event.target).addClass("webrew-item-highlight")
    },
    'mouseleave .webrew-input-list-item': function(event, template){
        template.$(event.target).removeClass("webrew-item-highlight")
    },
    'click .webrew-input-list-item': function(event, template){
       let value = template.$(event.target).attr("data-value")
       let key = template.$(event.target).attr("data-key")
       template.$("#" + template.data.elementId).val(value);
       template.$("#" + template.data.elementId + "_hiddenKey").val(key);
       Common.WebrewInput.HideDropdown(template);
    }
});