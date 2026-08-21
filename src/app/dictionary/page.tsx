"use client";

import { useState } from "react";
import Head from "next/head";

const dictionaryData: Record<string, { urdu: string; pronunciation: string; meaning: string; example: string; synonyms: string[]; category: string }> = {
  // Greetings & Common
  "hello": { urdu: "سلام", pronunciation: "salaam", meaning: "A greeting used when meeting someone", example: "Hello, how are you?", synonyms: ["hi", "greetings", "salutation"], category: "greetings" },
  "goodbye": { urdu: "خدا حافظ", pronunciation: "khuda hafiz", meaning: "A farewell expression", example: "Goodbye, see you tomorrow!", synonyms: ["bye", "farewell", "see you"], category: "greetings" },
  "thank you": { urdu: "شکریہ", pronunciation: "shukriya", meaning: "An expression of gratitude", example: "Thank you for your help.", synonyms: ["thanks", "grateful", "appreciation"], category: "greetings" },
  "please": { urdu: "براہ کرم", pronunciation: "barahe karam", meaning: "Used to make a polite request", example: "Please pass the salt.", synonyms: ["kindly", "if you please"], category: "greetings" },
  "sorry": { urdu: "معاف کیجیے", pronunciation: "maaf keejiye", meaning: "Used to express apology", example: "Sorry, I didn't mean to hurt you.", synonyms: ["apology", "forgive me", "pardon"], category: "greetings" },
  "welcome": { urdu: "خوش آمدید", pronunciation: "khush amdeed", meaning: "Used to greet someone arriving", example: "Welcome to our home!", synonyms: ["greetings", "salutation"], category: "greetings" },
  "yes": { urdu: "ہاں", pronunciation: "haan", meaning: "Used to give an affirmative response", example: "Yes, I understand.", synonyms: ["yeah", "indeed", "certainly"], category: "greetings" },
  "no": { urdu: "نہیں", pronunciation: "nahin", meaning: "Used to give a negative response", example: "No, thank you.", synonyms: ["nah", "nope"], category: "greetings" },

  // Family
  "mother": { urdu: "ماں", pronunciation: "maan", meaning: "A woman in relation to her child", example: "My mother is very kind.", synonyms: ["mom", "mama", "mummy"], category: "family" },
  "father": { urdu: "باپ", pronunciation: "baap", meaning: "A man in relation to his child", example: "My father works hard.", synonyms: ["dad", "papa", "daddy"], category: "family" },
  "brother": { urdu: "بھائی", pronunciation: "bhai", meaning: "A male sibling", example: "My brother is older than me.", synonyms: ["sibling", "bro"], category: "family" },
  "sister": { urdu: "بہن", pronunciation: "behen", meaning: "A female sibling", example: "My sister is a doctor.", synonyms: ["sibling", "sis"], category: "family" },
  "son": { urdu: "بیٹا", pronunciation: "beta", meaning: "A male child in relation to parents", example: "Their son is very smart.", synonyms: ["child", "boy"], category: "family" },
  "daughter": { urdu: "بیٹی", pronunciation: "beti", meaning: "A female child in relation to parents", example: "Their daughter is studying medicine.", synonyms: ["child", "girl"], category: "family" },
  "grandfather": { urdu: "دادا", pronunciation: "daada", meaning: "Father's father", example: "My grandfather tells great stories.", synonyms: ["grandpa", "grandad"], category: "family" },
  "grandmother": { urdu: "دادی", pronunciation: "daadi", meaning: "Father's mother", example: "My grandmother makes amazing food.", synonyms: ["grandma", "granny"], category: "family" },
  "uncle": { urdu: "چچا", pronunciation: "chacha", meaning: "Father's brother", example: "My uncle lives in Lahore.", synonyms: ["chachu", "uncle"], category: "family" },
  "aunt": { urdu: "خالہ", pronunciation: "khaala", meaning: "Mother's sister", example: "My aunt is visiting us.", synonyms: ["aunty", "khalaa"], category: "family" },
  "husband": { urdu: "خاوند", pronunciation: "khawand", meaning: "A married man", example: "Her husband is an engineer.", synonyms: ["spouse", "partner"], category: "family" },
  "wife": { urdu: "بیوی", pronunciation: "biwi", meaning: "A married woman", example: "His wife is a teacher.", synonyms: ["spouse", "partner"], category: "family" },
  "child": { urdu: "بچہ", pronunciation: "bacha", meaning: "A young human being", example: "The child is playing outside.", synonyms: ["kid", "offspring", "young"], category: "family" },
  "baby": { urdu: "شیرخوار", pronunciation: "shirkhawar", meaning: "A very young child", example: "The baby is sleeping.", synonyms: ["infant", "newborn"], category: "family" },
  "family": { urdu: "خاندان", pronunciation: "khandan", meaning: "A group of related people", example: "My family is very supportive.", synonyms: ["relatives", "kin", "household"], category: "family" },

  // Body Parts
  "head": { urdu: "سر", pronunciation: "sir", meaning: "The upper part of the body", example: "My head hurts.", synonyms: ["cranium", "skull"], category: "body" },
  "eye": { urdu: "آنکھ", pronunciation: "aankh", meaning: "The organ of sight", example: "She has beautiful eyes.", synonyms: ["vision", "optic"], category: "body" },
  "ear": { urdu: "کان", pronunciation: "kaan", meaning: "The organ of hearing", example: "I can hear with my ears.", synonyms: ["hearing"], category: "body" },
  "nose": { urdu: "ناک", pronunciation: "naak", meaning: "The organ of smell", example: "My nose is running.", synonyms: ["nostril"], category: "body" },
  "mouth": { urdu: "منہ", pronunciation: "munh", meaning: "The opening in the face for eating and speaking", example: "Open your mouth wide.", synonyms: ["oral cavity"], category: "body" },
  "hand": { urdu: "ہاتھ", pronunciation: "haath", meaning: "The end part of the arm", example: "Wash your hands before eating.", synonyms: ["palm", "fingers"], category: "body" },
  "foot": { urdu: "پاؤں", pronunciation: "paaon", meaning: "The lower extremity of the leg", example: "My foot is sore.", synonyms: ["feet", "toe"], category: "body" },
  "heart": { urdu: "دل", pronunciation: "dil", meaning: "The organ that pumps blood", example: "My heart is beating fast.", synonyms: ["cardiac", "core"], category: "body" },
  "stomach": { urdu: "پیٹ", pronunciation: "pait", meaning: "The large organ for digestion", example: "My stomach is full.", synonyms: ["belly", "abdomen"], category: "body" },
  "face": { urdu: "چہرہ", pronunciation: "chehra", meaning: "The front part of the head", example: "She has a beautiful face.", synonyms: ["countenance", "visage"], category: "body" },

  // Food & Drink
  "water": { urdu: "پانی", pronunciation: "paani", meaning: "A clear liquid essential for life", example: "Can I have some water?", synonyms: ["aqua", "h2o"], category: "food" },
  "food": { urdu: "کھانا", pronunciation: "khaana", meaning: "Any nutritious substance eaten for energy", example: "The food was delicious.", synonyms: ["meal", "cuisine", "nourishment"], category: "food" },
  "bread": { urdu: "روٹی", pronunciation: "roti", meaning: "A staple food made from flour", example: "I eat bread every morning.", synonyms: ["naan", "flatbread"], category: "food" },
  "rice": { urdu: "چاول", pronunciation: "chawal", meaning: "A cereal grain used as food", example: "We eat rice for lunch.", synonyms: ["grain", "paddy"], category: "food" },
  "milk": { urdu: "دودھ", pronunciation: "doodh", meaning: "A white nutritious liquid from cows", example: "Children should drink milk.", synonyms: ["dairy"], category: "food" },
  "sugar": { urdu: "چینی", pronunciation: "cheeni", meaning: "A sweet crystalline substance", example: "Do you want sugar in your tea?", synonyms: ["sweetener", "sucrose"], category: "food" },
  "salt": { urdu: "نمک", pronunciation: "namak", meaning: "A white crystalline substance used for flavoring", example: "Add salt to taste.", synonyms: ["sodium chloride"], category: "food" },
  "tea": { urdu: "چائے", pronunciation: "chaaye", meaning: "A hot drink made from tea leaves", example: "I drink tea every morning.", synonyms: ["chai", "brew"], category: "food" },
  "meat": { urdu: "گوشت", pronunciation: "gosht", meaning: "Animal flesh used as food", example: "We eat meat on Fridays.", synonyms: ["flesh", "protein"], category: "food" },
  "fruit": { urdu: "پھل", pronunciation: "phal", meaning: "The sweet product of a plant", example: "Eat fresh fruits daily.", synonyms: ["produce"], category: "food" },
  "vegetable": { urdu: "سبزی", pronunciation: "sabzi", meaning: "A plant grown for food", example: "Vegetables are healthy.", synonyms: ["greens", "produce"], category: "food" },
  "egg": { urdu: "انڈا", pronunciation: "anda", meaning: "An oval object laid by a female bird", example: "I had eggs for breakfast.", synonyms: ["ovum"], category: "food" },
  "chicken": { urdu: "مرغی", pronunciation: "murghi", meaning: "A domestic fowl", example: "Chicken biryani is my favorite.", synonyms: ["poultry", "hen"], category: "food" },
  "fish": { urdu: "مچھلی", pronunciation: "machhli", meaning: "An aquatic animal", example: "Fish is good for health.", synonyms: ["seafood"], category: "food" },
  "apple": { urdu: "سیب", pronunciation: "seb", meaning: "A round fruit with red or green skin", example: "An apple a day keeps the doctor away.", synonyms: ["fruit"], category: "food" },
  "banana": { urdu: "کیلا", pronunciation: "kela", meaning: "A long curved fruit", example: "Bananas are rich in potassium.", synonyms: ["fruit"], category: "food" },
  "mango": { urdu: "آم", pronunciation: "aam", meaning: "A tropical fruit", example: "Mangoes are the king of fruits.", synonyms: ["fruit"], category: "food" },
  "potato": { urdu: "آلو", pronunciation: "aaloo", meaning: "A starchy vegetable", example: "Potatoes are used in many dishes.", synonyms: ["spud", "tuber"], category: "food" },
  "onion": { urdu: "پیاز", pronunciation: "pyaaz", meaning: "A pungent vegetable", example: "Cut the onions finely.", synonyms: ["bulb"], category: "food" },

  // Nature
  "sun": { urdu: "سورج", pronunciation: "suraj", meaning: "The star at the center of our solar system", example: "The sun is shining brightly.", synonyms: ["star", "daylight"], category: "nature" },
  "moon": { urdu: "چاند", pronunciation: "chaand", meaning: "The natural satellite of the earth", example: "The moon looks beautiful tonight.", synonyms: ["lunar", "satellite"], category: "nature" },
  "rain": { urdu: "بارش", pronunciation: "baarish", meaning: "Moisture condensed from the atmosphere", example: "I love the sound of rain.", synonyms: ["precipitation", "shower", "downpour"], category: "nature" },
  "fire": { urdu: "آگ", pronunciation: "aag", meaning: "Combustion producing heat and light", example: "The fire kept us warm.", synonyms: ["flame", "blaze", "inferno"], category: "nature" },
  "wind": { urdu: "ہوا", pronunciation: "hawa", meaning: "Air in natural motion", example: "The wind is very strong today.", synonyms: ["breeze", "gale", "current"], category: "nature" },
  "sky": { urdu: "آسمان", pronunciation: "aasmaan", meaning: "The expanse of air above the earth", example: "The sky is blue today.", synonyms: ["heavens", "firmament"], category: "nature" },
  "star": { urdu: "ستارہ", pronunciation: "sitaara", meaning: "A luminous celestial body", example: "The stars are bright tonight.", synonyms: ["celestial body"], category: "nature" },
  "cloud": { urdu: "بادل", pronunciation: "baadal", meaning: "A visible mass of water vapor", example: "Dark clouds are coming.", synonyms: ["cumulus", "overcast"], category: "nature" },
  "mountain": { urdu: "پہاڑ", pronunciation: "pahaad", meaning: "A large natural elevation of earth", example: "The mountains are beautiful.", synonyms: ["peak", "summit", "hill"], category: "nature" },
  "river": { urdu: "دریا", pronunciation: "dariya", meaning: "A large natural stream of water", example: "The river flows through the city.", synonyms: ["stream", "waterway"], category: "nature" },
  "sea": { urdu: "سمندر", pronunciation: "samundar", meaning: "A large body of salt water", example: "The sea is calm today.", synonyms: ["ocean", "waters"], category: "nature" },
  "tree": { urdu: "درخت", pronunciation: "darakht", meaning: "A large perennial plant", example: "The tree provides shade.", synonyms: ["plant", "timber"], category: "nature" },
  "flower": { urdu: "پھول", pronunciation: "phool", meaning: "The colorful part of a plant", example: "The flowers are blooming.", synonyms: ["bloom", "blossom"], category: "nature" },
  "stone": { urdu: "پتھر", pronunciation: "patthar", meaning: "A small piece of rock", example: "The stone is heavy.", synonyms: ["rock", "pebble"], category: "nature" },
  "earth": { urdu: "زمین", pronunciation: "zameen", meaning: "The planet on which we live", example: "The earth rotates on its axis.", synonyms: ["world", "globe", "planet"], category: "nature" },

  "snow": { urdu: "برف", pronunciation: "barf", meaning: "Frozen precipitation", example: "The mountains are covered in snow.", synonyms: ["ice", "frost"], category: "nature" },
  "ocean": { urdu: " ocean", pronunciation: "ocean", meaning: "A very large expanse of sea", example: "The ocean is vast.", synonyms: ["sea", "waters"], category: "nature" },

  // Animals
  "cat": { urdu: "بلی", pronunciation: "billi", meaning: "A small domesticated carnivorous mammal", example: "The cat is sleeping.", synonyms: ["feline", "kitten"], category: "animals" },
  "dog": { urdu: "کتا", pronunciation: "kutta", meaning: "A domesticated carnivorous mammal", example: "The dog is barking.", synonyms: ["canine", "puppy"], category: "animals" },
  "bird": { urdu: "پرندہ", pronunciation: "parinda", meaning: "A warm-blooded animal with feathers", example: "The bird is flying.", synonyms: ["avian"], category: "animals" },
  "horse": { urdu: "گھوڑا", pronunciation: "ghora", meaning: "A large hoofed mammal", example: "The horse is running fast.", synonyms: ["steed", "mount"], category: "animals" },
  "cow": { urdu: "گائے", pronunciation: "gaaye", meaning: "A large domesticated bovine", example: "The cow gives us milk.", synonyms: ["bovine"], category: "animals" },
  "lion": { urdu: "شیر", pronunciation: "sher", meaning: "A large wild cat", example: "The lion is the king of the jungle.", synonyms: ["big cat", "predator"], category: "animals" },
  "tiger": { urdu: "باگھ", pronunciation: "baagh", meaning: "A large striped wild cat", example: "The tiger is endangered.", synonyms: ["big cat"], category: "animals" },
  "elephant": { urdu: "ہاتھی", pronunciation: "haathi", meaning: "The largest living land animal", example: "The elephant is very strong.", synonyms: ["pachyderm"], category: "animals" },

  "monkey": { urdu: "بندر", pronunciation: "bandar", meaning: "A primate", example: "The monkey is climbing the tree.", synonyms: ["ape", "primate"], category: "animals" },

  // Colors
  "red": { urdu: "لال", pronunciation: "laal", meaning: "A color at the end of the spectrum", example: "The rose is red.", synonyms: ["crimson", "scarlet"], category: "colors" },
  "blue": { urdu: "نیلا", pronunciation: "neela", meaning: "A color between green and violet", example: "The sky is blue.", synonyms: ["azure", "cobalt"], category: "colors" },
  "green": { urdu: "سبز", pronunciation: "sabz", meaning: "The color of grass", example: "The grass is green.", synonyms: ["emerald", "verdant"], category: "colors" },
  "yellow": { urdu: "پیلا", pronunciation: "peela", meaning: "The color of sunshine", example: "The sun is yellow.", synonyms: ["golden", "amber"], category: "colors" },
  "black": { urdu: "کالا", pronunciation: "kaala", meaning: "The darkest color", example: "The cat is black.", synonyms: ["dark", "ebony"], category: "colors" },
  "white": { urdu: "سفید", pronunciation: "safed", meaning: "The lightest color", example: "Snow is white.", synonyms: ["pale", "ivory"], category: "colors" },
  "orange": { urdu: "نارنجی", pronunciation: "narangi", meaning: "A color between red and yellow", example: "The orange is orange.", synonyms: ["amber", "tangerine"], category: "colors" },
  "pink": { urdu: "گلابی", pronunciation: "gulaabi", meaning: "A pale red color", example: "She likes pink flowers.", synonyms: ["rose", "blush"], category: "colors" },
  "purple": { urdu: "جامنی", pronunciation: "jaamni", meaning: "A color combining red and blue", example: "The grapes are purple.", synonyms: ["violet", "mauve"], category: "colors" },
  "brown": { urdu: "بھورا", pronunciation: "bhoora", meaning: "A dark color like earth", example: "The dog is brown.", synonyms: ["tan", "chocolate"], category: "colors" },

  // Numbers
  "one": { urdu: "ایک", pronunciation: "aik", meaning: "The number 1", example: "I have one brother.", synonyms: ["single", "first"], category: "numbers" },
  "two": { urdu: "دو", pronunciation: "do", meaning: "The number 2", example: "There are two cats.", synonyms: ["pair", "couple"], category: "numbers" },
  "three": { urdu: "تین", pronunciation: "teen", meaning: "The number 3", example: "I have three friends.", synonyms: ["triple", "trio"], category: "numbers" },
  "ten": { urdu: "دس", pronunciation: "das", meaning: "The number 10", example: "There are ten fingers.", synonyms: ["decade"], category: "numbers" },
  "hundred": { urdu: "سو", pronunciation: "sau", meaning: "The number 100", example: "There are hundred students.", synonyms: ["century"], category: "numbers" },
  "thousand": { urdu: "ہزار", pronunciation: "hazaar", meaning: "The number 1000", example: "There are thousand reasons.", synonyms: ["millennium"], category: "numbers" },

  // Days & Time
  "monday": { urdu: "پیر", pronunciation: "peer", meaning: "The first day of the work week", example: "Monday is the start of the week.", synonyms: ["first day"], category: "time" },
  "today": { urdu: "آج", pronunciation: "aaj", meaning: "This present day", example: "Today is Monday.", synonyms: ["this day"], category: "time" },
  "tomorrow": { urdu: "کل", pronunciation: "kal", meaning: "The day after today", example: "Tomorrow is a holiday.", synonyms: ["next day"], category: "time" },
  "yesterday": { urdu: "کل", pronunciation: "kal", meaning: "The day before today", example: "Yesterday was fun.", synonyms: ["previous day"], category: "time" },
  "morning": { urdu: "صبح", pronunciation: "subah", meaning: "The early part of the day", example: "Good morning!", synonyms: ["dawn", "daybreak"], category: "time" },
  "evening": { urdu: "شام", pronunciation: "shaam", meaning: "The later part of the day", example: "Good evening!", synonyms: ["dusk", "sunset"], category: "time" },
  "year": { urdu: "سال", pronunciation: "saal", meaning: "A period of 365 days", example: "Happy New Year!", synonyms: ["annual"], category: "time" },
  "month": { urdu: "مہینہ", pronunciation: "mahina", meaning: "A period of about 30 days", example: "This month is busy.", synonyms: ["lunar month"], category: "time" },
  "week": { urdu: "ہفتہ", pronunciation: "hafta", meaning: "A period of seven days", example: "This week is tough.", synonyms: ["seven days"], category: "time" },
  "hour": { urdu: "گھنٹہ", pronunciation: "ghanta", meaning: "A period of 60 minutes", example: "Wait for one hour.", synonyms: ["60 minutes"], category: "time" },

  // Emotions
  "happy": { urdu: "خوش", pronunciation: "khush", meaning: "Feeling or showing pleasure", example: "I am very happy today.", synonyms: ["glad", "joyful", "cheerful"], category: "emotions" },
  "sad": { urdu: "اداس", pronunciation: "udaas", meaning: "Feeling sorrow or unhappiness", example: "She felt sad about the news.", synonyms: ["unhappy", "sorrowful", "melancholy"], category: "emotions" },
  "angry": { urdu: "ناراض", pronunciation: "naraaz", meaning: "Feeling strong displeasure", example: "Why are you angry?", synonyms: ["furious", "mad", "irritated"], category: "emotions" },
  "afraid": { urdu: "خوفزدہ", pronunciation: "khaufzada", meaning: "Feeling fear or anxiety", example: "The child is afraid of the dark.", synonyms: ["scared", "frightened", "terrified"], category: "emotions" },
  "love": { urdu: "محبت", pronunciation: "mohabbat", meaning: "An intense feeling of deep affection", example: "I love my family.", synonyms: ["affection", "devotion", "adoration"], category: "emotions" },
  "hope": { urdu: "امید", pronunciation: "umeed", meaning: "A feeling of expectation", example: "I hope you feel better.", synonyms: ["wish", "desire", "expectation"], category: "emotions" },
  "fear": { urdu: "خوف", pronunciation: "khauf", meaning: "An unpleasant emotion caused by danger", example: "Fear of the unknown.", synonyms: ["dread", "terror", "panic"], category: "emotions" },
  "joy": { urdu: "خوشی", pronunciation: "khushi", meaning: "A feeling of great happiness", example: "The news brought joy.", synonyms: ["happiness", "delight", "pleasure"], category: "emotions" },
  "pain": { urdu: "درد", pronunciation: "dard", meaning: "Physical suffering", example: "I feel pain in my leg.", synonyms: ["ache", "agony", "suffering"], category: "emotions" },

  // Technology
  "computer": { urdu: "کمپیوٹر", pronunciation: "computer", meaning: "An electronic device for processing data", example: "I use my computer for work.", synonyms: ["pc", "laptop", "machine"], category: "technology" },
  "mobile": { urdu: "موبائل", pronunciation: "mobile", meaning: "A portable telephone", example: "Where is my mobile phone?", synonyms: ["phone", "cellphone", "smartphone"], category: "technology" },
  "internet": { urdu: "انٹرنیٹ", pronunciation: "internet", meaning: "A global computer network for communication", example: "The internet is very fast today.", synonyms: ["web", "network", "online"], category: "technology" },
  "email": { urdu: "ای میل", pronunciation: "email", meaning: "Messages sent electronically", example: "Check your email.", synonyms: ["mail", "message"], category: "technology" },
  "password": { urdu: "پاس ورڈ", pronunciation: "password", meaning: "A secret word for access", example: "Don't share your password.", synonyms: ["code", "passphrase"], category: "technology" },
  "website": { urdu: "ویب سائٹ", pronunciation: "website", meaning: "A location connected to the internet", example: "Visit our website.", synonyms: ["site", "web page"], category: "technology" },
  "video": { urdu: "ویڈیو", pronunciation: "video", meaning: "A recording of moving images", example: "Watch this video.", synonyms: ["clip", "film"], category: "technology" },
  "photo": { urdu: "تصویر", pronunciation: "tasveer", meaning: "A picture taken by a camera", example: "Take a photo.", synonyms: ["picture", "image", "snapshot"], category: "technology" },
  "camera": { urdu: "کیمرا", pronunciation: "camera", meaning: "A device for taking photographs", example: "The camera is expensive.", synonyms: ["lens", "photographic"], category: "technology" },
  "battery": { urdu: "بیٹری", pronunciation: "battery", meaning: "A device that stores electrical energy", example: "My phone battery is low.", synonyms: ["cell", "power source"], category: "technology" },

  // House
  "house": { urdu: "گھر", pronunciation: "ghar", meaning: "A building for human habitation", example: "My house is near the park.", synonyms: ["home", "residence", "dwelling"], category: "house" },
  "room": { urdu: "کمرہ", pronunciation: "kamra", meaning: "A part of a building", example: "My room is clean.", synonyms: ["chamber", "space"], category: "house" },
  "kitchen": { urdu: "باورچی خانہ", pronunciation: "bawarchi khaana", meaning: "A room for cooking", example: "Mom is in the kitchen.", synonyms: ["cooking area"], category: "house" },
  "bedroom": { urdu: "سونے کا کمرہ", pronunciation: "sone ka kamra", meaning: "A room for sleeping", example: "My bedroom is upstairs.", synonyms: ["sleeping room"], category: "house" },
  "bathroom": { urdu: "غسل خانہ", pronunciation: "ghusl khaana", meaning: "A room for bathing", example: "The bathroom is clean.", synonyms: ["washroom", "restroom"], category: "house" },
  "door": { urdu: "دروازہ", pronunciation: "darwaza", meaning: "A movable barrier for entry", example: "Please close the door.", synonyms: ["gate", "entrance"], category: "house" },
  "window": { urdu: "کھڑکی", pronunciation: "khidki", meaning: "An opening in a wall for light", example: "Open the window.", synonyms: ["opening"], category: "house" },
  "table": { urdu: "میز", pronunciation: "mez", meaning: "A piece of furniture with a flat top", example: "Put the books on the table.", synonyms: ["desk"], category: "house" },
  "chair": { urdu: "کرسی", pronunciation: "kursi", meaning: "A seat with a back", example: "Sit on the chair.", synonyms: ["seat"], category: "house" },
  "bed": { urdu: "بستر", pronunciation: "bistar", meaning: "A piece of furniture for sleeping", example: "Go to bed early.", synonyms: ["cot", "mattress"], category: "house" },

  // Actions
  "eat": { urdu: "کھانا", pronunciation: "khaana", meaning: "To put food in the mouth", example: "Let's eat dinner.", synonyms: ["consume", "dine"], category: "actions" },
  "drink": { urdu: "پینا", pronunciation: "peena", meaning: "To take liquid into the mouth", example: "Drink plenty of water.", synonyms: ["sip", "gulp"], category: "actions" },
  "sleep": { urdu: "سونا", pronunciation: "soona", meaning: "To rest with eyes closed", example: "I need to sleep.", synonyms: ["rest", "nap"], category: "actions" },
  "walk": { urdu: "چلنا", pronunciation: "chalna", meaning: "To move on foot", example: "Let's walk to the park.", synonyms: ["stroll", "march"], category: "actions" },
  "run": { urdu: "دوڑنا", pronunciation: "dorna", meaning: "To move quickly on foot", example: "He can run very fast.", synonyms: ["sprint", "jog"], category: "actions" },
  "read": { urdu: "پڑھنا", pronunciation: "parhna", meaning: "To look at and understand written words", example: "I love to read books.", synonyms: ["study", "peruse"], category: "actions" },
  "write": { urdu: "لکھنا", pronunciation: "likhna", meaning: "To form letters on a surface", example: "Please write your name.", synonyms: ["compose", "pen"], category: "actions" },
  "speak": { urdu: "بولنا", pronunciation: "bolna", meaning: "To say words aloud", example: "Please speak slowly.", synonyms: ["talk", "say"], category: "actions" },
  "listen": { urdu: "سننا", pronunciation: "sunna", meaning: "To pay attention to sound", example: "Listen to the music.", synonyms: ["hear", "attend"], category: "actions" },
  "see": { urdu: "دیکھنا", pronunciation: "dekhna", meaning: "To perceive with eyes", example: "I can see the mountain.", synonyms: ["view", "watch"], category: "actions" },
  "give": { urdu: "دینا", pronunciation: "dena", meaning: "To freely transfer possession", example: "Give me the book.", synonyms: ["offer", "present"], category: "actions" },
  "take": { urdu: "لینا", pronunciation: "lena", meaning: "To reach for and hold", example: "Take this gift.", synonyms: ["grab", "seize"], category: "actions" },
  "help": { urdu: "مدد", pronunciation: "madad", meaning: "To assist someone", example: "Can you help me?", synonyms: ["assist", "aid"], category: "actions" },
  "make": { urdu: "بنانا", pronunciation: "banana", meaning: "To create or produce", example: "Let's make a plan.", synonyms: ["create", "build"], category: "actions" },
  "know": { urdu: "جاننا", pronunciation: "jaanna", meaning: "To be aware of through information", example: "I know the answer.", synonyms: ["understand", "realize"], category: "actions" },

  // Professions
  "doctor": { urdu: "ڈاکٹر", pronunciation: "doctor", meaning: "A person who treats illness", example: "The doctor is examining the patient.", synonyms: ["physician", "medic"], category: "professions" },
  "teacher": { urdu: "استاد", pronunciation: "ustaad", meaning: "A person who teaches", example: "My teacher is very kind.", synonyms: ["instructor", "tutor", "mentor"], category: "professions" },
  "engineer": { urdu: "انجینئر", pronunciation: "engineer", meaning: "A person who designs and builds", example: "He is a software engineer.", synonyms: ["developer", "architect"], category: "professions" },
  "lawyer": { urdu: "وکیل", pronunciation: "wakeel", meaning: "A person who practices law", example: "The lawyer defended the case.", synonyms: ["attorney", "advocate"], category: "professions" },
  "police": { urdu: "پولیس", pronunciation: "police", meaning: "Law enforcement officers", example: "Call the police!", synonyms: ["cops", "law enforcement"], category: "professions" },
  "farmer": { urdu: "کسان", pronunciation: "kisaan", meaning: "A person who cultivates land", example: "The farmer grows wheat.", synonyms: ["agriculturalist", "cultivator"], category: "professions" },
  "driver": { urdu: "ڈرائیور", pronunciation: "driver", meaning: "A person who operates a vehicle", example: "The driver is careful.", synonyms: ["chauffeur", "operator"], category: "professions" },
  "cook": { urdu: "باورچی", pronunciation: "bawarchi", meaning: "A person who prepares food", example: "The cook made delicious food.", synonyms: ["chef", "culinary"], category: "professions" },
  "nurse": { urdu: "نرس", pronunciation: "nurse", meaning: "A person who cares for the sick", example: "The nurse helped the patient.", synonyms: ["caretaker", "medical"], category: "professions" },
  "student": { urdu: "طالب علم", pronunciation: "talib-e-ilm", meaning: "A person who is studying", example: "She is a good student.", synonyms: ["pupil", "learner", "scholar"], category: "professions" },

  // Countries & Places
  "country": { urdu: "ملک", pronunciation: "mulk", meaning: "A nation with its own government", example: "Pakistan is a beautiful country.", synonyms: ["nation", "land", "state"], category: "places" },
  "city": { urdu: "شہر", pronunciation: "shehar", meaning: "A large human settlement", example: "Karachi is a big city.", synonyms: ["town", "metropolis", "urban area"], category: "places" },
  "village": { urdu: "گاؤں", pronunciation: "gaon", meaning: "A small rural community", example: "The village is peaceful.", synonyms: ["hamlet", "settlement"], category: "places" },
  "road": { urdu: "سڑک", pronunciation: "sarak", meaning: "A wide path for travel", example: "The road is busy.", synonyms: ["street", "highway"], category: "places" },
  "park": { urdu: "پارک", pronunciation: "park", meaning: "A public green area", example: "Let's go to the park.", synonyms: ["garden", "playground"], category: "places" },
  "school": { urdu: "اسکول", pronunciation: "school", meaning: "An institution for educating children", example: "The school starts at 8 AM.", synonyms: ["academy", "institution", "college"], category: "places" },
  "hospital": { urdu: "ہسپتال", pronunciation: "hospital", meaning: "An institution for medical treatment", example: "He is in the hospital.", synonyms: ["clinic", "medical center"], category: "places" },
  "market": { urdu: "بازار", pronunciation: "bazaar", meaning: "A place for buying and selling", example: "Let's go to the market.", synonyms: ["shop", "mall", "bazaar"], category: "places" },
  "mosque": { urdu: "مسجد", pronunciation: "masjid", meaning: "A Muslim place of worship", example: "The mosque is nearby.", synonyms: ["masjid", "prayer hall"], category: "places" },

};

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<[string, typeof dictionaryData[string]][]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function handleSearch(value: string) {
    setSearch(value);
    setActiveCategory(null);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const q = value.toLowerCase();
    const filtered = Object.entries(dictionaryData).filter(
      ([word, data]) =>
        word.includes(q) ||
        data.urdu.includes(q) ||
        data.meaning.toLowerCase().includes(q) ||
        data.category.includes(q)
    );
    setResults(filtered.slice(0, 15));
  }

  function filterByCategory(category: string) {
    setActiveCategory(category);
    setSearch("");
    const filtered = Object.entries(dictionaryData).filter(
      ([, data]) => data.category === category
    );
    setResults(filtered.slice(0, 15));
  }

  const categories = [
    { id: "greetings", label: "Greetings", icon: "👋", count: Object.values(dictionaryData).filter(d => d.category === "greetings").length },
    { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦", count: Object.values(dictionaryData).filter(d => d.category === "family").length },
    { id: "body", label: "Body Parts", icon: "🦴", count: Object.values(dictionaryData).filter(d => d.category === "body").length },
    { id: "food", label: "Food & Drink", icon: "🍽️", count: Object.values(dictionaryData).filter(d => d.category === "food").length },
    { id: "nature", label: "Nature", icon: "🌿", count: Object.values(dictionaryData).filter(d => d.category === "nature").length },
    { id: "animals", label: "Animals", icon: "🐾", count: Object.values(dictionaryData).filter(d => d.category === "animals").length },
    { id: "colors", label: "Colors", icon: "🎨", count: Object.values(dictionaryData).filter(d => d.category === "colors").length },
    { id: "numbers", label: "Numbers", icon: "🔢", count: Object.values(dictionaryData).filter(d => d.category === "numbers").length },
    { id: "time", label: "Days & Time", icon: "⏰", count: Object.values(dictionaryData).filter(d => d.category === "time").length },
    { id: "emotions", label: "Emotions", icon: "😊", count: Object.values(dictionaryData).filter(d => d.category === "emotions").length },
    { id: "technology", label: "Technology", icon: "💻", count: Object.values(dictionaryData).filter(d => d.category === "technology").length },
    { id: "house", label: "House & Furniture", icon: "🏠", count: Object.values(dictionaryData).filter(d => d.category === "house").length },
    { id: "actions", label: "Actions & Verbs", icon: "🏃", count: Object.values(dictionaryData).filter(d => d.category === "actions").length },
    { id: "professions", label: "Professions", icon: "👔", count: Object.values(dictionaryData).filter(d => d.category === "professions").length },
    { id: "places", label: "Places", icon: "📍", count: Object.values(dictionaryData).filter(d => d.category === "places").length },
  ];

  return (
    <>
      <Head>
        <title>English-Urdu Dictionary | TechVeb</title>
        <meta name="description" content="Search English to Urdu dictionary with 100+ words, meanings, pronunciations, and examples." />
        <link rel="canonical" href="https://techveb.com/dictionary" />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-b from-cyan-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📖</span>
            <div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">English-Urdu Dictionary</h1>
              <p className="text-muted-foreground text-sm">100+ words with meanings, pronunciations, and examples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search English or Urdu word..."
            className="w-full rounded-xl border border-border bg-surface pl-12 pr-4 py-4 text-lg text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{results.length} results found</p>
              {(search || activeCategory) && (
                <button onClick={() => { setSearch(""); setActiveCategory(null); setResults([]); }} className="text-xs text-primary hover:underline">Clear</button>
              )}
            </div>
            {results.map(([word, data]) => (
              <div key={word} className="rounded-xl border border-border bg-surface p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-foreground capitalize">{word}</h2>
                    <p className="text-sm text-primary">{data.urdu}</p>
                    <p className="text-xs text-muted-foreground italic">/{data.pronunciation}/</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">{data.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{data.meaning}</p>
                <div className="rounded-lg bg-muted px-3 py-2 mb-3">
                  <p className="text-xs text-muted-foreground">Example:</p>
                  <p className="text-sm text-foreground italic">&quot;{data.example}&quot;</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Similar:</span>
                  {data.synonyms.map((syn) => (
                    <span key={syn} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {search.length >= 2 && results.length === 0 && (
          <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-muted-foreground">No results found for &quot;{search}&quot;</p>
            <p className="text-xs text-muted-foreground mt-1">Try searching with a different word</p>
          </div>
        )}

        {search.length < 2 && !activeCategory && (
          <div className="mt-8">
            <h2 className="font-heading text-xl font-bold mb-4">Popular Words</h2>
            <div className="flex flex-wrap gap-2">
              {["hello", "thank you", "love", "water", "food", "happy", "beautiful", "money", "friend", "computer", "mother", "father", "sun", "moon", "red", "blue", "eat", "drink", "sleep", "doctor", "teacher"].map((word) => (
                <button
                  key={word}
                  onClick={() => handleSearch(word)}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all capitalize"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => filterByCategory(cat.id)}
              className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                activeCategory === cat.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-surface hover:border-primary/30"
              }`}
            >
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <h3 className="font-heading font-bold text-sm text-foreground">{cat.label}</h3>
              <p className="text-xs text-muted-foreground">{cat.count} words</p>
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{Object.keys(dictionaryData).length}+</p>
              <p className="text-xs text-muted-foreground">Words</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{categories.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">免费</p>
              <p className="text-xs text-muted-foreground">Always Free</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
