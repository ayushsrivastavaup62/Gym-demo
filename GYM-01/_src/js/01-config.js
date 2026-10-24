/* ==========================================================================
   OXYGEN GYM — EDIT EVERYTHING HERE
   Business details, prices, hours, programs, coaches, reviews and FAQs all
   come from this object. Change a value, save, reload — that's it.

   PLACEHOLDERS TO REPLACE BEFORE GOING LIVE
   - contact.phoneDisplay / contact.phoneHref / contact.whatsapp
   - contact.addressLines / contact.addressShort / contact.maps
   - hours.sunday (demo assumes 7–11 AM)
   - social.instagram / social.facebook
   - owner, trainers and gallery photos (AI-generated demo images)
   - brand.credit
   Also update the JSON-LD block and SEO meta tags in <head> to match.
   ========================================================================== */
"use strict";

const CONFIG = {
  brand: {
    name: "Oxygen Gym",
    wordmark: "OXYGEN",
    secondLine: "GYM",
    tagline: "Trust the process",
    established: 2016,
    credit: "Ayush"
  },

  contact: {
    phoneDisplay: "+91 98765 43210",
    phoneHref: "+919876543210",
    whatsapp: "919876543210",
    addressLines: ["12, Ring Road, Scheme 54,", "Indore, Madhya Pradesh 452010"],
    addressShort: "12, Ring Road, Scheme 54 · Indore",
    maps: "https://www.google.com/maps/search/?api=1&query=Oxygen+Gym+Scheme+54+Indore"
  },

  social: {
    instagram: "#",
    facebook: "#"
  },

  hours: {
    weekdayLabel: "Mon – Sat",
    weekday: "5:30 AM – 9:30 PM",
    weekdayOpen: "05:30",
    weekdayClose: "21:30",
    sundayLabel: "Sunday",
    sunday: "7:00 AM – 11:00 AM",
    sundayOpen: "07:00",
    sundayClose: "11:00",
    timezone: "Asia/Kolkata"
  },

  rating: { value: 4.7, count: 10, source: "Google" },

  stats: [
    { value: 10, decimals: 0, suffix: "+", label: "Years on the floor" },
    { value: 850, decimals: 0, suffix: "+", label: "Members trained" },
    { value: 3, decimals: 0, suffix: "", label: "Full-time coaches" },
    { value: 45, decimals: 0, suffix: "+", label: "Machines & stations" },
    { value: 4.7, decimals: 1, suffix: "★", label: "Google rating", star: true }
  ],

  programs: [
    {
      name: "CrossFit",
      icon: "bolt",
      description: "High-intensity functional training that builds real-world strength. Coached WODs, scaled for every level.",
      meta: "60 min · Group"
    },
    {
      name: "Cycling",
      icon: "bike",
      description: "Low-impact, high-energy rides on 12 spin bikes. Expect sweat, bass and a very good playlist.",
      meta: "45 min · Group"
    },
    {
      name: "Personal Training",
      icon: "user",
      description: "Your own coach, your own plan. Form checks, progress tracking and a schedule that fits your work.",
      meta: "1-on-1 · By appointment"
    },
    {
      name: "Weight Training",
      icon: "dumbbell",
      description: "Free weights, racks and machines for structured strength work. Programs written for your goal.",
      meta: "Open floor · All day"
    },
    {
      name: "Zumba",
      icon: "music",
      description: "Dance-first cardio with Bollywood and Latin beats. You'll forget you're working out — until tomorrow.",
      meta: "45 min · Group"
    }
  ],

  equipment: [
    {
      name: "Treadmills",
      photo: "treadmills",
      alt: "A row of treadmills under warm industrial lights at Oxygen Gym",
      description: "Two rows, screens and fans. Free at peak hours? Usually at least one is."
    },
    {
      name: "Spin Bikes",
      photo: "spin",
      alt: "Spin bikes lined up in the cycling studio",
      description: "A 12-bike studio with dimmed lights and instructors who know how to pace a ride."
    },
    {
      name: "Cable Machines",
      photo: "cables",
      alt: "Cable crossover machine in the strength area",
      description: "Crossovers, pulleys and rows. The full range, all adjustable, all working."
    },
    {
      name: "Smith Machine",
      photo: "smith",
      alt: "Smith machine set up for squats and presses",
      description: "For safe squats, presses and the occasional ego lift. We won't tell."
    },
    {
      name: "Dumbbells & Racks",
      photo: "dumbbells",
      alt: "A rack of dumbbells from light to heavy",
      description: "Dumbbells up to 50 kg, bumper plates, benches and three squat racks."
    }
  ],

  owner: {
    name: "Manish Chauhan",
    role: "Founder & head coach",
    photo: "owner",
    alt: "Manish Chauhan, founder of Oxygen Gym, in the training hall",
    years: "12+ years coaching",
    bio: "I opened Oxygen in 2016 with one rack and a whiteboard. The idea was simple: a gym where the coach knows your name, your knee niggle and your deadline. A decade later, I still take the 5:30 AM batch — that's where the culture is built.",
    quote: "The mirror is a bonus. The habit is the real result.",
    credentials: ["Strength & conditioning", "Rehab-aware coaching", "Nutrition basics", "Precision Nutrition L1"]
  },

  trainers: [
    {
      name: "Aarti Rathore",
      role: "Strength & mobility",
      photo: "aarti",
      alt: "Aarti Rathore, strength and mobility coach, holding a kettlebell",
      years: "7 yrs",
      bio: "Fixes the small things — hip position, breathing, bracing — so the big lifts finally move."
    },
    {
      name: "Karan Malhotra",
      role: "CrossFit & conditioning",
      photo: "karan",
      alt: "Karan Malhotra, CrossFit coach, with a jump rope",
      years: "6 yrs",
      bio: "CrossFit Level 2 coach. Writes WODs that leave you tired, not broken — and scales every one."
    },
    {
      name: "Sana Khan",
      role: "Zumba & fat loss",
      photo: "sana",
      alt: "Sana Khan, Zumba instructor, smiling in the studio",
      years: "5 yrs",
      bio: "Runs the 7 PM batch on Bollywood, Latin beats and zero judgement. Come for cardio, stay for the energy."
    }
  ],

  plans: [
    {
      id: "monthly",
      name: "Monthly",
      price: 1000,
      monthly: 1000,
      period: "month",
      note: "For testing the waters. Stay as long as it works.",
      features: [
        "Full gym + cardio access",
        "All group classes included",
        "Locker & shower",
        "Starter fitness assessment",
        "No joining fee"
      ],
      cta: "Join monthly"
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: 2700,
      monthly: 900,
      period: "quarter",
      note: "The habit is forming. Keep the momentum going.",
      save: "Save ₹300",
      popular: true,
      features: [
        "Everything in Monthly",
        "Monthly progress check-in",
        "Nutrition starter guide",
        "1 guest pass every month",
        "Priority class booking"
      ],
      cta: "Join quarterly"
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 8500,
      monthly: 708,
      period: "year",
      note: "For people who are done starting over.",
      save: "Save ₹3,500",
      features: [
        "Everything in Quarterly",
        "15-day membership freeze",
        "2 personal training sessions",
        "Free Oxygen training tee",
        "Priority booking, all year"
      ],
      cta: "Join yearly"
    }
  ],

  gallery: [
    {
      photo: "gallery-lift",
      ratio: "4 / 5",
      alt: "A member mid-deadlift with a loaded barbell",
      caption: "Leg day · 7:02 PM"
    },
    {
      photo: "gallery-ropes",
      ratio: "3 / 4",
      alt: "Battle ropes mid-wave on the conditioning floor",
      caption: "Conditioning floor · 6:10 AM"
    },
    {
      photo: "class",
      ratio: "4 / 3",
      alt: "A full kettlebell group class in progress",
      caption: "Saturday class · full house"
    },
    {
      photo: "gallery-coach",
      ratio: "4 / 5",
      alt: "A coach spotting a member during a bench press",
      caption: "Spotting done right"
    },
    {
      photo: "interior",
      ratio: "4 / 3",
      alt: "Wide view of the main gym floor in the early morning",
      caption: "The 5:30 AM club"
    },
    {
      photo: "chalk",
      ratio: "1 / 1",
      alt: "Chalked hands gripping a barbell before a lift",
      caption: "Where it all starts"
    }
  ],

  reviews: [
    {
      name: "Rohit Verma",
      since: "Member since 2023",
      rating: 5,
      title: "Lost 9 kg without hating the process",
      body: "I'd tried two gyms before this. The difference is the coaching — Karan sir corrected my form on day one and checked my diet every week. No fancy supplements, just a plan I could actually follow.",
      initials: "RV"
    },
    {
      name: "Priya Sharma",
      since: "Member since 2024",
      rating: 4.5,
      title: "The 7 PM Zumba batch is my favourite hour",
      body: "Sana makes the class feel like a party, but you're still sweating by the third song. A year in and my stamina is a completely different story. The showers are clean too, which honestly matters.",
      initials: "PS"
    },
    {
      name: "Imran Qureshi",
      since: "Member since 2022",
      rating: 5,
      title: "5:30 AM has its own little family",
      body: "Manish sir is on the floor before anyone else. Equipment is clean, the music isn't too loud, and nobody judges you for being a beginner. That last part is why I stayed.",
      initials: "IQ"
    },
    {
      name: "Neha Jain",
      since: "Member since 2025",
      rating: 4,
      title: "Clean, spacious, never too crowded",
      body: "Even at peak hours I've never waited more than five minutes for a squat rack. The trainers are approachable and actually remember your name. The only thing I'd add is more mirrors near the free weights.",
      initials: "NJ"
    },
    {
      name: "Aditya Chouhan",
      since: "Member since 2024",
      rating: 5,
      title: "First time I've stuck to a gym",
      body: "Three months in and I still look forward to coming. The PT sessions gave me a routine, and the quarterly plan made it easy to commit without spending too much upfront. Simple, honest place.",
      initials: "AC"
    }
  ],

  faqs: [
    {
      q: "What do the membership fees include?",
      a: "The full floor, cardio, all group classes, lockers, showers and a starter fitness assessment. Monthly is {monthly}, quarterly {quarterly} and yearly {yearly}. There's no joining fee."
    },
    {
      q: "What are your timings?",
      a: "Monday to Saturday, {weekdayHours}. Sunday is {sundayHours}. Long weekends can change the Sunday slot, so a quick call before you visit is always a good idea."
    },
    {
      q: "Can I try a class before joining?",
      a: "Yes — one free trial session with a coach walkthrough. Message us with “TRIAL” on WhatsApp and we'll block a slot. Come in trainers, bring water, keep it simple."
    },
    {
      q: "Are personal trainers available?",
      a: "Yes. One-on-one PT is available by appointment with Aarti or Karan at a separate fee. Yearly members get two sessions included, and couples can book joint sessions on request."
    },
    {
      q: "I've never trained before. Will I feel out of place?",
      a: "Not at all. About 40% of our members started as complete beginners. Every program has a scaled version and coaches check your form before adding load. Just show up — we'll handle the rest."
    },
    {
      q: "Is there parking and a shower?",
      a: "Yes. Two-wheeler and car parking on site, separate changing rooms with showers, and lockers at reception. Bring a towel and, if you like, your own padlock."
    }
  ],

  messages: {
    trial: "Hi Oxygen Gym! I'd like to book my free trial session. Please share a suitable time.",
    general: "Hi Oxygen Gym! I have a question about joining.",
    plan: "Hi Oxygen Gym! I'm interested in the {plan} membership ({price}). Please share the next steps."
  }
};
