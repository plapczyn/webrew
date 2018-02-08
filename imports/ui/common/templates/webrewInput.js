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


    this.data.rowCount = this.data.rowCount || 5
    this.data.maxVisibleRange = this.data.rowCount - 1;
    this.data.checkbox = this.data.mode == "checkbox";

    this.isMouseDown = new ReactiveVar(false);
    this.highlightedIndex = new ReactiveVar(-2);
    this.range = new ReactiveVar([0, this.data.rowCount - 1]);
    this.items = new ReactiveVar(this.data.localData || []);
    this.isDropDownOpen = new ReactiveVar(false);
    this.searchText = new ReactiveVar("");
    this.searching = new ReactiveVar(false);
    this.searchBoxHeight = new ReactiveVar((this.data.rowCount) * 44 + 2)
    this.key = new ReactiveVar(this.data.key || "");
    this.selectedItems = new ReactiveVar([]);
    this.totalRecordCount = new ReactiveVar(0);


    this.dataBind = (forceBind) => {
        if(this.searching.get() || forceBind){
            Meteor.call(this.data.method, { search: this.searchText.get(), key: this.key.get() }, (err, res) => {
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

    this.getRecordCount = () => {
        Meteor.call(this.data.method, {recordCount: true}, (err, res) => {
            if(!err){
                this.totalRecordCount.set(res || 0);
            }
        });
    }

    if(typeof this.data.initialize === "function"){
        this.data.initialize(this.instance);
    }

    if(this.data.localData && this.isMultipleSelection){
        this.dataBind = () => {
            if(this.data.localData.length < (this.data.rowCount)){
                this.range.set([0, this.data.localData.length]);
                this.searchBoxHeight.set(this.data.localData.length * 44 + 2);
                this.$(this.$(".webrew-input-list-container")[0]).css("height", this.searchBoxHeight.get())
            }
            else{
                this.range.set([0, (this.data.maxVisibleRange)]);
                this.searchBoxHeight.set((this.data.rowCount) * 44 + 2);
                this.$(this.$(".webrew-input-list-container")[0]).css("height", this.searchBoxHeight.get())
            }
        };

        this.getRecordCount = () => {
            this.totalRecordCount.set(this.data.localData.length || 0);
        }
    }
});

Template.webrewInput.onRendered(function () {
    var template = Template.instance();

    template.jqElement = template.$(".webrew-input-control-container");
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
    });

    template.getRecordCount();
    template.dataBind(true);
});