import './browse.html';
import './browse.css'
import { Coffees } from '../../api/collections/coffees.js';

Template.Browse.onCreated( function (){
  let template = Template.instance();
  template.searchText   = new ReactiveVar("");
  template.searchRating = new ReactiveVar("0");
  template.searchRoast  = new ReactiveVar("Light Roast,Medium Roast,Medium-Dark Roast,Dark Roast");
  template.searching    = new ReactiveVar( false );
  template.sortBy       = new ReactiveVar("CoffeeName");
  template.searchCount  = new ReactiveVar("");

  template.autorun( () => {
    template.subscribe( 'coffeeSearch', template.searchText.get(), template.searchRating.get(), template.searchRoast.get(), () => {
      $('.loader').fadeOut('fast', function(){
        $('.loading-wrapper').fadeIn('slow');
      });
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });

});

Template.Browse.onRendered( function() {
  $('.loader').fadeIn();

  $(window).scroll(function() {
    if ($(this).scrollTop() > 50 ) {
        $('.scrolltop:hidden').stop(true, true).fadeIn();
    } else {
        $('.scrolltop').stop(true, true).fadeOut();
    }
  });
});
  

Template.Browse.helpers({
  coffees () {
    let value = Template.instance().sortBy.get();
    let order;
    if (value == "CreatedAt" || value == "AverageRating" ){
      order = "-1"
    } else {
      order = "1"
    }
    let sortBy = { sort: { [value] : [order] }};
    let results = Coffees.find({}, sortBy);
    if (results) {
      Template.instance().searchCount.set(results.count());
      return results;
    }
  },
  searching() {
    return Template.instance().searching.get();
  },
  searchText() {
    return Template.instance().searchText.get();
  },
  searchRating() {
    return Template.instance().searchRating.get()
  },
  searchRoast() {
    return Template.instance().searchRoast.get();
  },
  sortBy() {
    return Template.instance().sortBy.get();
  },
  searchCount() {
    return Template.instance().searchCount.get();
  }
});

Template.Browse.events({
  'keyup [name="keysearch"]' ( event, template) {
    let value = event.target.value.trim();
    let e = document.getElementById("search-clear");
    if (value.length > 0 ){
      e.style.display = "inherit";
    } else {
      e.style.display = "none";
    }

    if ( event.keyCode === 13 ) {
      template.searchText.set( value );
      template.searching.set( true ); 
    }
  },
  'click .isearch' ( event, template) {
    let value = document.getElementById("keysearch").value;
    template.searchText.set( value );
    template.searching.set( true );
  },
  'click .search-clear' (event, template) {
    event.preventDefault();
    document.getElementById("keysearch").value = "";
    template.searchText.set( "" );
    template.searching.set( true );
    event.target.style.display = "none";
  },
  'click .rating'(event, template) {
    const value = $(event.target).val();
    $("#brating").val(value);
    template.searchRating.set( value );
    template.searching.set( true );
  },
  'change #sort' (event, template) {
    let value = event.target.value.trim();
    template.sortBy.set( value );
  },
  'click .checkRoast' (event, template){
    let value = [];
    let elements  = document.getElementsByClassName("checkRoast");
    
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        value.push( elements[i].value );
      }
    };
    value = value.toString();
    template.searchRoast.set( value );
    template.searching.set( true );
  },
  'click .critbtn' (event, template){
    $("#mySrchbar").slideToggle();
  },
  'click .scroll' (event){
    $('html').animate({scrollTop: 335},500,'swing');
  }
});
