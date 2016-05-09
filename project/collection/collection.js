//import the mongo object
import { Mongo} from "meteor/mongo";

//export access to my collections
export const fireworkCards = new Mongo.Collection("cards");
export const player1HandCollection = new Mongo.Collection("player1Hand");
export const player2HandCollection = new Mongo.Collection("player2Hand");
export const play_area_collection = new Mongo.Collection("player_area");
export const discardCollection = new Mongo.Collection("discard");
//export access to any data to start our application

//all the cards that are needed in a game of Hanabi
export const deck = [
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png",
	clueColor: false,  
	clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Blue",
	 image: "Blue 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Blue",
	 image: "Blue 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Blue",
	 image: "Blue 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Blue",
	 image: "Blue 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Blue",
	 image: "Blue 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Blue",
	 image: "Blue 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Blue",
	 image: "Blue 5.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Black",
	 image: "Black 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Black",
	 image: "Black 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Black",
	 image: "Black 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Black",
	 image: "Black 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Black",
	 image: "Black 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Black",
	 image: "Black 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Black",
	 image: "Black 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Black",
	 image: "Black 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Black",
	 image: "Black 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Black",
	 image: "Black 5.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Yellow",
	 image: "Yellow 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Yellow",
	 image: "Yellow 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Yellow",
	 image: "Yellow 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Yellow",
	 image: "Yellow 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Yellow",
	 image: "Yellow 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Yellow",
	 image: "Yellow 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Yellow",
	 image: "Yellow 5.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Red",
	 image: "Red 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Red",
	 image: "Red 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Red",
	 image: "Red 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Red",
	 image: "Red 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Red",
	 image: "Red 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Red",
	 image: "Red 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Red",
	 image: "Red 5.png", 
 clueColor: false,  
 clueNum: false
 },

 {
	 cardValue : 1, 
	 cardColor: "Green",
	 image: "Green 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Green",
	 image: "Green 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Green",
	 image: "Green 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Green",
	 image: "Green 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Green",
	 image: "Green 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Green",
	 image: "Green 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Green",
	 image: "Green 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Green",
	 image: "Green 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Green",
	 image: "Green 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Green",
	 image: "Green 5.png", 
 clueColor: false,  
 clueNum: false
 }

 ];
 
export const discards = [

 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Yellow",
	 image: "Yellow 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Yellow",
	 image: "Yellow 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Yellow",
	 image: "Yellow 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Yellow",
	 image: "Yellow 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Yellow",
	 image: "Yellow 5.png", 
 clueColor: false,  
 clueNum: false
 },
  {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 2, 
	 cardColor: "Red",
	 image: "Red 2.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 3, 
	 cardColor: "Red",
	 image: "Red 3.png", 
 clueColor: false,  
 clueNum: false
 },{
	 cardValue : 3, 
	 cardColor: "Red",
	 image: "Red 3.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Red",
	 image: "Red 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 4, 
	 cardColor: "Red",
	 image: "Red 4.png", 
 clueColor: false,  
 clueNum: false
 },
 {
	 cardValue : 5, 
	 cardColor: "Red",
	 image: "Red 5.png", 
 clueColor: false,  
 clueNum: false
 }
 ];
 

