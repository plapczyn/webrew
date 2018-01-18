import './webrewInput.html';
import '../../styles/common.css';

Template.webrewInput.onCreated(() => {

});

Template.webrewInput.helpers({
    items: function (idk, template) {
        return [{ value: "Item 1", key: "1" },
        { value: "Item 2", key: "2" },
        { value: "Item 3", key: "3" },
        { value: "Item 4", key: "4" }];
    }
});

Template.webrewInput.events({
    'click .toggleDropdown': function (event, template) {
        event.preventDefault();

        template.$(".webrew-input-list-container").toggleClass("webrew-input-list-hidden")
        template.$(".webrew-input-list-container").toggleClass("webrew-input-list-open")
        template.$("#webrew-input-icon").toggleClass("fa-chevron-down")
        template.$("#webrew-input-icon").toggleClass("fa-chevron-up")
    }
});