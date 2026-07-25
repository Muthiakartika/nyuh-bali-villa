// Detail content for the retreat programmes, wellness classes and cultural
// activities — 18 WordPress pages that sit one level below the navigation.
//
// GENERATED from the live site, then reviewed by hand. Files that consume this:
//   src/app/ubud/[...experience]/page.tsx
//   src/components/property/ExperienceDetail.tsx

const U = "https://nyuhbalivillas.com/wp-content/uploads/";

export type Experience = {
  /** Path under /ubud/ — e.g. "wellness/yoga". */
  slug: string;
  group: "retreat" | "wellness" | "culture";
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** The live "Inclusions" bullet list, where the page has one. */
  inclusions: string[];
  /** Price line, verbatim, where the page states one. */
  price?: string;
  faq: { question: string; answer: string }[];
  gallery: string[];
  hero: string;
};

export const EXPERIENCES: Experience[] = [
  {
    slug: "retreat/couples",
    group: "retreat",
    eyebrow: "Retreat",
    title: "Couple's Retreat",
    paragraphs: [
      "Rediscover love and connection with the Couples Retreat at Ubud Nyuh Bali Resort. Indulge in romantic candlelight dinners, soothing couple massages, and picturesque floating breakfasts in your private villa pool. Immerse yourselves in the beauty of Bali with yoga, Balinese cultural experiences, and serene walks through lush rice fields. Every moment is designed to deepen your bond and create memories to treasure forever.",
      "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    ],
    inclusions: ["Starting healthy life style together with your love", "Strengthening the relationship", "1 x Private Couple Yoga to strengthen the relationship", "1x Healthy Balinese Cooking Class", "Romantic set up upon arrival", "1x 60 mins Relaxing Balinese massage for two", "Welcome meeting with Our Retreat Specialist to introduce the program", "Round trip airport transfer", "Daily gourmet healthy cuisine for lunch or dinner", "Daily Elixir", "Signature gift from Nyuh Bali", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality Complimentary", "Daily breakfast", "Daily afternoon tea", "Daily Morning Walk to the Rice Field", "Daily Morning Yoga", "Free bicycle rental and access to our home gym", "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making", "Daily wellness activities like sound healing, pilates, meditation, and breathwork", "1x Private Couple Yoga to strengthen the relationship", "Romantic flower bath experience", "1x Romantic Candle light Dinner featuring healthy gourmet cuisine", "2x Private Couple Yoga to strengthen the relationship", "1x Romantic Candlelight Dinner featuring healthy gourmet cuisine", "1x 60 mins Traditional coconut body scrub and wrap for two", "1x90 mins River stone massage", "Balinese Blessing at resort temple included Balinese Custome Rental", "1x Photography session with 5 digital photos", "Three Private Couple Yoga sessions to strengthen the relationship", "One time Private sound healing treatment", "One time Healthy Balinese Cooking Class", "Balinese Purification Ceremony", "Romantic decoration upon arrival", "One time Romantic Candlelight Dinner featuring healthy gourmet cuisine for couple", "One time Romantic flower bath to share", "One time 60 minutes Relaxing Balinese massage for a couple", "One time 30 min Traditional coconut body scrub and 30 min body wrap for couple", "One time 90 minutes River stone massage for couple", "One time 90 mins deep tissue massage", "One time Milk body polish with scalp massage", "One time Authentic Hair Creambath", "One time Photography session included 5 digital photos and Balinese Custome Rental"],
    faq: [

    ],
    gallery: [
      `${U}2023/03/ubud-yoga-3.webp`,
      `${U}2023/04/Foto-09-11-20-16.49.06-2-Copy-min-1.jpg`,
      `${U}2023/03/Spa-ubud-slider-1.jpg`,
      `${U}2023/04/New-Beginning-1-min-1.jpg`,
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
      "No fake science, no hoax, only the best approach according to the science",
      "A combination of nutrition, exercise, advanced technology, and stress reliever sessions for suistanable weight loss",
      "Personalized initial consultation & follow-up with Certified Anti Aging Doctor",
      "Featured CM Slim to supplement your weight loss journey in a safe way.",
      "We tailor our food to individual dietary, such as vegetarian, vegan & gluten-free",
      "All of our retreats include essential elements & Nyuh's signature touch",
      "We’re committed to designing our retreat with the scientific-based modality instead of adopting the popular treatment. Despite colon cleansing’s popularity, science does not support its purported benefits. In fact, colon cleansing may do more harm than good. Colon cleansing has no proven benefits and many adverse effects. Side effects of colon cleansing include nausea, vomiting, diarrhea, dizziness, dehydration, electrolyte abnormalities, acute kidney insufficiency, pancreatitis, bowel perforation, heart failure, and infection. Please read this scientific publication for further reading.",
      "As our main goal is promoting general health, we design our program to be aligned with scientific-based and WHO recommendations. The current guideline encourages to lose weight 0,5-1 kg per week for a healthy and suistanable journey. Rapid weight loss could put you at risk of many health problems and weight regain.",
      "CM slim is non-invasive and completely safe treatment with no downtime. In the small percentage, some sensitive individual can experience redness on the targeted area that will resolve within 4 up to 24 hours. CM slim are used in the world wide and has received CE certification as safe and effective device.",
      "Refit is a painless, non invasive and relaxing treatment to tighten the body & reduce the appearance of cellulite. The Refit also implements Safe Anti-Spark (SAS) technology to provide the enhance the safety. In susceptible individuals, bruising could happen, but the symptom will resolve within few days.",
      "The retreat is designed for adults in the general population with no or mild health issues like mild dyslipidemia, first-degree obesity, and overweight. If you’re severely obese (BMI&gt;= 40), we strongly suggest you consult with your doctor in your country before joining our retreat. Anyone with pacemaker, heart disease, stroke, uncontrolled diabetes, and other serious illness are not recommended to join the retreat.",
      "Doctor Irene graduated from one of the most prestigious medical faculty in Indonesia, Airlangga University with the cum laude predicate. Her strong passion for anti-aging medicine drives her to pursue a master’s degree in anti-aging medicine. She believes that everyone has the right to be the best of themselves. For her, happiness is to help her patients feel more confident with their skin and body. Besides aesthetic medicine, she is also certified to give consultation and treatment in nutrition and nutrigenomics. She actively participates in the workshop nationally and internationally to keep her updated with the newest technology in Aesthetic & Anti Aging Medicine",
      "Lina took her first yoga class to find the balance between her long working hours as a midwife and relaxation. After more than 5 years of working as a midwife, Lina decided to follow her passion to become a professional wellness teacher. Since then, Lina has completed 200hr Yoga Teacher, then continued her wellness education through various workshops in Yin Yoga, Fly High Yoga, Aerial Yoga, and Pilates. As a former midwife, Lina has a deep knowledge of body anatomy and physiology that support her in teaching safe movement practice to her students.",
      "Gusti is a native Balinese Yoga & Healing teacher. Born into a family where yoga is a daily ritual, yoga has always been a strong influence in his life since he was little. He is passionate about exploring the power of breath and its connection to each yoga pose and your overall well-being. He is also a breathwork teacher and initiator of healing and vinyasa breathwork who will guide your breath in a way that enables the transformational process to occur.",
      "From an early age, Jane was captivated by the power of sound and its ability to evoke emotions, and create harmony. While attending one of the yoga festivals, she stumbled upon a sound bath session and was attracted by the transformative power of the experience. Intrigued and inspired, she dug deeper into the world of sound healing by enrolling in courses and attending workshops. As the years went by, Jane’s journey as a sound therapist flourished. Her sessions have touched a lot of individuals, helping them find peace, reduce stress, and promote well-being through the power of sound. Becoming a sound therapist allows her to share her passion for music and sound while making a positive impact on the lives of others.",
    ],
    inclusions: ["Accommodation", "Welcome meeting with Our Retreat Specialist to introduce the program", "Round-trip airport transfer", "Pre-arrival questionnaire to design personalized program (optional)", "A gift to bring home and a personalized take-home message", "Daily Morning Walk to the Rice Field", "Free bicycle rental and access to our home gym", "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making", "Initial consultation and post-program follow-up with the certified anti-aging doctor", "3x CE-Certified Muscle Sculpting on one targeted area to build the muscle", "1x Carboxytherapy on one targeted area to improve the skin elasticity", "Holistic assessment in the beginning to determine the personalized program tailored to your need", "Initial and Post-Program Body Composition Analysis Structured Training & Stretching", "2x personal training sessions offer a tailored combination of cardio, strength training, and mobility to inspire you with a renewed exercise to practice at home", "2 pilates sessions in a group", "7 hatha yoga in a group Treatment & SPA", "1x 60 mins Lymphatic drainage massage", "1x 60 mins Relaxing Balinese Massage  Nutritious Meal", "3 daily nutritionally dense meals designed for optimal fat burning", "Daily elixir and Juice", "Daily Afternoon Tea", "Unlimited Mineral Water Mindfulness", "2 sound healing sessions in a group", "2 breathwork sessions in a group", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality", "Scientific Approach", "Initial consultation, mid-follow-up, and post-program follow-up with the certified anti-aging doctor", "6x CE-Certified Muscle Sculpting on one targeted area to build the muscle", "2x Carboxytherapy on one targeted area to improve the skin elasticity", "1 x One Month Supply of Weight Management Supplement", "4x personal training sessions offer a tailored combination of cardio, strength training, and mobility to inspire you with a renewed exercise to practice at home", "4 pilates sessions in a group", "14 hatha yoga in a group Treatment & SPA", "2x 60 mins Lymphatic drainage massage", "1x 90 mins Signature Bamboo drainage massage", "1x 60 mins Relaxing Balinese Massage", "1x Authentic Hair Creambath  Nutritious Meal", "3 daily nutritionally dense meals designed for optimal fat-burning", "Daily Elixir and Juice", "4 sound healing sessions in a group", "4 breathwork sessions in a group", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality Nyuh Bali’s Touch", "Gift to bring home and personalized take-home message", "If you have a pacemaker, internal debrillator or other implanted electrical devices, metal stents/ implants in your body", "Pregnant woman is not suggested", "Open or infected wounds", "Active systemic or local skin diseases", "Hypotension", "Grade II hypertension"],
    faq: [

    ],
    gallery: [
      `${U}2023/05/TD004090-min.webp`,
      `${U}2023/07/Dr-Irene-161-min-min-1.jpg`,
      `${U}2023/07/AW_06579-Copy-min.jpg`,
      `${U}2023/07/AW_06603-1-min.jpg`,
      `${U}2023/06/AW_06626-min-1.webp`,
    ],
    hero: `${U}2023/07/The-First-and-Only-Holistic-Scientifically-Based-Retreat-in-Bali-1-min-1.jpg`,
  },
  {
    slug: "retreat/luxury/anti-aging",
    group: "retreat",
    eyebrow: "Luxury Retreat",
    title: "Luxury Anti Aging Retreat in Ubud Bali",
    paragraphs: [
      "Your retreat begins with an initial consultation with our anti-aging expert, who will assess your skin concerns and evaluate your diet and lifestyle. Using advanced technology, we conduct an in-depth analysis to create a personalized treatment plan. Depending on your length of stay, your rejuvenation journey may include medi-facials, IPL, IV infusions, non-surgical skin lifting, CM Slim muscle sculpting, and carboxytherapy. These treatments work together to deeply cleanse and purify the skin’s surface, stimulate collagen regeneration in the deeper layers, sculpt and tone muscles, and improve skin elasticity—revealing a radiant, healthier glow.",
      "Sound therapies like singing bowl and mindfulness practices like breathwork have been widely known to reduce stress and inflammation in our body that leads to premature aging. During the retreat, you will be guided by mindfulness experts through sound healing and breathwork sessions to let go of things that no longer serve you, to look at yourself in a new light, and to appreciate your own body and beauty.",
      "We partner with Healthy Look Aesthetic for science-backed treatments, ensuring only the best care.",
      "A combination of nutrition, exercise, advanced technology, and stress reliever sessions for suistanable weight loss",
      "Personalized initial consultation with Anti Aging Expert. Anti aging treatment will be done by Doctor and Certified Nurse",
      "Featuring HIFU, CM Slim, IPL, and medical facials for effective anti-aging solutions.",
      "We tailor our food to individual dietary, such as vegetarian, vegan & gluten-free",
      "Doctor Irene graduated from one of the most prestigious medical faculty in Indonesia, Airlangga University with the cum laude predicate. Her strong passion for anti-aging medicine drives her to pursue a master’s degree in anti-aging medicine. She believes that everyone has the right to be the best of themselves. For her, happiness is to help her patients feel more confident with their skin and body. Besides aesthetic medicine, she is also certified to give consultation and treatment in nutrition and nutrigenomics. She actively participates in the workshop nationally and internationally to keep her updated with the newest technology in Aesthetic & Anti Aging Medicine",
      "Lisa, our dedicated Wellness Instructor, began her journey with a passion for yoga, fitness classes, and dancing. As she experienced remarkable improvements in her posture, she was inspired to pursue teacher training in Bali, becoming a certified yoga instructor. Her expertise extends beyond yoga to include access bars, meditation, and pilates, showcasing her commitment to a comprehensive wellness approach. Lisa's diverse skills and heartfelt dedication ensure that every guest enjoys a transformative and enriching wellness experience.",
      "Gusti is a native Balinese Yoga & Healing teacher. Born into a family where yoga is a daily ritual, yoga has always been a strong influence in his life since he was little. He is passionate about exploring the power of breath and its connection to each yoga pose and your overall well-being. He is also a breathwork teacher and initiator of healing and vinyasa breathwork who will guide your breath in a way that enables the transformational process to occur.",
      "From an early age, Jane was captivated by the power of sound and its ability to evoke emotions, and create harmony. While attending one of the yoga festivals, she stumbled upon a sound bath session and was attracted by the transformative power of the experience. Intrigued and inspired, she dug deeper into the world of sound healing by enrolling in courses and attending workshops. As the years went by, Jane’s journey as a sound therapist flourished. Her sessions have touched a lot of individuals, helping them find peace, reduce stress, and promote well-being through the power of sound. Becoming a sound therapist allows her to share her passion for music and sound while making a positive impact on the lives of others.",
    ],
    inclusions: ["1x Private Consultation with the Anti Aging Expert", "1x Personalized IV Drip with vitamins & antioxidants to increase skin elasticity and improve general health", "1x Personalized Medi Facial according to your skin type and concern", "1x Advanced Full Body Anti Cellulite Care by Tegoder", "Welcome meeting with Our Retreat Specialist to introduce the program", "Round trip airport transfer", "Daily gourmet healthy cuisine for lunch or dinner", "Daily Elixir", "Signature gift from Nyuh Bali", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality Complimentary", "Daily breakfast", "Daily afternoon tea", "Daily Morning Walk to the Rice Field", "Daily Morning Yoga", "Free bicycle rental and access to our home gym", "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making", "Daily wellness activities like sound healing, pilates, meditation, and breathwork", "1x IPL Skin Rejuvenation for Face", "2x Carboxytherapy for Belly or Thigh to enhance the skin texture and elasticity", "1x Balinese Warm Spice Bath", "1x 90 minutes Lymphatic Drainage Massage", "1x Painless Mesotherapy containing hyaluronic acid, growth factors, vitamin, and peptide", "1x IPL Skin Rejuvenation for Face, Neck & Decolettage", "1x Non Invasive Skin Lifting with HIFU", "1x Intensive Hair SPA treatment", "1x Private Yoga Session and private consultation with a Yoga Practitioner", "4x CM Slim Muscle sculpting in one targeted area to build the muscle & burn the fat", "1x Relaxing Balinese Massage", "1x Exotic Flower Body Scrub", "1x Hydrating Milk Body Polish"],
    faq: [

    ],
    gallery: [
      `${U}2025/01/WFM03572-min-1.jpg`,
      `${U}2023/11/Untitled-design-4-min.jpg`,
      `${U}2023/05/AW_06640-min.jpg`,
      `${U}2023/07/Dr-Irene-161-min-min-1.jpg`,
      `${U}2023/07/AW_06579-Copy-min.jpg`,
      `${U}2023/07/AW_06603-1-min.jpg`,
      `${U}2023/06/AW_06626-min-1.webp`,
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
      "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    ],
    inclusions: ["Cleansing the negative energy", "Relieving muscle tension", "Restoring calm to the mind", "Balinese Purification Ceremony with Balinese Local Priest", "1x Private Yoga session and yoga consultation with the Certified Instructor", "1x 90 mins Mahamaya Herbal Massage", "Welcome meeting with Our Retreat Specialist to introduce the program", "Round trip airport transfer", "Daily gourmet healthy cuisine for lunch or dinner", "Daily Elixir", "Signature gift from Nyuh Bali", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality Complimentary", "Daily breakfast", "Daily afternoon tea", "Daily Morning Walk to the Rice Field", "Daily Morning Yoga", "Free bicycle rental and access to our home gym", "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making", "Daily wellness activities like sound healing, pilates, meditation, and breathwork", "1x Private Breathwork session with the Certified Instructor", "1x Energizing Herbal Bath", "1x Boreh Ritual Wrap", "1x 60 mins Relaxing Balinese Massage", "Half-day Spiritual Tour (Gunung Kawi Temple, Mengening Temple, and Sudamala holy waterfall)", "2x Private Yoga sessions and yoga consultations with the Certified Instructor", "1x 90 mins River stone massage", "A Visit to a Balinese Healer", "One-time Balinese Purification Ceremony with Balinese Local Priest", "Three Private Yoga sessions and yoga consultations with the Certified Instructor", "One time Private Breathwork session with the Certified Instructor", "One-time Private Mindfulness MeditationA Visit to a Balinese Healer and leisure tour to Tegalalang Rice Terrace", "A Half-day (5 hours) Spiritual Tour (Gunung Kawi Temple, Mengening Temple, and Sudamala holy waterfall)", "One-time Healthy Cooking Class", "One-time 90 mins Mahamaya Herbal Massage", "One-time 90 mins River stone massage", "Two times 60 mins Relaxing Balinese Massage", "One-time 30-minute Energizing Herbal Bath", "One time 30 minutes Boreh Ritual Wrap", "One time Authentic Hair Treatment"],
    faq: [

    ],
    gallery: [
      `${U}2023/05/TD004090-min.webp`,
      `${U}2023/04/Foto-09-11-20-16.49.06-2-min.jpg`,
      `${U}2023/03/ubudspa.webp`,
      `${U}2023/04/New-Beginning-1-min-1.jpg`,
      `${U}2023/03/ubud-yoga-4.webp`,
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
      "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    ],
    inclusions: ["Releasing emotional blockages", "Relieving stress", "Calming the nervous system", "1x Reiki or Chakra Healing session", "1x Private Sound Calming Stress Therapy with the Certified Instructor", "1x 60 mins relaxing Balinese massage", "Welcome meeting with Our Retreat Specialist to introduce the program", "Round trip airport transfer", "Daily gourmet healthy cuisine for lunch or dinner", "Daily Elixir", "Signature gift from Nyuh Bali", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality Complimentary", "Daily breakfast", "Daily afternoon tea", "Daily Morning Walk to the Rice Field", "Daily Morning Yoga", "Free bicycle rental and access to our home gym", "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making", "Daily wellness activities like sound healing, pilates, meditation, and breathwork", "1x Private Yoga session and yoga consultation with the Certified Instructor", "1x 60 mins Relaxing Balinese massage", "1x 90 mins Shirodara treatment", "2x Private Sound Calming Stress Therapy with the Certified Instructor", "1x Traditional coconut body scrub & wrap", "One time Island frangipani milk bath", "1x Private Emotional Support with Certified Psychologist", "1x 90 mins Deep Tissue Massage", "1x Healthy Balinese cooking class", "Two times Reiki or Chakra Healing session", "Two Private Sound Calming Stress Therapy with the Certified Instructor", "Two times Private Yoga sessions and yoga consultations with the Certified Instructor", "One-time Private Emotional Support with a Certified Psychologist", "One-time Private Mindfulness Meditation", "One-time two hours stress recovery spa treatment", "One time 90 minutes Deep Tissue Massage", "One time 60 minutes relaxing Balinese massage", "One time 90 minutes Shirodara treatment", "One-time Traditional coconut body scrub & wrap", "One-time authentic hair treatment", "One-time Healthy Balinese cooking class"],
    faq: [

    ],
    gallery: [
      `${U}2023/03/Spa-ubud-slider-1.jpg`,
      `${U}2023/04/Foto-09-11-20-16.49.06-2-Copy-min-1.jpg`,
      `${U}2023/04/New-Beginning-1-min-1.jpg`,
      `${U}2023/03/ubud-yoga-4.webp`,
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
      "The retreat is not one-size-fits-all, and each is personalized to gain all of the deep benefits of each unique healing modality. Your retreat will also differ depending on your length of stay, how deep you wish to go, and the level of independence or support you feel you need. Longer retreats bring deeper transformation.",
    ],
    inclusions: ["Embracing life change", "Developing self-love and confidence", "Emotional support", "1x Private emotional support with a certified psychologist", "1x Private Daily Yoga Session and yoga consultation with the certified instructor", "1x 60 mins relaxing Balinese massage", "One Flower Bath experience", "Welcome meeting with Our Retreat Specialist to introduce the program", "Round trip airport transfer", "Daily gourmet healthy cuisine for lunch or dinner", "Daily Elixir", "Signature gift from Nyuh Bali", "Nyuh Bali’s signature sleeping ritual to enhance your sleep quality Complimentary", "Daily breakfast", "Daily afternoon tea", "Daily Morning Walk to the Rice Field", "Daily Morning Yoga", "Free bicycle rental and access to our home gym", "Daily authentic Balinese activities like Balinese gratitude ceremony, learning to make Balinese seasoning and Balinese boreh class making", "Daily wellness activities like sound healing, pilates, meditation, and breathwork", "1x Healthy Balinese cooking class", "1x Exotic flower body scrub", "1x Private Yoga Session and yoga consultation with the certified instructor", "1x 75 mins Personalized Medi Facial", "1x Traditional hair crème bath", "2x Private emotional support with a certified psychologist", "1x Healthy balinese cooking class", "1x Private Sound healing for Letting Go", "Two Private emotional support with a certified psychologist", "Three times Private Yoga sessions and yoga consultations with the Certified Instructor", "One-time Private Sound healing for Letting Go", "One-time Private Mindfulness Meditation", "One-time Healthy Balinese cooking class", "One-time 60 minutes relaxing Balinese massage", "One-time Flower Bath experience", "One-time 30-minute Exotic Flower body scrub", "One-time 75 minutes Traditional hair crème bath", "One-time Cleopatra's rose indulging spa ritual", "One-time Authentic hair cream bath", "One-time Floating breakfast experience"],
    faq: [

    ],
    gallery: [
      `${U}2023/05/IS_06578-min.webp`,
      `${U}2023/04/Foto-09-11-20-16.49.06-2-Copy-min-1.jpg`,
      `${U}2023/03/Spa-ubud-slider-1.jpg`,
      `${U}2023/02/yoga-4.jpg`,
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
      "Jane Patricia is an internationally certified yoga instructor who has completed courses of teacher training with a Registered Yoga School in India, Thailand, and Australia. She has achieved yoga teacher’s certification in Acro Yoga, Ashtanga and Vinyasa Flow, Aerial Yoga, Prenatal and Postnatal Yoga.",
      "Her approach to teaching derives from her belief that yoga is accessible to everyone, regardless of their fitness level. She is known for her hands-on approach, enthusiasm, and joy for the practice. Her personal style of teaching yoga draws attention to breathing, fun sequence, and, most importantly, safe alignment and adjustments that suit individual students. For her, yoga is not just about pushing yourself to the mostadvanced pose; it's about accepting where we are right now and allowing our body to improve naturally over time.",
      "Pebi was born and raised in Ubud, Bali. She started practicing yoga when she was 17 years old and instantly fell in love at the first try. For her, yoga is more than just an exercise, it is how to connect the breath with the body and find the harmony within. Since then, Pebi has completed 200 hours of Yoga Foundation Teacher Training and 50 hours of Yin & Hatha Yoga in 2018",
      "Pebi offers the moment of pauses to reflect in gratitude while sharing her gentle and uplifting practice. Her main goal in every classes is to help her students to be more present and achieve inner peace by bringing the awareness back to body & mind through the each pose. Pebi continues to deepen her practice through sharing yoga with others. She believes that “My Teaching Is My Learning, My Learning Is My Teaching”",
    ],
    inclusions: [],
    faq: [
      { question: "What type of yoga is available?", answer: "Our yoga teacher could teach various tyle of yoga like hatha, vinyasa, ashtanga, restorative, and yin yoga. In general, the teacher will teach the hatha which includes moving the body into different yoga postures (seated, standing, and lying) to improve strength and flexibility with a breathing technique to help you relax. However, as the class is small and exclusive to our in-house guests, you could request the style of yoga you would like to practice. Please arrive a few minutes before the class starts to request a certain style." },
      { question: "What should I bring to class?", answer: "Just bring yourself. We provide the yoga mat and the necessary equipment like the yoga block and yoga straps." },
      { question: "What should I wear?", answer: "Whether you prefer loose or tight clothes, please wear comfortable ones that you can easily move and stretch." },
      { question: "Can I eat before the class?", answer: "Everyone is different when it comes to food and digestion. In general, we do not recommend eating a large meal at least two hours before the class." },
      { question: "I never do yoga before. I am not flexible either. Can I come?", answer: "Yes. Our class is also suitable for beginners without any experience before. Many people assume that they need to be flexible to practice yoga, in fact, yoga will help you become more flexible. Just come as you are." },
      { question: "I am interested to do private yoga. Can you arrange this?", answer: "Surely. Private yoga class is available at an additional charge. Please let us know a few days before." },
    ],
    gallery: [
      `${U}2023/03/ubud-yoga-2.webp`,
      `${U}2023/03/ubud-yoga-3.webp`,
      `${U}2023/03/ubud-yoga-1.webp`,
      `${U}2023/03/ubud-yoga-4.webp`,
      `${U}2023/03/yoga-jane.webp`,
      `${U}2023/03/yoga-peby.webp`,
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
      "Lisa , our dedicated Wellness Instructor, began her journey with a passion for yoga, fitness classes, and dancing. As she experienced remarkable improvements in her posture, she was inspired to pursue teacher training in Bali, becoming a certified yoga instructor. Her expertise extends beyond yoga to include access bars, meditation, and pilates, showcasing her commitment to a comprehensive wellness approach. Lisa's diverse skills and heartfelt dedication ensure that every guest enjoys a transformative and enriching wellness experience.",
    ],
    inclusions: [],
    faq: [

    ],
    gallery: [
      `${U}2024/08/Lisa-min-min-1.jpg`,
    ],
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
