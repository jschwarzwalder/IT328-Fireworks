import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.start.onCreated(function startGame() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
 var deck = [
 {
	 cardValue : 1, 
	 cardColor: Blue,
	 image: "Blue 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: Blue,
	 image: "Blue 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: Blue,
	 image: "Blue 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: Blue,
	 image: "Blue 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Blue,
	 image: "Blue 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: Blue,
	 image: "Blue 5.png"
 },
  {
	 cardValue : 1, 
	 cardColor: Black,
	 image: "Black 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: Black,
	 image: "Black 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: Black,
	 image: "Black 2.png"
 },
 {
	 cardValue : 2, 
	 cardColor: Black,
	 image: "Black 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: Black,
	 image: "Black 3.png"
 },{
	 cardValue : 3, 
	 cardColor: Black,
	 image: "Black 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Black,
	 image: "Black 4.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Black,
	 image: "Black 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: Black,
	 image: "Black 5.png"
 }
 ];
 
 var discards = [
 {
	 cardValue : 1, 
	 cardColor: Yellow,
	 image: "Yellow 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: Yellow,
	 image: "Yellow 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: Yellow,
	 image: "Yellow 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: Yellow,
	 image: "Yellow 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Yellow,
	 image: "Yellow 4.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Yellow,
	 image: "Yellow 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: Yellow,
	 image: "Yellow 5.png"
 },
  {
	 cardValue : 1, 
	 cardColor: Red,
	 image: "Red 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: Red,
	 image: "Red 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: Red,
	 image: "Red 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: Red,
	 image: "Red 3.png"
 },{
	 cardValue : 3, 
	 cardColor: Red,
	 image: "Red 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Red,
	 image: "Red 4.png"
 },
 {
	 cardValue : 4, 
	 cardColor: Red,
	 image: "Red 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: Red,
	 image: "Red 5.png"
 }
 ];
 play_area [
	[{
		 cardValue : 1, 
		 cardColor: Red,
		 image: "Red 1.png"
	 },
	 {
		 cardValue : 2, 
		 cardColor: Red,
		 image: "Red 2.png"
	 }
	],
	
	[{
		 cardValue : 1, 
		 cardColor: Yellow,
		 image: "Yellow 1.png"
	 },
	 {
		 cardValue : 2, 
		 cardColor: Yellow,
		 image: "Yellow 2.png"
	 },
	 {
		 cardValue : 3, 
		 cardColor: Yellow,
		 image: "Yellow 3.png"
	 }
	],
	
	[{
		 cardValue : 1, 
		 cardColor: Black,
		 image: "Black 1.png"
	 }
	 ],
	 
	 [{
		 cardValue : 1, 
		 cardColor: Blue,
		 image: "Blue 1.png"
	 },
	 {
		 cardValue : 2, 
		 cardColor: Blue,
		 image: "Blue 2.png"
	 },
	 {
		 cardValue : 3, 
		 cardColor: Blue,
		 image: "Blue 3.png"
	 },
	 {
		 cardValue : 4, 
		 cardColor: Blue,
		 image: "Blue 4.png"
	 }
	]
]