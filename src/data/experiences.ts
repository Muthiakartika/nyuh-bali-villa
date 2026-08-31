// Detail content for the retreat programmes, wellness classes and cultural
// activities — 18 WordPress pages that sit one level below the navigation.
//
// GENERATED from the live site, then reviewed by hand. Files that consume this:
//   src/app/ubud/[...experience]/page.tsx
//   src/components/property/ExperienceDetail.tsx

const U = "https://nyuhbalivillas.com/wp-content/uploads/";

/** A titled run of bullets. One of these is a block inside a programme tier
 * ("Retreat Exclusive", "Complimentary"), or a stand-alone list like the
 * slimming page's "What's Included?". The heading is optional because the
 * treatments that open every tier are an unlabelled list on the live site. */
export type BulletGroup = { heading?: string; items: string[] };

/** One tier of the live "Available Programs" accordion — "5 Nights", "7
 * Nights", and so on. Each tier lists its own treatments and then repeats the
 * two shared blocks, exactly as the live page does. */
export type ExperienceProgram = { name: string; groups: BulletGroup[] };

/** A titled prose block between the intro and the programmes — the live
 * anti-aging page runs four of them, the slimming page one. */
export type ExperienceSection = {
  heading: string;
  body: string[];
  /** The slimming page's "Contour Master Slim" block carries a photograph of
   * the device; the anti-aging blocks are text only. */
  image?: string;
};

/** One card of the "Why Choose Ubud Nyuh Bali Resort?" grid. The icons are the
 * live site's own transparent gold line PNGs. */
export type ExperienceHighlight = { icon: string; title: string; body: string };

/** One person in the "Meet our … Team" row. `name` is taken from the opening
 * words of the live bio, so no new copy is written for the caption. */
export type TeamMember = { name: string; photo: string; bio: string };

export type Experience = {
  /** Path under /ubud/ — e.g. "wellness/yoga". */
  slug: string;
  group: "retreat" | "wellness" | "culture";
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** The live "Recommended for :" bullets, on the four personalised retreats. */
  recommendedFor?: string[];
  /** The closing "the retreat is not one-size-fits-all…" paragraph, which sits
   * *after* the Recommended for list rather than with the intro copy. */
  note?: string;
  /** Titled prose blocks, in live order, between the intro and the programmes. */
  sections?: ExperienceSection[];
  /** The "Why Choose Ubud Nyuh Bali Resort?" grid. */
  highlights?: { heading: string; items: ExperienceHighlight[] };
  /** Stand-alone bullet blocks — the slimming page's "The Benefit of…" and
   * "What's Included?". */
  blocks?: { heading: string; intro?: string; groups: BulletGroup[] }[];
  /** The live "Available Programs" accordion. The six retreat programmes each
   * publish three to five length-of-stay tiers; before this they were flattened
   * into one undifferentiated `inclusions` list, which lost the whole point of
   * the section — that what you get depends on how long you stay. */
  programs?: { heading: string; tiers: ExperienceProgram[] };
  /** The live "Inclusions" bullet list, where the page has one. Empty on the
   * retreat programmes, which carry `programs` instead. */
  inclusions: string[];
  /** Price line, verbatim, where the page states one. */
  price?: string;
  faq: { question: string; answer: string }[];
  /** The live heading over the FAQ block. The yoga page calls it "FAQ", the
   * slimming page "Frequently Asked Questions"; both are kept verbatim. */
  faqHeading?: string;
  /** The live "Begin your … journey in Ubud, Bali" band that sits between the
   * programmes and the team on the two flagship retreat pages. */
  closingCta?: string;
  /** "Meet our Anti Aging's Team" / "Meet our Slimming Team". */
  team?: { heading: string; members: TeamMember[] };
  gallery: string[];
  hero: string;
};

/** Every programme tier on every retreat page closes with these same two
 * blocks, byte-for-byte — verified across all five pages that publish them.
 * Kept here once and spread into each tier rather than repeated 22 times. */
const RETREAT_STANDARD: BulletGroup[] = [
  {
    heading: "Retreat Exclusive",
    items: [
      "Welcome meeting with Our Retreat Specialist to introduce the program",
      "Round trip airport transfer",
      "Daily gourmet healthy cuisine for lunch or dinner",
      "Daily Elixir",
      "Signature gift from Nyuh Bali",
      "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality",
    ],
  },
  {
    heading: "Complimentary",
    items: [
      "Daily breakfast",
      "Daily afternoon tea",
      "Daily Morning Walk to the Rice Field",
      "Daily Morning Yoga",
      "Free bicycle rental and access to our home gym",
      "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making",
      "Daily wellness activities like sound healing, pilates, meditation, and breathwork",
    ],
  },
];

/** The four programmes the live site groups as "Personalized Luxury Retreat".
 * Each of their pages closes with an "Other Personalized Luxury Retreat" grid
 * showing the other three, which is what `otherPersonalisedRetreats` builds.
 *
 * The live site uses a different thumbnail for the same retreat depending on
 * which page you are on; one image per retreat is used here instead, so no
 * photograph can end up on a page twice. */
export const PERSONALISED_RETREATS = [
  {
    slug: "retreat/couples",
    label: "Couple's Retreat",
    image: `${U}2023/03/ubud-yoga-4.webp`,
  },
  {
    slug: "retreat/luxury/balinese-healing",
    label: "Authentic Balinese Healing",
    image: `${U}2023/04/Foto-09-11-20-16.49.06-2-Copy-min-1.jpg`,
  },
  {
    slug: "retreat/luxury/holistic-balancing",
    label: "Holistic Balancing Retreat",
    image: `${U}2023/03/Spa-ubud-slider-1.jpg`,
  },
  {
    slug: "retreat/luxury/new-beginning",
    label: "New Beginning",
    image: `${U}2023/04/New-Beginning-1-min-1.jpg`,
  },
];

/** The other three personalised retreats, for the closing grid. Returns an
 * empty array for anything that isn't one of the four. */
export function otherPersonalisedRetreats(slug: string) {
  if (!PERSONALISED_RETREATS.some((item) => item.slug === slug)) return [];
  return PERSONALISED_RETREATS.filter((item) => item.slug !== slug);
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "retreat/couples",
    group: "retreat",
    eyebrow: "Retreat",
    title: "Couple's Retreat",
    paragraphs: [
      "Rediscover love and connection with the Couples Retreat at Ubud Nyuh Bali Resort. Indulge in romantic candlelight dinners, soothing couple massages, and picturesque floating breakfasts in your private villa pool. Immerse yourselves in the beauty of Bali with yoga, Balinese cultural experiences, and serene walks through lush rice fields. Every moment is designed to deepen your bond and create memories to treasure forever.",
    ],
    recommendedFor: [
      "Starting healthy life style together with your love",
      "Strengthening the relationship",
    ],
    note: "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    inclusions: [],
    programs: {
      heading: "Available Programs",
      tiers: [
        {
          name: "3 Nights",
          groups: [
            {
              items: [
                "1 x Private Couple Yoga to strengthen the relationship",
                "1x Healthy Balinese Cooking Class",
                "Romantic set up upon arrival",
                "1x 60 mins Relaxing Balinese massage for two",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "5 Nights",
          groups: [
            {
              items: [
                "1x Private Couple Yoga to strengthen the relationship",
                "1x Healthy Balinese Cooking Class",
                "Romantic set up upon arrival",
                "1x 60 mins Relaxing Balinese massage for two",
                "Romantic flower bath experience",
                "1x Romantic Candle light Dinner featuring healthy gourmet cuisine",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "7 Nights",
          groups: [
            {
              items: [
                "2x Private Couple Yoga to strengthen the relationship",
                "1x Healthy Balinese Cooking Class",
                "Romantic set up upon arrival",
                "1x 60 mins Relaxing Balinese massage for two",
                "Romantic flower bath experience",
                "1x Romantic Candlelight Dinner featuring healthy gourmet cuisine",
                "1x 60 mins Traditional coconut body scrub and wrap for two",
                "1x90 mins River stone massage",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "10 Nights",
          groups: [
            {
              items: [
                "2x Private Couple Yoga to strengthen the relationship",
                "1x Healthy Balinese Cooking Class",
                "Romantic set up upon arrival",
                "1x 60 mins Relaxing Balinese massage for two",
                "Romantic flower bath experience",
                "1x Romantic Candle light Dinner featuring healthy gourmet cuisine",
                "1x 60 mins Traditional coconut body scrub and wrap for two",
                "1x90 mins River stone massage",
                "Balinese Blessing at resort temple included Balinese Custome Rental",
                "1x Photography session with 5 digital photos",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "14 Nights",
          groups: [
            {
              items: [
                "Three Private Couple Yoga sessions to strengthen the relationship",
                "One time Private sound healing treatment",
                "One time Healthy Balinese Cooking Class",
                "Balinese Purification Ceremony",
                "Romantic decoration upon arrival",
                "One time Romantic Candlelight Dinner featuring healthy gourmet cuisine for couple",
                "One time Romantic flower bath to share",
                "One time 60 minutes Relaxing Balinese massage for a couple",
                "One time 30 min Traditional coconut body scrub and 30 min body wrap for couple",
                "One time 90 minutes River stone massage for couple",
                "One time 90 mins deep tissue massage",
                "One time Milk body polish with scalp massage",
                "One time Authentic Hair Creambath",
                "One time Photography session included 5 digital photos and Balinese Custome Rental",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
      ],
    },
    faq: [],
    gallery: [
      `${U}2023/03/ubud-yoga-3.webp`,
    ],
    hero: `${U}2023/05/IS_06904-Copy-min-1.jpg`,
  },
  {
    slug: "retreat/slimming",
    group: "retreat",
    eyebrow: "Retreat",
    title: "Holistic Slimming Retreat in Ubud",
    paragraphs: [
      "Ubud Nyuh Bali Resort is a luxury retreat resort in Ubud Bali that features a holistic slimming program to restore your body’s balance for optimal systemic health. Build the foundation for sustainable weight loss through evidence-based medicine and a healthy approach to nourishing your body rather than extreme restrictions. Our sustainable weight loss program encompasses integrative aspects: Nutrition, Structured Personal Training, CE Certified Muscle Sculpting Treatment, and Lymphatic Drainage Massage.",
      "\"The First and Only Retreat Resort in Bali that combines Scientific Based Medicine and the Goodness of Balinese Healing to provide the best slimming retreat you deserve\"",
      "Your physical body is a reflection of not only your diet and exercise but also of your inner thought and feelings. Enjoy the opportunity to let go, and release the emotional barriers to weight loss with wide range of stress-relieving activities like breathwork, yoga, sound healing, & spa. Our team of certified anti-aging doctor, personal fitness trainer, therapist, and retreat specialist are on hand to help you achieve what you really want, a body and a life which you truly love",
    ],
    sections: [
      {
        heading: "Contour Master Slim",
        body: ["If you are looking for a scientifically proven solution to build muscle and burn fat, CM Slim is a worldwide technology for non-invasive body contouring using a focused electromagnetic. CMSLIM is a painless and safe treatment that can produce up to 30,000 squats or crunches in 30 minutes without any downtime. CM Slim is not a replacement for working out but rather works best when used in conjunction with exercise and a balanced diet. It’s an ideal choice for beginners, post-pregnant women, or anyone who wants to tone the specific area, such as more defined abs or a butt lift. As CM Slim strengthens the muscle, you will notice that you will feel stronger in your workouts. Please click here for more information."],
        image: `${U}2023/07/Untitled-design-17-min-min-1.png`,
      },
    ],
    highlights: {
      heading: "Why Choose Ubud Nyuh Bali Resort?",
      items: [
        {
          icon: `${U}2023/07/1-min.png`,
          title: "Scientifically based Retreat",
          body: "No fake science, no hoax, only the best approach according to the science",
        },
        {
          icon: `${U}2023/07/2-min.png`,
          title: "Holistic approach",
          body: "A combination of nutrition, exercise, advanced technology, and stress reliever sessions for suistanable weight loss",
        },
        {
          icon: `${U}2023/07/3-min.png`,
          title: "Supervised by Doctor",
          body: "Personalized initial consultation & follow-up with Certified Anti Aging Doctor",
        },
        {
          icon: `${U}2023/07/Untitled-design-13-min.png`,
          title: "Personalized Retreat",
          body: "Everyone has their own journey. Enjoy the retreat at your own pace.",
        },
        {
          icon: `${U}2023/04/icon-star.png`,
          title: "Advanced Technology",
          body: "Featured CM Slim to supplement your weight loss journey in a safe way.",
        },
        {
          icon: `${U}2023/07/Untitled-design-15-min.png`,
          title: "Various Dietary Options",
          body: "We tailor our food to individual dietary, such as vegetarian, vegan & gluten-free",
        },
      ],
    },
    blocks: [
      {
        heading: "The Benefit of Slimming Retreat",
        groups: [{ items: [
            "Lose weight in an enjoyable journey",
            "Tone specific areas of your body",
            "Create new healthy patterns",
            "Feel more lighter, refreshed, and motivated",
          ] }],
      },
      {
        heading: "What's Included?",
        intro: "All of our retreats include essential elements & Nyuh's signature touch",
        groups: [{ items: [
            "Accommodation",
            "Welcome meeting with Our Retreat Specialist to introduce the program",
            "Round-trip airport transfer",
            "Pre-arrival questionnaire to design personalized program (optional)",
            "A gift to bring home and a personalized take-home message",
            "Daily Morning Walk to the Rice Field",
            "Free bicycle rental and access to our home gym",
            "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making",
          ] }],
      },
    ],
    inclusions: [],
    programs: {
      heading: "Available Slimming Programs to Choose",
      tiers: [
        {
          name: "7 Nights",
          groups: [
            {
              heading: "Scientific Approach",
              items: [
                "Initial consultation and post-program follow-up with the certified anti-aging doctor",
                "3x CE-Certified Muscle Sculpting on one targeted area to build the muscle",
                "1x Carboxytherapy on one targeted area to improve the skin elasticity",
                "Holistic assessment in the beginning to determine the personalized program tailored to your need",
                "Initial and Post-Program Body Composition Analysis",
              ],
            },
            {
              heading: "Structured Training & Stretching",
              items: [
                "2x personal training sessions offer a tailored combination of cardio, strength training, and mobility to inspire you with a renewed exercise to practice at home",
                "2 pilates sessions in a group",
                "7 hatha yoga in a group",
              ],
            },
            {
              heading: "Treatment & SPA",
              items: [
                "1x 60 mins Lymphatic drainage massage",
                "1x 60 mins Relaxing Balinese Massage",
              ],
            },
            {
              heading: "Nutritious Meal",
              items: [
                "3 daily nutritionally dense meals designed for optimal fat burning",
                "Daily elixir and Juice",
                "Daily Afternoon Tea",
                "Unlimited Mineral Water",
              ],
            },
            {
              heading: "Mindfulness",
              items: [
                "2 sound healing sessions in a group",
                "2 breathwork sessions in a group",
                "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality",
              ],
            },
          ],
        },
        {
          name: "14 Nights",
          groups: [
            {
              heading: "Scientific Approach",
              items: [
                "Initial consultation, mid-follow-up, and post-program follow-up with the certified anti-aging doctor",
                "6x CE-Certified Muscle Sculpting on one targeted area to build the muscle",
                "2x Carboxytherapy on one targeted area to improve the skin elasticity",
                "1 x One Month Supply of Weight Management Supplement",
                "Holistic assessment in the beginning to determine the personalized program tailored to your need",
                "Initial and Post-Program Body Composition Analysis",
              ],
            },
            {
              heading: "Structured Training & Stretching",
              items: [
                "4x personal training sessions offer a tailored combination of cardio, strength training, and mobility to inspire you with a renewed exercise to practice at home",
                "4 pilates sessions in a group",
                "14 hatha yoga in a group",
              ],
            },
            {
              heading: "Treatment & SPA",
              items: [
                "2x 60 mins Lymphatic drainage massage",
                "1x 90 mins Signature Bamboo drainage massage",
                "1x 60 mins Relaxing Balinese Massage",
                "1x Authentic Hair Creambath",
              ],
            },
            {
              heading: "Nutritious Meal",
              items: [
                "3 daily nutritionally dense meals designed for optimal fat-burning",
                "Daily Elixir and Juice",
                "Daily Afternoon Tea",
                "Unlimited Mineral Water",
              ],
            },
            {
              heading: "Mindfulness",
              items: [
                "4 sound healing sessions in a group",
                "4 breathwork sessions in a group",
                "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality",
              ],
            },
            {
              heading: "Nyuh Bali’s Touch",
              items: [
                "Welcome meeting with Our Retreat Specialist to introduce the program",
                "Round-trip airport transfer",
                "Pre-arrival questionnaire to design personalized program (optional)",
                "Gift to bring home and personalized take-home message",
              ],
            },
          ],
        },
      ],
    },
    faq: [
      {
        question: "Why don’t you provide colon cleansing?",
        answer: "We’re committed to designing our retreat with the scientific-based modality instead of adopting the popular treatment. Despite colon cleansing’s popularity, science does not support its purported benefits. In fact, colon cleansing may do more harm than good. Colon cleansing has no proven benefits and many adverse effects. Side effects of colon cleansing include nausea, vomiting, diarrhea, dizziness, dehydration, electrolyte abnormalities, acute kidney insufficiency, pancreatitis, bowel perforation, heart failure, and infection. Please read this scientific publication for further reading.",
      },
      {
        question: "How much kg could I lose during the retreat?",
        answer: "As our main goal is promoting general health, we design our program to be aligned with scientific-based and WHO recommendations. The current guideline encourages to lose weight 0,5-1 kg per week for a healthy and suistanable journey. Rapid weight loss could put you at risk of many health problems and weight regain.",
      },
      {
        question: "Is CM Slim safe?",
        answer: "CM slim is non-invasive and completely safe treatment with no downtime. In the small percentage, some sensitive individual can experience redness on the targeted area that will resolve within 4 up to 24 hours. CM slim are used in the world wide and has received CE certification as safe and effective device.\n\nRefit is a painless, non invasive and relaxing treatment to tighten the body & reduce the appearance of cellulite. The Refit also implements Safe Anti-Spark (SAS) technology to provide the enhance the safety. In susceptible individuals, bruising could happen, but the symptom will resolve within few days.",
      },
      {
        question: "Is this slimming retreat suitable for everyone?",
        answer: "The retreat is designed for adults in the general population with no or mild health issues like mild dyslipidemia, first-degree obesity, and overweight. If you’re severely obese (BMI>= 40), we strongly suggest you consult with your doctor in your country before joining our retreat. Anyone with pacemaker, heart disease, stroke, uncontrolled diabetes, and other serious illness are not recommended to join the retreat.",
      },
      {
        question: "Who should avoid CM Slim?",
        answer: "If you have a pacemaker, internal debrillator or other implanted electrical devices, metal stents/ implants in your body\nPregnant woman is not suggested\nOpen or infected wounds\nActive systemic or local skin diseases\nHypotension\nGrade II hypertension",
      },
    ],
    faqHeading: "Frequently Asked Questions",
    closingCta: "Begin your slimming journey in Ubud, Bali",
    team: {
      heading: "Meet our Slimming Team",
      members: [
        {
          name: "Doctor Irene",
          photo: `${U}2023/07/Dr-Irene-161-min-min-1.jpg`,
          bio: "Doctor Irene graduated from one of the most prestigious medical faculty in Indonesia, Airlangga University with the cum laude predicate. Her strong passion for anti-aging medicine drives her to pursue a master’s degree in anti-aging medicine. She believes that everyone has the right to be the best of themselves. For her, happiness is to help her patients feel more confident with their skin and body. Besides aesthetic medicine, she is also certified to give consultation and treatment in nutrition and nutrigenomics. She actively participates in the workshop nationally and internationally to keep her updated with the newest technology in Aesthetic & Anti Aging Medicine",
        },
        {
          name: "Lina",
          photo: `${U}2023/07/AW_06579-Copy-min.jpg`,
          bio: "Lina took her first yoga class to find the balance between her long working hours as a midwife and relaxation. After more than 5 years of working as a midwife, Lina decided to follow her passion to become a professional wellness teacher. Since then, Lina has completed 200hr Yoga Teacher, then continued her wellness education through various workshops in Yin Yoga, Fly High Yoga, Aerial Yoga, and Pilates. As a former midwife, Lina has a deep knowledge of body anatomy and physiology that support her in teaching safe movement practice to her students.",
        },
        {
          name: "Gusti",
          photo: `${U}2023/07/AW_06603-1-min.jpg`,
          bio: "Gusti is a native Balinese Yoga & Healing teacher. Born into a family where yoga is a daily ritual, yoga has always been a strong influence in his life since he was little. He is passionate about exploring the power of breath and its connection to each yoga pose and your overall well-being. He is also a breathwork teacher and initiator of healing and vinyasa breathwork who will guide your breath in a way that enables the transformational process to occur.",
        },
        {
          name: "Jane",
          photo: `${U}2023/06/AW_06626-min-1.webp`,
          bio: "From an early age, Jane was captivated by the power of sound and its ability to evoke emotions, and create harmony. While attending one of the yoga festivals, she stumbled upon a sound bath session and was attracted by the transformative power of the experience. Intrigued and inspired, she dug deeper into the world of sound healing by enrolling in courses and attending workshops. As the years went by, Jane’s journey as a sound therapist flourished. Her sessions have touched a lot of individuals, helping them find peace, reduce stress, and promote well-being through the power of sound. Becoming a sound therapist allows her to share her passion for music and sound while making a positive impact on the lives of others.",
        },
      ],
    },
    gallery: [
      `${U}2023/05/TD004090-min.webp`,
    ],
    hero: `${U}2023/07/The-First-and-Only-Holistic-Scientifically-Based-Retreat-in-Bali-1-min-1.jpg`,
  },
  {
    slug: "retreat/luxury/anti-aging",
    group: "retreat",
    eyebrow: "Luxury Retreat",
    title: "Luxury Anti Aging Retreat in Ubud Bali",
    paragraphs: [
      "Nestled in the serene village of Ubud, our luxury anti-aging retreat offers a holistic rejuvenation experience, combining the psychological benefits of Balinese healing with scientifically proven treatments to address the biological effects of aging. As the first and only resort in Bali to feature an onsite aesthetic clinic through our collaboration with Healthy Look Aesthetic, we provide an exclusive and transformative experience. Our anti-aging retreat ensures the years fade away as you immerse yourself in lush green gardens and tropical forests—even before your treatments begin.",
    ],
    sections: [
      { heading: "World Class Anti Aging Treatment", body: ["Your retreat begins with an initial consultation with our anti-aging expert, who will assess your skin concerns and evaluate your diet and lifestyle. Using advanced technology, we conduct an in-depth analysis to create a personalized treatment plan. Depending on your length of stay, your rejuvenation journey may include medi-facials, IPL, IV infusions, non-surgical skin lifting, CM Slim muscle sculpting, and carboxytherapy. These treatments work together to deeply cleanse and purify the skin’s surface, stimulate collagen regeneration in the deeper layers, sculpt and tone muscles, and improve skin elasticity—revealing a radiant, healthier glow."] },
      { heading: "Full Body Rejuvenation", body: ["Relax & Indulge in Our Mahamaya Spa. With the perfect combination of Balinese-inspired healing treatment and high-quality ingredients, each spa experience is designed to help you unwind from daily life stress, improve blood circulation, and relieve the physical tension that holds you back."] },
      { heading: "Holistic Anti Aging Journey", body: ["By creating a healthy inner body, a healthier and younger-looking outer body is achieved. The retreat also comes with daily nutritious meals, physical exercise like pilates, and daily yoga sessions."] },
      { heading: "Rebalance & Renonnect", body: ["Sound therapies like singing bowl and mindfulness practices like breathwork have been widely known to reduce stress and inflammation in our body that leads to premature aging. During the retreat, you will be guided by mindfulness experts through sound healing and breathwork sessions to let go of things that no longer serve you, to look at yourself in a new light, and to appreciate your own body and beauty."] },
    ],
    highlights: {
      heading: "Why Choose Ubud Nyuh Bali Resort?",
      items: [
        {
          icon: `${U}2023/07/1-min.png`,
          title: "Scientifically based Retreat",
          body: "We partner with Healthy Look Aesthetic for science-backed treatments, ensuring only the best care.",
        },
        {
          icon: `${U}2023/07/2-min.png`,
          title: "Holistic approach",
          body: "A combination of nutrition, exercise, advanced technology, and stress reliever sessions for suistanable weight loss",
        },
        {
          icon: `${U}2023/07/3-min.png`,
          title: "Supervised by Doctor",
          body: "Personalized initial consultation with Anti Aging Expert. Anti aging treatment will be done by Doctor and Certified Nurse",
        },
        {
          icon: `${U}2023/07/Untitled-design-13-min.png`,
          title: "Personalized Retreat",
          body: "Everyone has their own journey. Enjoy the retreat at your own pace.",
        },
        {
          icon: `${U}2023/04/icon-star.png`,
          title: "Advanced Technology",
          body: "Featuring HIFU, CM Slim, IPL, and medical facials for effective anti-aging solutions.",
        },
        {
          icon: `${U}2023/07/Untitled-design-15-min.png`,
          title: "Various Dietary Options",
          body: "We tailor our food to individual dietary, such as vegetarian, vegan & gluten-free",
        },
      ],
    },
    inclusions: [],
    programs: {
      heading: "Available Programs",
      tiers: [
        {
          name: "5 Nights",
          groups: [
            {
              items: [
                "1x Private Consultation with the Anti Aging Expert",
                "1x Personalized IV Drip with vitamins & antioxidants to increase skin elasticity and improve general health",
                "1x Personalized Medi Facial according to your skin type and concern",
                "1x Advanced Full Body Anti Cellulite Care by Tegoder",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "7 Nights",
          groups: [
            {
              items: [
                "1x Private Consultation with the Anti Aging Expert",
                "1x Personalized Medi Facial according to your skin type and concern",
                "1x Personalized IV Drip with vitamins & antioxidants to increase skin elasticity and improve general health",
                "1x IPL Skin Rejuvenation for Face",
                "2x Carboxytherapy for Belly or Thigh to enhance the skin texture and elasticity",
                "1x Advanced Full Body Anti Cellulite Care by Tegoder",
                "1x Balinese Warm Spice Bath",
                "1x 90 minutes Lymphatic Drainage Massage",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "10 Nights",
          groups: [
            {
              items: [
                "1x Private Consultation with the Anti Aging Expert",
                "1x Personalized Medi Facial according to your skin type and concern",
                "1x Personalized IV Drip with vitamins & antioxidants to increase skin elasticity and improve general health",
                "1x Painless Mesotherapy containing hyaluronic acid, growth factors, vitamin, and peptide",
                "1x IPL Skin Rejuvenation for Face, Neck & Decolettage",
                "1x Non Invasive Skin Lifting with HIFU",
                "2x Carboxytherapy for Belly or Thigh to enhance the skin texture and elasticity",
                "1x Advanced Full Body Anti Cellulite Care by Tegoder",
                "1x Balinese Warm Spice Bath",
                "1x 90 minutes Lymphatic Drainage Massage",
                "1x Intensive Hair SPA treatment",
                "1x Private Yoga Session and private consultation with a Yoga Practitioner",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "14 Nights",
          groups: [
            {
              items: [
                "1x Private Consultation with the Anti Aging Expert",
                "1x Personalized Medi Facial according to your skin type and concern",
                "1x Personalized IV Drip with vitamins & antioxidants to increase skin elasticity and improve general health",
                "1x Painless Mesotherapy containing hyaluronic acid, growth factors, vitamin, and peptide",
                "1x IPL Skin Rejuvenation for Face, Neck & Decolettage",
                "1x Non Invasive Skin Lifting with HIFU",
                "4x CM Slim Muscle sculpting in one targeted area to build the muscle & burn the fat",
                "2x Carboxytherapy for Belly or Thigh to enhance the skin texture and elasticity",
                "1x Advanced Full Body Anti Cellulite Care by Tegoder",
                "1x Balinese Warm Spice Bath",
                "1x 90 minutes Lymphatic Drainage Massage",
                "1x Intensive Hair SPA treatment",
                "1x Private Yoga Session and private consultation with a Yoga Practitioner",
                "1x Relaxing Balinese Massage",
                "1x Exotic Flower Body Scrub",
                "1x Hydrating Milk Body Polish",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
      ],
    },
    faq: [],
    closingCta: "Begin your Anti Aging journey in Ubud, Bali",
    team: {
      heading: "Meet our Anti Aging's Team",
      members: [
        {
          name: "Doctor Irene",
          photo: `${U}2023/07/Dr-Irene-161-min-min-1.jpg`,
          bio: "Doctor Irene graduated from one of the most prestigious medical faculty in Indonesia, Airlangga University with the cum laude predicate. Her strong passion for anti-aging medicine drives her to pursue a master’s degree in anti-aging medicine. She believes that everyone has the right to be the best of themselves. For her, happiness is to help her patients feel more confident with their skin and body. Besides aesthetic medicine, she is also certified to give consultation and treatment in nutrition and nutrigenomics. She actively participates in the workshop nationally and internationally to keep her updated with the newest technology in Aesthetic & Anti Aging Medicine",
        },
        {
          name: "Lisa",
          // The live page's own `<img>` here is the shared yoga-pose shot, but
          // its CSS sets this newer portrait as a background the img covers —
          // an update that never made it onto the page. This is the photograph
          // the resort intended, confirmed with the client.
          photo: `${U}2024/08/Lisa-min-min-1.jpg`,
          bio: "Lisa, our dedicated Wellness Instructor, began her journey with a passion for yoga, fitness classes, and dancing. As she experienced remarkable improvements in her posture, she was inspired to pursue teacher training in Bali, becoming a certified yoga instructor. Her expertise extends beyond yoga to include access bars, meditation, and pilates, showcasing her commitment to a comprehensive wellness approach. Lisa's diverse skills and heartfelt dedication ensure that every guest enjoys a transformative and enriching wellness experience.",
        },
        {
          name: "Gusti",
          photo: `${U}2023/07/AW_06603-1-min.jpg`,
          bio: "Gusti is a native Balinese Yoga & Healing teacher. Born into a family where yoga is a daily ritual, yoga has always been a strong influence in his life since he was little. He is passionate about exploring the power of breath and its connection to each yoga pose and your overall well-being. He is also a breathwork teacher and initiator of healing and vinyasa breathwork who will guide your breath in a way that enables the transformational process to occur.",
        },
        {
          name: "Jane",
          photo: `${U}2023/06/AW_06626-min-1.webp`,
          bio: "From an early age, Jane was captivated by the power of sound and its ability to evoke emotions, and create harmony. While attending one of the yoga festivals, she stumbled upon a sound bath session and was attracted by the transformative power of the experience. Intrigued and inspired, she dug deeper into the world of sound healing by enrolling in courses and attending workshops. As the years went by, Jane’s journey as a sound therapist flourished. Her sessions have touched a lot of individuals, helping them find peace, reduce stress, and promote well-being through the power of sound. Becoming a sound therapist allows her to share her passion for music and sound while making a positive impact on the lives of others.",
        },
      ],
    },
    gallery: [
      `${U}2025/01/WFM03572-min-1.jpg`,
      `${U}2023/11/Untitled-design-4-min.jpg`,
      `${U}2023/05/AW_06640-min.jpg`,
    ],
    hero: `${U}2023/11/Untitled-design-5.jpg`,
  },
  {
    slug: "retreat/luxury/balinese-healing",
    group: "retreat",
    eyebrow: "Luxury Retreat",
    title: "Authentic Balinese Healing",
    paragraphs: [
      "Bali has long been known for its sacred healing tradition from ancient times that were passed down from generation to generation. Balinese people believe the principle of Sekala-Niskala that we live equally in two worlds, the seen called Sekala, and the unseen called Niskala. If you feel that bad luck keeps happening to you, it might be caused by dark energy that carried from a previous life. The timeless Balinese healing will help to dissolve the negative energy in the unseen world and purify your mind & soul. At Nyuh Bali, we offer you a rare opportunity to embrace the goodness of authentic Balinese healing, alongside nutritious meals, yoga, spa treatments, and personalized touch for life invigoration.",
    ],
    recommendedFor: [
      "Cleansing the negative energy",
      "Relieving muscle tension",
      "Restoring calm to the mind",
    ],
    note: "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    inclusions: [],
    programs: {
      heading: "Available Programs",
      tiers: [
        {
          name: "3 Nights",
          groups: [
            {
              items: [
                "Balinese Purification Ceremony with Balinese Local Priest",
                "1x Private Yoga session and yoga consultation with the Certified Instructor",
                "1x 90 mins Mahamaya Herbal Massage",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "5 Nights",
          groups: [
            {
              items: [
                "Balinese Purification Ceremony with Balinese Local Priest",
                "1x Private Yoga session and yoga consultation with the Certified Instructor",
                "1x 90 mins Mahamaya Herbal Massage",
                "1x Private Breathwork session with the Certified Instructor",
                "1x Energizing Herbal Bath",
                "1x Boreh Ritual Wrap",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "7 Nights",
          groups: [
            {
              items: [
                "Balinese Purification Ceremony with Balinese Local Priest",
                "1x Private Yoga session and yoga consultation with the Certified Instructor",
                "1x 90 mins Mahamaya Herbal Massage",
                "1x Private Breathwork session with the Certified Instructor",
                "1x Energizing Herbal Bath",
                "1x Boreh Ritual Wrap",
                "1x 60 mins Relaxing Balinese Massage",
                "Half-day Spiritual Tour (Gunung Kawi Temple, Mengening Temple, and Sudamala holy waterfall)",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "10 Nights",
          groups: [
            {
              items: [
                "Balinese Purification Ceremony with Balinese Local Priest",
                "2x Private Yoga sessions and yoga consultations with the Certified Instructor",
                "1x 90 mins Mahamaya Herbal Massage",
                "1x Private Breathwork session with the Certified Instructor",
                "1x Energizing Herbal Bath",
                "1x Boreh Ritual Wrap",
                "Half-day Spiritual Tour (Gunung Kawi Temple, Mengening Temple, and Sudamala holy waterfall)",
                "1x 60 mins Relaxing Balinese Massage",
                "1x 90 mins River stone massage",
                "A Visit to a Balinese Healer",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "14 Nights",
          groups: [
            {
              items: [
                "One-time Balinese Purification Ceremony with Balinese Local Priest",
                "Three Private Yoga sessions and yoga consultations with the Certified Instructor",
                "One time Private Breathwork session with the Certified Instructor",
                "One-time Private Mindfulness MeditationA Visit to a Balinese Healer and leisure tour to Tegalalang Rice Terrace",
                "A Half-day (5 hours) Spiritual Tour (Gunung Kawi Temple, Mengening Temple, and Sudamala holy waterfall)",
                "One-time Healthy Cooking Class",
                "One-time 90 mins Mahamaya Herbal Massage",
                "One-time 90 mins River stone massage",
                "Two times 60 mins Relaxing Balinese Massage",
                "One-time 30-minute Energizing Herbal Bath",
                "One time 30 minutes Boreh Ritual Wrap",
                "One time Authentic Hair Treatment",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
      ],
    },
    faq: [],
    gallery: [
      `${U}2023/04/Foto-09-11-20-16.49.06-2-min.jpg`,
    ],
    hero: `${U}2023/05/TD004090-min.webp`,
  },
  {
    slug: "retreat/luxury/holistic-balancing",
    group: "retreat",
    eyebrow: "Luxury Retreat",
    title: "Holistic Balancing Retreat",
    paragraphs: [
      "When was the last time you felt truly balanced? Do you always live in a fast-paced environment? This retreat aims to rebalance your body & mind from the stress of a modern lifestyle. During the retreat, you will experience a combination of destressing treatments like reiki healing, private sound healing, and shirodara treatment. Along with daily yoga practice, private yoga sessions, and whole nutritious foods to boost your immune system and happy hormones from the inside. Nyuh Bali integrated this balancing program, seamlessly into the holistic journey, making Ubud Nyuh Bali Resort one of the few to have embraced well-being in its entirety.",
      "Begin your balancing retreat journey at Ubud Nyuh Bali Resort to release the emotional blockage for a mindful life.",
    ],
    recommendedFor: [
      "Releasing emotional blockages",
      "Relieving stress",
      "Calming the nervous system",
    ],
    note: "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    inclusions: [],
    programs: {
      heading: "Available Programs",
      tiers: [
        {
          name: "3 Nights",
          groups: [
            {
              items: [
                "1x Reiki or Chakra Healing session",
                "1x Private Sound Calming Stress Therapy with the Certified Instructor",
                "1x 60 mins relaxing Balinese massage",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "5 Nights",
          groups: [
            {
              items: [
                "1x Reiki or Chakra Healing session",
                "1x Private Sound Calming Stress Therapy with the Certified Instructor",
                "1x Private Yoga session and yoga consultation with the Certified Instructor",
                "1x 60 mins Relaxing Balinese massage",
                "1x 90 mins Shirodara treatment",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "7 Nights",
          groups: [
            {
              items: [
                "1x Reiki or Chakra Healing session",
                "2x Private Sound Calming Stress Therapy with the Certified Instructor",
                "1x Private Yoga session and yoga consultation with the Certified Instructor",
                "1x 60 mins relaxing Balinese massage",
                "1x Traditional coconut body scrub & wrap",
                "One time Island frangipani milk bath",
                "1x 90 mins Shirodara treatment",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "10 Nights",
          groups: [
            {
              items: [
                "1x Reiki or Chakra Healing session",
                "2x Private Sound Calming Stress Therapy with the Certified Instructor",
                "1x Private Yoga session and yoga consultation with the Certified Instructor",
                "1x Private Emotional Support with Certified Psychologist",
                "1x 60 mins relaxing Balinese massage",
                "1x Traditional coconut body scrub & wrap",
                "1x 90 mins Shirodara treatment",
                "1x 90 mins Deep Tissue Massage",
                "One time Island frangipani milk bath",
                "1x Healthy Balinese cooking class",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "14 Nights",
          groups: [
            {
              items: [
                "Two times Reiki or Chakra Healing session",
                "Two Private Sound Calming Stress Therapy with the Certified Instructor",
                "Two times Private Yoga sessions and yoga consultations with the Certified Instructor",
                "One-time Private Emotional Support with a Certified Psychologist",
                "One-time Private Mindfulness Meditation",
                "One-time two hours stress recovery spa treatment",
                "One time 90 minutes Deep Tissue Massage",
                "One time 60 minutes relaxing Balinese massage",
                "One time 90 minutes Shirodara treatment",
                "One time Island frangipani milk bath",
                "One-time Traditional coconut body scrub & wrap",
                "One-time authentic hair treatment",
                "One-time Healthy Balinese cooking class",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
      ],
    },
    faq: [],
    gallery: [
      `${U}2023/03/Spa-ubud-slider-1.jpg`,
    ],
    hero: `${U}2023/05/AW_06640-min.jpg`,
  },
  {
    slug: "retreat/luxury/new-beginning",
    group: "retreat",
    eyebrow: "Luxury Retreat",
    title: "New Beginning",
    paragraphs: [
      "When life seems doesn't favor you, most people can't stop blaming themselves and end up feeling worthless. We carefully design the comprehensive retreat to reset through encouragement to boost your self-compassion. You will be guided by a certified psychologist in the intimate session to explore the past trauma and detach from what does not serve you anymore. Embrace the life change by transforming into a healthy lifestyle through a Balinese healthy cooking class. Experience a private yoga class to release the tension from your body, and celebrate the new beginning with a spa treatment and flower bath, so you can return home full of life and positive energy.",
      "Feel reinvigorated about life through a holistic approach to find fulfillment in your relationship with your inner self and others.",
    ],
    recommendedFor: [
      "Embracing life change",
      "Developing self-love and confidence",
      "Emotional support",
    ],
    note: "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    inclusions: [],
    programs: {
      heading: "Available Programs",
      tiers: [
        {
          name: "3 Nights",
          groups: [
            {
              items: [
                "1x Private emotional support with a certified psychologist",
                "1x Private Daily Yoga Session and yoga consultation with the certified instructor",
                "1x 60 mins relaxing Balinese massage",
                "One Flower Bath experience",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "5 Nights",
          groups: [
            {
              items: [
                "1x Private emotional support with a certified psychologist",
                "1x Private Daily Yoga Session and yoga consultation with the certified instructor",
                "1x Healthy Balinese cooking class",
                "1x 60 mins relaxing Balinese massage",
                "One Flower Bath experience",
                "1x Exotic flower body scrub",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "7 Nights",
          groups: [
            {
              items: [
                "1x Private emotional support with a certified psychologist",
                "1x Private Yoga Session and yoga consultation with the certified instructor",
                "1x Healthy Balinese cooking class",
                "1x 60 mins relaxing Balinese massage",
                "One Flower Bath experience",
                "1x Exotic flower body scrub",
                "1x 75 mins Personalized Medi Facial",
                "1x Traditional hair crème bath",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "10 Nights",
          groups: [
            {
              items: [
                "2x Private emotional support with a certified psychologist",
                "1x Private Daily Yoga Session and yoga consultation with the certified instructor",
                "1x Healthy balinese cooking class",
                "1x 60 mins relaxing Balinese massage",
                "One Flower Bath experience",
                "1x Exotic flower body scrub",
                "1x 75 mins Personalized Medi Facial",
                "1x Traditional hair crème bath",
                "1x Private Sound healing for Letting Go",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
        {
          name: "14 Nights",
          groups: [
            {
              items: [
                "Two Private emotional support with a certified psychologist",
                "Three times Private Yoga sessions and yoga consultations with the Certified Instructor",
                "1x 75 mins Personalized Medi Facial",
                "One-time Private Sound healing for Letting Go",
                "One-time Private Mindfulness Meditation",
                "One-time Healthy Balinese cooking class",
                "One-time 60 minutes relaxing Balinese massage",
                "One-time Flower Bath experience",
                "One-time 30-minute Exotic Flower body scrub",
                "One-time 75 minutes Traditional hair crème bath",
                "One-time Cleopatra's rose indulging spa ritual",
                "One-time Authentic hair cream bath",
                "One-time Floating breakfast experience",
              ],
            },
            ...RETREAT_STANDARD,
          ],
        },
      ],
    },
    faq: [],
    gallery: [
      `${U}2023/05/IS_06578-min.webp`,
    ],
    hero: `${U}2023/04/New-Beginning-1-min-1-1.jpg`,
  },
  {
    slug: "wellness/yoga",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Yoga Class",
    paragraphs: [
      "Gift yourself a relaxing yoga flow that will re-energize and wake up your entire body. Our yoga class is designed to be suitable for everyone from beginners to intermediate, no matter your fitness level. You will be guided step by step with our certified yoga teacher to do yoga pose in the correct alignment. And not only that, we also will help you to create a deeper connection between the breath and the movement.",
      "Breathe in and give yourself permission to let go of the things that no longer serve you and move closer to your own light. Come to practice with us every morning from 08.30 – 09.30 AM. (exclusively for our in-house guests).",
    ],
    // The two teachers are a "Meet our Teacher" block on the live page, with a
    // photograph each. They had been flattened into four anonymous paragraphs
    // and their portraits dropped into the gallery slider, so the page read as
    // bios with no faces — which is what the client flagged.
    team: {
      heading: "Meet our Teacher",
      members: [
        {
          name: "Jane Patricia",
          photo: `${U}2023/03/yoga-jane.webp`,
          bio: "Jane Patricia is an internationally certified yoga instructor who has completed courses of teacher training with a Registered Yoga School in India, Thailand, and Australia. She has achieved yoga teacher’s certification in Acro Yoga, Ashtanga and Vinyasa Flow, Aerial Yoga, Prenatal and Postnatal Yoga.\n\nHer approach to teaching derives from her belief that yoga is accessible to everyone, regardless of their fitness level. She is known for her hands-on approach, enthusiasm, and joy for the practice. Her personal style of teaching yoga draws attention to breathing, fun sequence, and, most importantly, safe alignment and adjustments that suit individual students. For her, yoga is not just about pushing yourself to the mostadvanced pose; it's about accepting where we are right now and allowing our body to improve naturally over time.",
        },
        {
          name: "Pebi",
          photo: `${U}2023/03/yoga-peby.webp`,
          bio: "Pebi was born and raised in Ubud, Bali. She started practicing yoga when she was 17 years old and instantly fell in love at the first try. For her, yoga is more than just an exercise, it is how to connect the breath with the body and find the harmony within. Since then, Pebi has completed 200 hours of Yoga Foundation Teacher Training and 50 hours of Yin & Hatha Yoga in 2018\n\nPebi offers the moment of pauses to reflect in gratitude while sharing her gentle and uplifting practice. Her main goal in every classes is to help her students to be more present and achieve inner peace by bringing the awareness back to body & mind through the each pose. Pebi continues to deepen her practice through sharing yoga with others. She believes that “My Teaching Is My Learning, My Learning Is My Teaching”",
        },
      ],
    },
    inclusions: [],
    faq: [
      { question: "What type of yoga is available?", answer: "Our yoga teacher could teach various tyle of yoga like hatha, vinyasa, ashtanga, restorative, and yin yoga. In general, the teacher will teach the hatha which includes moving the body into different yoga postures (seated, standing, and lying) to improve strength and flexibility with a breathing technique to help you relax. However, as the class is small and exclusive to our in-house guests, you could request the style of yoga you would like to practice. Please arrive a few minutes before the class starts to request a certain style." },
      { question: "What should I bring to class?", answer: "Just bring yourself. We provide the yoga mat and the necessary equipment like the yoga block and yoga straps." },
      { question: "What should I wear?", answer: "Whether you prefer loose or tight clothes, please wear comfortable ones that you can easily move and stretch." },
      { question: "Can I eat before the class?", answer: "Everyone is different when it comes to food and digestion. In general, we do not recommend eating a large meal at least two hours before the class." },
      { question: "I never do yoga before. I am not flexible either. Can I come?", answer: "Yes. Our class is also suitable for beginners without any experience before. Many people assume that they need to be flexible to practice yoga, in fact, yoga will help you become more flexible. Just come as you are." },
      { question: "I am interested to do private yoga. Can you arrange this?", answer: "Surely. Private yoga class is available at an additional charge. Please let us know a few days before." },
    ],
    // The live gallery, minus the two teacher portraits that now sit with
    // their bios. `ubud-yoga-2` is the indoor shala, which the live page shows
    // on Host Your Retreat instead.
    gallery: [
      `${U}2026/08/Nyuh-Bali-Ubud-24-1.jpg`,
      `${U}2023/03/ubud-yoga-3.webp`,
      `${U}2023/03/ubud-yoga-1.webp`,
      `${U}2023/03/ubud-yoga-4.webp`,
    ],
    hero: `${U}2023/03/ubud-yoga-1.webp`,
  },
  {
    slug: "wellness/sound-healing",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Sound Healing",
    paragraphs: [
      "Sound is known as one of the most natural forms of healing known to mankind and has long been realized to promote much deeper than just relaxation, like releasing emotional blockage, reducing stress, improving sleep, and inducing higher states of consciousness. The session will begin with a foot ritual followed by short consultation with our healing practitioner to understand your concern and deliver personalized therapy.. After that, simply lie down and close your eyes to receive the sounds in the private healing journey through the Tibetan singing bowl and various instruments. If you wish, our practitioner will place a singing bowl on your body for a deeper healing benefit.",
      "The public class will be held in our rooftop yoga shala on Thursday, Saturday, and Sunday from 17.00 - 18.00 exclusively for our in-house guests. For a more tailored experience, we suggest you to book the private session.",
      "Due to limited availability, we apologize that the Sound Healing is only exclusively available for our in-house guests. Please book one week in advance to retreat@ubudnyuhbali.com",
      "From an early age, Jane was captivated by the power of sound and its ability to evoke emotions, and create harmony. While attending one of the yoga festivals, she stumbled upon a sound bath session and was attracted by the transformative power of the experience. Intrigued and inspired, she dug deeper into the world of sound healing by enrolling in courses and attending workshops. As the years went by, Jane’s journey as a sound therapist flourished. Her sessions have touched a lot of individuals, helping them find peace, reduce stress, and promote well-being through the power of sound. Becoming a sound therapist allows her to share her passion for music and sound while making a positive impact on the lives of others.",
      "Ayu Indra, is a passionate sound healing and yoga practitioner. Since 2014, she has immersed herself in the study of yoga, learning from both Balinese & international teachers. Her training includes Hatha, Yin, and she holds a 200-hour Yoga Alliance certification, along with several specialized workshops in chakra practices. In addition to yoga, Ayu is trained in sound healing using singing bowls and gong therapy. She combines movement, breath, and sound to create holistic sessions that promote relaxation, inner balance, and energy alignment.",
    ],
    inclusions: ["Foot Ritual", "Consultation with Practitioner", "Sound Healing Session", "Ginger Tea with Lemongrass"],
    price: "Available at IDR 990.000++ for a private session",
    faq: [

    ],
    gallery: [
      `${U}2023/05/IS_07093-min-min.jpg`,
      `${U}2023/05/IS_07098-min.webp`,
      `${U}2023/05/IS_07108-min.webp`,
      `${U}2023/06/AW_06626-min-1.webp`,
      `${U}2025/07/IMG_3703-1.jpg`,
    ],
    hero: `${U}2023/05/AW_06640-min.webp`,
  },
  {
    slug: "wellness/breathwork",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Breathwork",
    paragraphs: [
      "How we breathe describes how we live. Breathwork exercise using various breathing techniques to relieve anxiety and reduce stress in your body. It also provides an opportunity for stored negative emotions to surface and be released as we exhale. It is also known as a more accessible alternative of meditation to achieve inner peace and better life quality. Available every Tueday & Friday as complimentary exclusively for our in-house guests.",
      "If you often feel anxiety, exhaustion, or insomnia, breathwork could be a self-soothing tool. Breathwork is believed to release toxins and stress when you breathe out and nourish your mind and body when you breathe in. With regular training, It also can strengthen your respiratory muscles and achieve slow breathing for a calm mind.",
      "If you have a chronic disease like cardiac arrhythmia, slow heart rate, angina or chest pain, a recent heart attack, heart disease, or any other heart condition – you should be cautious before beginning a breathwork practice. Please consult your medical doctor.",
      "The group class is available as a complimentary every Tuesday and Friday from 17.00-18.00 at our rooftop yoga shala.",
      "It is suitable if you would like to learn deeper and have a personalized consultation with the practitioner. During breathwork sessions, experienced practitioners guide you through breathing exercises designed to match your need to promote mindfulness and enhance your overall sense of well-being. With a focus on the breath, you'll be able to connect more deeply with your body and quiet your mind, allowing you to fully immerse yourself in the present moment.",
      "Due to limited availability, we apologize that the Breathwork is only exclusively available for our in-house guests. Please book one week in advance to retreat@ubudnyuhbali.com",
      "Gusti is a native Balinese Yoga & Healing teacher. Born into a family where yoga is a daily ritual, yoga has always been a strong influence in his life since he was little. He is passionate about exploring the power of breath and its connection to each yoga pose and your overall well-being. He is also a breathwork teacher and initiator of healing and vinyasa breathwork who will guide your breath in a way that enables the transformational process to occur.",
    ],
    inclusions: [],
    price: "Available at IDR 590.000++ for a private session",
    faq: [

    ],
    gallery: [
      `${U}2023/04/0D7555AC-09E4-4332-9619-08A9AA329530.webp`,
      `${U}2023/03/57DDDFFB-81D5-4107-BE9B-B53FCB0E0948.webp`,
      `${U}2023/03/B7F79CDA-6E8D-4756-B3B7-B26693E7EEDB.webp`,
      `${U}2023/07/AW_06603-1-min.jpg`,
    ],
    hero: `${U}2023/05/TD004090-min.webp`,
  },
  {
    slug: "wellness/body-tone-flow",
    group: "wellness",
    eyebrow: "Wellness",
    title: "BodyTone Flow",
    paragraphs: [
      "Experience an energizing workout that targets your entire body using your own body weight as the primary resistance. This dynamic Body Tone Flow class focuses on your arms, abs, booty, and legs, helping to enhance core strength, tone your body, and boost your confidence. Light dumbbells can also be incorporated to further challenge and sculpt your muscles. Each session concludes with a series of stretches to improve flexibility and aid recovery. Designed to be suitable for all fitness levels and gentle enough for holiday relaxation, this class is perfect for those looking for a balanced, not-too-hardcore workout. Join us for a group class, available weekly as a complimentary offering every Monday and Wednesday at our Rooftop Yoga Shala, exclusively for our in-house guests.",
    ],
    // Same "Meet our Teacher" block as the yoga page — Lisa's bio was an
    // anonymous paragraph and her portrait was the page's stray gallery image.
    team: {
      heading: "Meet our Teacher",
      members: [
        {
          name: "Lisa",
          photo: `${U}2024/08/Lisa-min-min-1.jpg`,
          bio: "Lisa, our dedicated Wellness Instructor, began her journey with a passion for yoga, fitness classes, and dancing. As she experienced remarkable improvements in her posture, she was inspired to pursue teacher training in Bali, becoming a certified yoga instructor. Her expertise extends beyond yoga to include access bars, meditation, and pilates, showcasing her commitment to a comprehensive wellness approach. Lisa's diverse skills and heartfelt dedication ensure that every guest enjoys a transformative and enriching wellness experience.",
        },
      ],
    },
    inclusions: [],
    faq: [

    ],
    gallery: [],
    hero: `${U}2023/05/AW_06579-min-2.webp`,
  },
  {
    slug: "wellness/life-coach",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Life Coach with Psychologist",
    paragraphs: [
      "If you want to improve yourself but don't know where to start",
      "Then this private life coach will be beneficial for you. Our certified psychologist will guide you through the intimate session to detach from what does not serve you anymore and live more mindfully afterward. To respect your privacy, the session will be held in your villa or room balcony or any place in our resort that your soul is comfortable with.",
      "Due to limited availability, we apologize that this counseling is only exclusively available for our in-house guests from May 2023. Please book one week in advance to retreat@ubudnyuhbali.com",
      "Jane M is a wellness coach with a passionate commitment to a way of a healthy lifestyle, mental health, and well-being. Having a Master’s degree in Social Psychology from a prestigious university in Indonesia help her to understand better about human behavior and social environment. She has been practicing yoga for more than 10 years and deepen her knowledge in Northern India to be certified as 500-h Yoga Alliance yoga teacher.",
    ],
    inclusions: [],
    price: "Available at IDR 1.690.000 ++ for private session",
    faq: [

    ],
    gallery: [
      `${U}2023/07/IS_06591-min.jpg`,
    ],
    hero: `${U}2023/05/IS_06578-min.webp`,
  },
  {
    slug: "wellness/reiki-healing",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Reiki Healing",
    paragraphs: [
      "Reiki treatment combines the Universal Life Force with the warmth and reassurance of the human touch. Reiki is not a massage, the practitioner will place the palm of her hands gently in the different position on your body. Reiki heals by flowing through the affected parts of the energy field and charging them with positive energy. It raises the vibratory level of the energy field in and around the physical body where the negative thoughts and feelings are attached. This causes the negative energy to break apart and fall away.",
      "If you often feel anxiety, overthinking, easily agitated, or even sadness, you will get benefit by having reiki healing. It is recommended for :",
      "This spiritual journey welcomes you with a foot ritual by soaking and massaging your foot with our spa therapist in a flower-filled bath. The practitioner then will meet you privately for spiritual consultation to know your problem and what things may hold you back. The practitioner will then place them gently and passively in different positions over or on your body which usually begins at the head. Usually, you will feel a pleasant warming heat on and inside the body area that is being treated. This deeply warming relaxation will enable energy blockages within the body to be released and this can show in many ways, such as a desire to continually swallow, cough or sneeze, a rumbling stomach or a gentle rush of energy down the legs. These are great indications that the treatment is working and should not cause any concern. Most people feel nothing during the treatment because they have fallen asleep, but they will wake-up feeling deeply relaxed and refreshed.",
      "Due to limited availability, we apologize that the Reiki Healing is only exclusively available for our in-house guests. Please book one week in advance to retreat@ubudnyuhbali.com",
      "Lia is a well-being facilitator who is keen on guiding others to transform themselves to become the healthier and more amazing people that they are meant to be. Lia has been practicing yoga since 2013, and it makes her realize that yoga is not just a workout, but it is a work-in. It brings her to learn more healing modalities such as reiki healing, sound healing, tapping therapy, and healing qi gong. She is certified as a reiki master by Asian Healing Arts Center, Thailand.",
    ],
    inclusions: ["Foot Ritual", "Reiki Healing", "Consultation with Practitioner", "Fresh Coconut Drink"],
    price: "Available at IDR 1.490.000++ for a private session",
    faq: [

    ],
    gallery: [
      `${U}2023/05/DW_02089-min.webp`,
      `${U}2023/05/IS_06972-min.webp`,
      `${U}2023/07/DW_02097-Copy-min.jpg`,
    ],
    hero: `${U}2023/05/IS_06972-min.webp`,
  },
  {
    slug: "wellness/chakra-healing",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Chakra Healing",
    paragraphs: [
      "Immerse yourself in a transformative healing experience at Ubud Nyuh Bali Resort with our Chakra Healing Therapy. This unique practice utilizes seven Tibetan singing bowls, each specifically attuned to one of the body’s primary chakras, to restore harmony and balance to your energy centers. The session is handled by an experienced practitioner, who skillfully plays the bowls to produce therapeutic sound vibrations that resonate with each chakra. These soothing frequencies help to release blockages, realign your energy flow, and promote deep relaxation. The therapy works to rejuvenate your physical, emotional, and spiritual well-being, leaving you with a renewed sense of balance and clarity.",
      "Due to limited availability, we apologize that the Chakra Healing is only exclusively available for our in-house guests. Please book one week in advance to retreat@ubudnyuhbali.com",
      "Gusti is a native Balinese Yoga & Healing teacher. Born into a family where yoga is a daily ritual, yoga has been a strong influence in his life since childhood. He is passionate about exploring the power of breath and its connection to each yoga pose and your overall well-being. As a breathwork teacher and initiator of healing and vinyasa breathwork, he guides your breath to enable transformational processes to occur. Additionally, Gusti is skilled in chakra healing, utilizing his expertise to help restore harmony and balance to your energy centers.",
    ],
    inclusions: ["Foot Ritual", "Chakra Healing", "Consultation with Practitioner", "Fresh Coconut Drink"],
    price: "Available at IDR 1.490.000++ for a private session",
    faq: [

    ],
    gallery: [
      `${U}2023/07/AW_06603-1-min.jpg`,
    ],
    hero: `${U}2025/01/1-min.jpg`,
  },
  {
    slug: "fitness",
    group: "wellness",
    eyebrow: "Wellness",
    title: "Free Access to Our Home Gym",
    paragraphs: [
      "Here at Nyuh Bali, we understand your regular workout cannot be put on standby just because you are away from home. We have created a home gym to keep you in shape during the holiday. Enjoy complimentary unlimited access to our fitness center that features a spectrum of weight and state of the art machinery such as treadmill, multi gym station, cross trainer, exercise bike, abs training bench, pilates ball, yoga matt and also some weights. Providing things you could need, our home gym is completed with mineral water, and towel.",
    ],
    inclusions: [],
    faq: [

    ],
    gallery: [
      `${U}2024/12/DW_03493-min-2.jpg`,
      `${U}2024/12/DW_03583-min-min.jpg`,
      `${U}2024/12/DW_03555-min.jpg`,
    ],
    hero: `${U}2024/12/DW_03575-min-min.jpg`,
  },
  {
    slug: "balinese-culture/balinese-class",
    group: "culture",
    eyebrow: "Culture",
    title: "Daily Authentic Balinese Class",
    paragraphs: [
      "Instead of just giving information in the picture, nyuh bali presents a wealth of activities that reflect the heritage traditions of a Balinese village. We invite you to experience how becoming a Balinese.",
      "Discover how to make the canang sari, daily offering that made from young coconut leaves, and flowers. The handmade offerings are a sacred form of gratitude for what is and a wish for peace in the world. We praise to the God, Sang Hyang Widhi Wasa through this offering in every morning, surely you also can join with us.",
      "If you wonder how to make Balinese seasoning, we are more than happy to share the secret. Some boiled potatoes are provided so that you can taste the result of your own creation directly",
      "We invite you to enjoy a complimentary Balinese herbal drink and take part in learning how it is traditionally made. Using natural local herbs and spices, this refreshing beverage is deeply rooted in Balinese wellness traditions and is known for its calming and revitalizing properties. This experience offers you a chance to connect with Balinese culture, understand the benefits of traditional herbal ingredients, and bring home a simple yet meaningful local practice from your time in Bali.",
      "All classes are complimentary. Please ask your butler for the class’s schedule",
    ],
    inclusions: [],
    faq: [

    ],
    gallery: [
      `${U}2023/05/IS_06654-min.webp`,
      `${U}2023/05/IS_06776-min.webp`,
      `${U}2023/05/IS_06754-min-1.webp`,
    ],
    hero: `${U}2023/03/ezgif.com-gif-maker-14.webp`,
  },
  {
    slug: "balinese-culture/cooking-class",
    group: "culture",
    eyebrow: "Culture",
    title: "Market Tour and Private Balinese Cooking Lesson",
    paragraphs: [
      "Although it seems that Balinese cooking is complicated, in fact, it is not true, if you know the types of herbs you are going to use in the cooking and how to use them. This learning adventure involves a visit to the local market, where our chef will share some information how to select the fresh ingredients you will need for cooking Balinese. You will be guided step by step to transform the ingredients into delicious Balinese food.",
      "Balinese salad of steamed vegetables mixed with spiced grated coconut",
      "Tofu, mushroom, Balinese yellow spices cooked using banana leaf wrapping",
      "Get ready to surprise your friends by your ability in cooking Balinese. A certificate will be awarded to you at the end of the class. The class is also followed by a relaxing lunch eating your very own creations",
      "Available at IDR 1.500.000 ++ for up to 2 people in private session.",
      "Inclusions : A visit to to the local market, welcome drink, cooking class, dining with your own creation, certificate, and our signature recipe",
    ],
    inclusions: [],
    price: "Available at IDR 1.500.000 ++ for up to 2 people in private session.",
    faq: [

    ],
    gallery: [
      `${U}2023/03/cooking-class.webp`,
      `${U}2023/05/Cooking-Class.webp`,
    ],
    hero: `${U}2023/03/cooking-class.webp`,
  },
  {
    slug: "balinese-culture/melukat-purification-ceremony",
    group: "culture",
    eyebrow: "Culture",
    title: "Melukat – Balinese Purification Ceremony",
    paragraphs: [
      "Derived from lukat, which means purify, Melukat aims to refine the mind inside human body from the bad elements. This ceremony is mostly held after bad things happened to someone, like they got sick, had been in an accident, or merely feel restless. Balinese do believe the power of water, which is a crucial element in Balinese ceremony either as a blessing or as cleansing our negative energy.",
      "Melukat will be held in Sebatu or Tirta Empul Holy Spring Temple. During the ritual, the priest will recite a lot of Balinese prayers but don’t worry; you will not get lost in translation as a butler will be at your side. He will explain to you the meaning of each step of the ritual as well as guide you throughout the ceremony. At the end of the ceremony, the Pemangku will tie a bracelet made of tricolor string called a benang tridatu around your wrist. It is believed that this string will protect one from bad energy as you are under the constant protection of the Gods. Don’t take off the bracelet, just wear it until it falls off your wrist on its own.",
      "Due to limited availability, we apologize that the Balinese Purification Ceremony is only exclusively available for our in-house guests",
    ],
    inclusions: ["Private butler guide", "Private Air Conditioned Car including Petrol", "The offering", "Balinese temple attire", "Local priest fees", "Entrance donation", "Sightseeing tour to Tegalalang", "Mineral water, cool towel, and fruit skewer The price is at IDR 1.500.000 ++ for two persons"],
    price: "- Mineral water, cool towel, and fruit skewer The price is at IDR 1.500.000 ++ for two persons",
    faq: [

    ],
    gallery: [
      `${U}2023/03/melukat-1.webp`,
      `${U}2023/03/Melukat-2.webp`,
    ],
    hero: `${U}2023/03/melukat-1.webp`,
  },
  {
    slug: "balinese-culture/rice-field-walk",
    group: "culture",
    eyebrow: "Culture",
    title: "Complimentary Rice Paddies Walk",
    paragraphs: [
      "“ An early morning walk is a blessing for the whole day ”-Henry David Thoreau",
      "Start your awesome day by morning walking to the silungan village; it will be a good exercise and worth experience. You can inhale pure oxygen, enjoy rice field view and many of coconut (nyuh) trees. We invite you to see the other side of Bali, how locals live from your own perspective. You will learn and observe how rice is made as most of the farmer still do traditional ways in farming. For your comfort, we recommend you to wear anti-slip shoes because there are plenty of muddy paths",
    ],
    inclusions: [],
    faq: [

    ],
    gallery: [
      `${U}2023/03/ubud-walk-2.webp`,
      `${U}2023/03/ubud-walk-3.webp`,
      `${U}2023/03/ubud-walk-1.webp`,
    ],
    hero: `${U}2023/03/ubud-walk-1.webp`,
  },
];
