import { FoodItem, Review } from './types';

export const HERO_IMAGE_PATH = "src/assets/images/Hero Image Jul 4, 2026, 10_35_52 AM.png";

export const FOOD_ITEMS: FoodItem[] = [
  // Noodles Section
  {
    id: "nd-1",
    name: "Special Noodles",
    description: "Julienned veggies,tender chicken breast,and noodles stir-fried with oyester and soy sauces,for a vibrant, savory dish.",
    price: 4500,
    image: "images/Image Jun 22, 2026, 01_33_08 AM.png",
    category: "Noodles",
    rating: 4.8,
    prepTime: "10 mins",
    calories: 420
  },
{
    id: "nd-2",
    name: "Peppered Noodles with Boiled Eggs",
    description:"Parboilded noodles tossed in spicy pepper sauce,julienned veggies, served with one perfectly boiled egg for a simple yet bold flavour explosion.",
    price: 5500,
    image: "images/IMG_E1329.JPG",
    category: "Noodles",
    rating: 4.8,
    prepTime: "10 mins",
    calories: 420
  },

{
    id: "nd-3",
    name: "Asun Noodles",
    description: "Spicy asun paired with parboiled noodles stir-fried in a zesty pepper sauce for a quick,fiery,and satisfying meals.",
    price: 6000,
    image: "",
    category: "Noodles",
    rating: 4.7,
    prepTime: "12 mins",
    calories: 380
  },
{
    id: "nd-4",
    name: "Native Noodles",
    description: "Hearty noodles stir fried with red oil,locust beans,kpomo,smokedfish,boiled egg and scent leaf,bursting with bold Nigeria flavours.",
    price: 8500,
    image: "images/WLZQ2488.WEBP",
    category: "Noodles",
    rating: 4.7,
    prepTime: "12 mins",
    calories: 380
  },

{
    id: "nd-5",
    name: "Stir-Fry Noodles",
    description: "Sausage and julienned veggies stir-fried with noodles in a bold mix of oyester and soy sauces,packed with extra crunch.",
    price: 5500,
    image: "",
    category: "Noodles",
    rating: 4.7,
    prepTime: "12 mins",
    calories: 380
},


 // Burgers Section

{
    id: "bg-1",
    name: "Chicken Burger",
    description: "Grilled chicken patty with melt cheese,layered with sauteed lettuce, tomatoes, caramelized onions,& Yelo's signature burger cream in a toasted bun.",
    price: 5500,
    image: "images/IMG_E1319.JPG",
    category: "Burgers",
    rating: 4.9,
    prepTime: "15 mins",
    calories: 780
  },

  {
    id: "bg-2",
    name: "Beef Burger",
    description: "Beef patty layered with lettuce,caramelized onions, tomatoes, and our signature burger cream in a soft bun.",
    price: 6000,
    image: "images/IMG_E1544.JPG",
    category: "Burgers",
    rating: 4.6,
    prepTime: "14 mins",
    calories: 690
  },
  {
    id: "bg-3",
    name: "Double Deckers",
    description: "A stacked delight with beef and chicken patties,signature burger cream, lettuce,caramelized onions, and tomatoes in a soft bun.",
    price: 8500,
    image: "images/IMG_E1513.JPG",
    category: "Burgers",
    rating: 4.6,
    prepTime: "14 mins",
    calories: 690
  },

// Shawarma Section
  {
    id: "sh-1",
    name: "Special Shawarma",
    description: "Our signature sharwama is packed with chicken, beef, and sausages.it has bold flavors, fresh veggies, and our secret sauce, all wrapped in a soft flatbread.",
    price: 5500,
    image: "images/IMG_E1483.JPG",
    category: "Shawarma",
    rating: 4.9,
    prepTime: "11 mins",
    calories: 540
  },
  {
    id: "sh-2",
    name: "Turkey Sharwama",
    description: "Juicy turkey slices with fresh veggies, sausages and our signature sauce,all tucked into a warm flatbread wrap.",
    price: 8500,
    image: "",
    category: "Shawarma",
    rating: 4.7,
    prepTime: "10 mins",
    calories: 820
  },
  
  {
    id: "sh-3",
    name: "Jumbo Shawarma",
    description: "A massive sharwarma loaded with chicken, turkey, beef, three hot dogs, and our signature mix, wrapped to satisfy",
    price: 13000,
    image: "images/IMG 2026-06-21 190335.png",
    category: "Shawarma",
    rating: 4.7,
    prepTime: "10 mins",
    calories: 820
  },

  // Rice Meals Section
  {
    id: "rm-1",
    name: "Yelo Special FriedRice",
    description: "Smoky, spicy pre-grilled asun(goat meat) tossed with vibrant bell peppers,mixed veggies and rice.",
    price: 8500,
    image: "images/Image Jul 3, 2026, 06_39_03 PM.png",
    category: "Rice Meals",
    rating: 4.8,
    prepTime: "15 mins",
    calories: 610
  },
  {
    id: "rm-2",
    name: "Native rice",
    description: "Fragant basmati rice cooked with red oil,smoked fish,boiled egg,kpomo,and a medley of spices, finished with curry for an authentic Nigerian experience.",
    price: 9000,
    image: "images/DNOA8843.WEBP",
    category: "Rice Meals",
    rating: 4.7,
    prepTime: "16 mins",
    calories: 720
  },

  {
    id: "rm-3",
    name: "Jollof Coconut Rice",
    description: "Fragant jollof rice infused in coconut milk and oil,cooked in a signature tomato-onion base sauce, served wiyh goat meat and spicy pepper sauce for a bold,tropical twist.",
    price: 8000,
    image: "images/Image Jul 3, 2026, 06_19_34 PM.png",
    category: "Rice Meals",
    rating: 4.7,
    prepTime: "16 mins",
    calories: 720
  },


{
    id: "rm-4",
    name: "Chinese Rice",
    description: "Fluffy rice, seasoned with a savory blend of black pepper, paprika, and aromatic spices for a delightful Asian-inspired dish.",
    price: 5000,
    image: "images/Image Jul 3, 2026, 06_29_32 PM.png",
    category: "Rice Meals",
    rating: 4.7,
    prepTime: "16 mins",
    calories: 720
  },
  {
    id: "rm-5",
    name: "ChineseRice With ChickenBreast",
    description: "Tender, velvety chicken breast cubes stir-fried with fluffy rice, seasoned with a savory blend of black pepper, paprika, and aromatic spices for a delightful Asain-inspired dish.",
    price: 7500,
    image: "",
    category: "Rice Meals",
    rating: 4.7,
    prepTime: "16 mins",
    calories: 720
  },
  {
    id: "rm-6",
    name: "Coconut Rice",
    description: "Fluffy rice, infused with coconut milk and oil, cooked in a signature sauce.",
    price: 4500,
    image: "images/Image Jul 3, 2026, 06_24_28 PM.png",
    category: "Rice Meals",
    rating: 4.7,
    prepTime: "16 mins",
    calories: 720
  },
  {
    id: "rm-7",
    name: "Jollof Rice",
    description: ".",
    price: 5500,
    image: "images/Image Jun 24, 2026, 01_25_43 PM.png",
    category: "Rice Meals",
    rating: 4.7,
    prepTime: "16 mins",
    calories: 720
  },


 // Wings Section
   {
    id: "wg-1",
    name: "Buffalo Wings",
    description: "12 pices of fried wings tossed in a fiery, tangy hot sauce with a buttery finish, served with creamy ranch dip to cool the heat.",
    price: 10000,
    image: "images/IMG_E1518.JPG",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "wg-2",
    name: "Pepper Wings",
    description: "12 pieces of fried chicken wings tossed in our bold signature pepper sauce for a spicy kick.",
    price: 9000,
    image: "",
    category: "Wings",
    rating: 4.9,
    prepTime: "5 mins",
    calories: 140
  },
  {
    id: "wg-3",
    name: "Sweet Wings",
    description: "12 pieces of fried wings glazed in a sweet and tangy honey-ketchup sauce,infused with ginger and garlic for a sticky,irresistible treat.",
    price: 9000,
    image: "",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "wg-4",
    name: "Cripsy Wings",
    description: "12 pieces of golden-brown fried wings,perfectly dredged for a satisfying crunch in a bite.",
    price: 9500,
    image: "images/Image Jul 3, 2026, 06_52_44 PM.png",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "wg-5",
    name: "Lemon Pepper Wings",
    description: "12 pieces of fried wings tossed in a tangy lemon juice and a signature pepper mix for a zesty twist.",
    price: 9000,
    image: "images/IMG_E1528.JPG",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },{
    id: "wg-6",
    name: "Honey Chill BBQ Wings",
    description: "12 pieces of smoky,sweet,and tangy wings slathered in a rich BBQ sauce,paired with creamy ranch dip for a crowd pleasing classic.",
    price: 9500,
    image: "",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "wg-7",
    name: "Jerk Wings",
    description: "12 pieces of spicy, aromatic wings marinated in scotch bonnet, thyme, and warm spices, fried to crispy perfection,and srved with a cooling ranch dip.",
    price: 10000,
    image: "images/JDKR0153.WEBP",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },

{
    id: "wg-8",
    name: "Tomato Sauce Wings",
    description: "12 pieces of fried wings tossed in a ketchup & tomato signature base sauce for a zesty twist.",
    price: 9000,
    image: "",
    category: "Wings",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "wg-9",
    name: "Teriyaki Wings",
    description: "12 pieces of a fried wings coated in a sticky, sweet-savory teriyaki sauce with ginger and garlic, garnished with sesame seeds and green onions.",
    price: 11500,
    image: "images/IMG_E1516.JPG",
    category: "Wings",
    isFeatured: true,
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },

  // CockTail wings Section
  {
    id: "cwg-1",
    name: "Cola Flavoured Wings",
    description: ".",
    price: 11000,
    image: "images/Image Jun 24, 2026, 07_08_06 PM.png",
    category: "Cocktail Wings",
    rating: 4.9,
    prepTime: "8 mins",
    calories: 510
  },
  {
    id: "cwg-2",
    name: "Mojito Wings",
    description: " .",
    price: 11500,
    image: "images/Image Jun 24, 2026, 06_50_04 PM.png",
    category: "Cocktail Wings",
    isFeatured: true,
    rating: 4.9,
    prepTime: "8 mins",
    calories:510
  },
  {
    id: "cwg-3",
    name: "Bloody Mary Wings",
    description: ".",
    price: 12500,
    image: "images/IMG_E1475.JPG",
    category: "Cocktail Wings",
    rating: 4.9,
    prepTime: "8 mins",
    calories: 510
  },
  {
    id: "cwg-4",
    name: "Pina Colada Wings",
    description: "D.",
    price: 13500,
    image: "images/Image Jun 24, 2026, 06_56_14 PM.png",
    category: "Cocktail Wings",
    rating: 4.9,
    prepTime: "8 mins",
    calories: 510
  },
//Pasta Section

  {
    id: "ps-1",
    name: "Native Pasta",
    description: "Hearty pasta stir-fried with red oil,locust beans,kpomo,smoked fish,boiled egg and scent leaf,bursting with bold Nigerian flavors.",
    price: 8500,
    image: "images/Image Jun 25, 2026, 02_39_00 PM.png",
    category: "Pasta",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
    id: "ps-2",
    name: "Stir-Fry Pasta",
    description: "AL dente pasta tossed with chicken,jullienned bell peppers,carrots,and onions in a savory soy-sauce blend , with a hint of chili flakes.",
    price: 5500,
    image: "images/Image Jun 25, 2026, 01_54_07 PM.png",
    category: "Pasta",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
    id: "ps-3",
    name: "Jollof Pasta",
    description: "AL dente pasta tossed in our rich tomato based sauce with julliened veggies and savory sausage.",
    price: 4500,
    image: "images/Image Jun 25, 2026, 02_00_12 PM.png",
    category: "Pasta",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
    id: "ps-4",
    name: "Asun Pasta",
    description: "Spicy asun paired with parboiled pasta stir fried in a zesty pepper sauce for a quick,fiery,and satisfying meal.",
    price: 6000,
    image: "images/Image Jun 25, 2026, 02_31_21 PM.png",
    category: "Pasta",
    isFeatured: true,
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  //Combo Deal Section
 {
    id: "cd-1",
    name: "Perfect Match",
    description: ".",
    price: 10999,
    image: "images/Image Jun 25, 2026, 02_51_49 PM.png",
    category: "Combo Deals",
    isFeatured: true,
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
    id: "cd-2",
    name: "Yelo Big Treat",
    description: ".",
    price: 16500,
    image: "",
    category: "Combo Deals",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  }, 
  //protein Section
  {
    id: "pr-1",
    name: "Spicy Turkey",
    description: "Fried turkey tossed in our bold signature pepper sauce for a spicy kick.",
    price: 6800,
    image: "images/Image Jun 25, 2026, 03_13_42 PM.png",
    category: "Proteins",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  }, 
  {
    id: "pr-2",
    name: "Shredded Chicken",
    description: "Shredded chicken breast, tossed in our bold signature pepper sauce for a spicy kick.",
    price: 5000,
    image: "images/Image Jun 25, 2026, 03_04_35 PM.png",
    category: "Proteins",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  //specials section 

{
    id: "sp-1",
    name: "Single Cheese Loaded Fries",
    description: "golden irish potato fries loaded with savory minced meat sauce,creamy sharwama sauce, fresh coleslaw,and melted mozzarella.",
    price: 12000,
    image: "images/IMG_E1519.JPG",
    category: "Specials",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },

{
    id: "sp-2",
    name: "Double Cheese Loaded Fries",
    description: ".",
    price: 14500,
    image: "",
    category: "Specials",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "sp-3",
    name: "Goat Meat Potato Stir-Fry",
    description: "Tender goat meat and parboiled potatoes stir fried with red bell pepper,onions, garlic,and ginger in a savory soy-oyester sauce blend with curry and paprika.Garnished with parsley or green onions.",
    price: 9000,
    image: "images/IMG_E1515.JPG",
    category: "Specials",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  {
    id: "sp-4",
    name: "Sweet Potatoes & GoatMeat Pepper Sauce",
    description: ".",
    price: 10000 ,
    image: "",
    category: "Specials",
    rating: 4.8,
    prepTime: "4 mins",
    calories: 90
  },
  //Breakfast section
  {
    id: "bf-1",
    name: "Pancake/Waffles,Scrambled Eggs,Sausage & Pineapple juice",
    description: ".",
    price: 10500,
    image: "",
    category: "BreakFast",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
    id: "bf-2",
    name: "Pancake,HoneySyrup & Scrambled Eggs",
    description: "Fluffy pancakes with scramled eggs and sweet honey syrup the perfect combo to start your day.",
    price: 7000,
    image: "images/Image Jun 25, 2026, 03_28_36 PM.png",
    category: "BreakFast",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
   id: "bf-3",
    name: "Waffles,HoneySyrup & Scrambled Eggs",
    description: "cripsy on the outside soft on the inside, waffles crafted from a rich batter with scrambled eggs and honey syrup to give you that Goodmorning feeling.",
    price: 7000,
    image: "images/Image Jun 25, 2026, 03_31_50 PM.png",
    category: "BreakFast",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  //juice section

{
   id: "jc-1",
    name: "Pineapple Juice",
    description: "Freshly squeeze pineapple juice no additive no preservative pure natural served chilled.",
    price: 3500,
    image: "",
    category: "Juice & Drinks",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },

  {
   id: "jc-2",
    name: "Zobo Drink",
    description: "Cool and tangy Nigerian hibiscus flower drink with a hint of ginger.",
    price: 3500,
    image: "",
    category: "Juice & Drinks",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },

{
   id: "jc-3",
    name: "Tigernut Drink",
    description: "A nutty creamy bliss served chill.",
    price: 3500,
    image:"",
    category: "Juice & Drinks",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },
  {
   id: "jc-4",
    name: "Vanilla Milkshake",
    description: ".",
    price: 6000,
    image: "images/Image Jun 27, 2026, 12_54_45 AM.png",
    category: "Juice & Drinks",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },

{
   id: "jc-5",
    name: "Strawberry Milkshake",
    description: ".",
    price: 6000,
    image: "images/Image Jun 26, 2026, 06_54_12 PM.png",
    category: "Juice & Drinks",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },

{
   id: "jc-6",
    name: "Parfait",
    description: ".",
    price: 5500,
    image: "images/Image Jun 27, 2026, 12_44_49 AM.png",
    category: "Juice & Drinks",
    rating: 4.7,
    prepTime: "6 mins",
    calories: 395
  },

];

export const REVIEWS: Review[] = [

  {
    id: "1",
    name: "Precious A.",
    rating: 4,
    avatar: "",
    date: "2 days ago",
    comment:
      "The Jollof Rice was delicious and the chicken was perfectly grilled. Delivery was fast and the food arrived hot."
  },
  {
    id: "2",
    name: "Emmanuel O.",
    rating: 5,
    avatar: "",
    date: "1 week ago",
    comment:
      "I ordered for my office and everyone loved the meals. Great customer service and affordable prices."
  },
  {
    id: "3",
    name: "Blessing E.",
    rating: 4,
    avatar: "",
    date: "3 days ago",
    comment:
      "Yelo Bistro has become my favorite place to order from. Fresh food, generous portions, and excellent taste every time."
  }
];
  

   

export const CHOOSE_US_ITEMS = [
  {
    icon: "Utensils",
    title: "Consistency You Can Taste",
    description:"At Yelo Bistro consistency is one of our core values Every meal is prepared using carefully selected ingredients, standardized recipes, and strict quality control to ensure that the taste you love today is the same taste you'll enjoy every time you visit. Whether it's your favorite burger, meals, or signature drink, we are committed to delivering exceptional flavor and quality with every order.",
  },
  {
    icon: "Clock",
    title: "Fast,Reliable Service",
    description: "At Yelo Bistro, we value your time. When we promise a 20-minute preparation or delivery time, we work hard to ensure your order arrives within that timeframe. Our team follows efficient preparation processes and a streamlined delivery system to provide fresh, high-quality meals without unnecessary delays.We don't just make promises—we keep them.",
  },

  {
    icon: "Cake",
    title: "Celebrate Your Special Moments With Us ",
    description: "Yelo Bistro is the perfect place to host your special occasions. Whether it's a birthday celebration, family gathering,  anniversary,  or hangouts, we offer a comfortable atmosphere, delicious food, and attentive service to make your event truly special."
  },
  {
    icon: "MessageSquare",
    title: "Your Feedback Matters",
    description: "At Yelo Bistro, we believe our customers are at the heart of everything we do. That's why we actively encourage feedback on every dining experience. we listen carefully and respond promptly to ensure your voice is heard.Customer feedback helps us to deliver the exceptional experience our guests deserve. We are committed to turning every piece of feedback into an opportunity to serve you better."
  }
];

export const TEAM_MEMBERS = [
  {
    name: "",
    title: "",
    bio: ".",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "",
    title: "",
    bio: ".",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=400"
  }
];
