// Treatment choices, prices, times, and agreement copied from each live form on 2026-09-04.
// These forms publish their own rates; do not substitute the main SPA menu rates.
import type { InquiryField } from "@/components/property/InquiryForm";

export const SPA_RESERVATION_FIELDS: Record<string, InquiryField[]> = {
  "ubud-spa-booking-form": [
    {
      "kind": "checkbox",
      "name": "package",
      "label": "Treatments",
      "options": [
        "Bamboo Drainage Massage In the Eastern world, bamboo is a symbol of longevity because of its strength, flexibility, & resilience. Bamboo massage is known for its restorative properties to stimulate the flow of blood and lymph and relieve muscle tension. A combination of deep tissue therapy, manual drainage massage, and long flowing massage strokes and rolling with bamboo sticks combines in our signature massage to soothe the senses and promote the well-being. 90 mins IDR 790.000++",
        "Lymphatic Drainage Massage This massage technique is designed to encourage the movement of lymph fluid. By stimulating circulation through a rhythmic motion in the direction of the lymphatic flow, it will enhance the elimination of toxins, alleviate water retention, and relieve bloating. 90 mins IDR 750.000++",
        "Lymphatic Drainage Massage This massage technique is designed to encourage the movement of lymph fluid. By stimulating circulation through a rhythmic motion in the direction of the lymphatic flow, it will enhance the elimination of toxins, alleviate water retention, and relieve bloating. 60 mins IDR 590.000++",
        "Mahamaya Herbal Massage Inspired by the herbal that has long been used by Balinese People, the warm herbal compress invites your muscle to relax. The warm mixture of the herbs in the relaxing massage flow helps to reduce aches and gives an ultimate boost to your well-being. 90 mins IDR 690.000++",
        "River Stone Massage Utilizing the warm stone to melt deep muscle tension, River stone massage will release the burdens of everyday living and nurture your body and mind. The therapist carefully places the warm stone on different chakra points in a rhythmic relaxing massage. 90 mins IDR 690.000++",
        "Deep Tissue Massage Our signature deep tissue massage is designed to target deeper tissues under your skin using warm oil and a warm towel ritual. Performed with a slow and deliberate technique passed down through generations, it helps relieve the stiffness and encourages a sense of deep relaxation. 90 mins IDR 650.000++",
        "Deep Tissue Massage Our signature deep tissue massage is designed to target deeper tissues under your skin using warm oil and a warm towel ritual. Performed with a slow and deliberate technique passed down through generations, it helps relieve the stiffness and encourages a sense of deep relaxation. 60 mins IDR 490.000++",
        "Relaxing Balinese massage Feel the tension dissolve with the ancient wisdom of Balinese treatment that is performed using long strokes, palm press, thumb press, and gentle stretching. A rhythmic experience evokes a sense of relaxation and stimulates the blood flow. 90 mins IDR 590.000++",
        "Relaxing Balinese massage Feel the tension dissolve with the ancient wisdom of Balinese treatment that is performed using long strokes, palm press, thumb press, and gentle stretching. A rhythmic experience evokes a sense of relaxation and stimulates the blood flow. 60 mins IDR 450.000++",
        "Focused Massage Express treatment that perfect for anyone who seeks relaxation in a busy schedule. Choices: neck & shoulder or back, or foot massage 30 mins IDR 350.000++",
        "Foot Reflexology An intensely healing treatment to target specific points on the feet to boost the inner energy through the body's meridian 60 mins IDR 390.000++",
        "Muscle Sculpting by CM Slim (Arm / Abs / Thigh/ Booty) Unleash the power of CM Slim, CE certified muscle sculpting technology. In just 30 minutes, experience the magic of simultaneously building muscle and burning fat, equivalent to 30,000 crunches or squats. Transform your body and achieve toned arms, flat abs to realizing your Brazilian butt dream. Elevate your fitness journey with CM Slim, where innovation meets your aspirations for a fitter, more confident you. 30 mins IDR 1.570.000++",
        "Advanced Anti-Cellulite Care by Tegoder (Arm / Abs / Hip & Thigh) This revolutionary therapy combines the goodness of East medicine to improve circulation with West medicine to tighten the loose skin. The treatment starts with anti cellulite massage using a scientifically proven solution that contains Lipoglaucin, L-carnitine, bitter orange, & enzymatic complex to induce lipolysis and reduce the appearance of the cellulite. It is followed by the application of anti-cellulite wrap and infrared thermal blanket to eliminate water retention, flush out the toxin, and smoothen the skin. 45 mins IDR 590.000++",
        "Advanced Anti-Cellulite Care by Tegoder (Full Leg) This revolutionary therapy combines the goodness of East medicine to improve circulation with West medicine to tighten the loose skin. The treatment starts with anti cellulite massage using a scientifically proven solution that contains Lipoglaucin, L-carnitine, bitter orange, & enzymatic complex to induce lipolysis and reduce the appearance of the cellulite. It is followed by the application of anti-cellulite wrap and infrared thermal blanket to eliminate water retention, flush out the toxin, and smoothen the skin. 60 mins IDR 790.000++",
        "Advanced Anti-Cellulite Care by Tegoder Full Body (Arm, Abdomen, Hip, Full Leg) This revolutionary therapy combines the goodness of East medicine to improve circulation with West medicine to tighten the loose skin. The treatment starts with anti cellulite massage using a scientifically proven solution that contains Lipoglaucin, L-carnitine, bitter orange, & enzymatic complex to induce lipolysis and reduce the appearance of the cellulite. It is followed by the application of anti-cellulite wrap and infrared thermal blanket to eliminate water retention, flush out the toxin, and smoothen the skin. 120 mins IDR 1.590.000++",
        "Refreshing Citrus Body Scrub Reveal nourished and supple skin with this softening exfoliation using a tropical cocktail of organic salt, lemongrass, and mandarin orange. Exfoliate your skin and let it shine. 30 mins IDR 290.000++",
        "Exotic Flower Body Scrub Infused with traditional blends of Balinese flowers, the salt's granule gently removes the dead skin while moisturizing it, leaving you with smooth skin. 30 mins IDR 290.000++",
        "Traditional Coconut Body Scrub Experience a recipe from our ancestors for smooth, glowing skin. A traditional and natural way to buff away dead skin cells gently while the antioxidant power of coconut leaves skin soothed and toned. 30 mins IDR 290.000++",
        "Boreh Spice Wrap Boreh has been used for centuries by Balinese farmers to warm the body and relieve fatigue. A blend of ginger, cinnamon, cloves, and sandalwood is applied to the skin and gently massaged into your body. This is a perfect treatment if you experience jet lag or need a boost. Enjoy a heavenly scalp massage while your body is polished in the body wrap 30 mins IDR 290.000++",
        "Purifying Coconut Body Wrap Milk body polish softens and rejuvenates the skin with mild exfoliating properties to eliminate dead skin cells. Enjoy a heavenly scalp massage while your body is polished in the body wrap. 30 mins IDR 290.000++",
        "Hydrating Milk Body Polish Milk body polish softens and rejuvenates the skin with mild exfoliating properties to eliminate dead skin cells. Enjoy a heavenly scalp massage while your body is polished in the body wrap. 30 mins IDR 290.000++",
        "Mahamaya Shirodara Treatment The key Ayurvedic treatment is to relieve anxiety and restores calmness from within. This ancient treatment has been practiced for centuries and is believed to help treat insomnia & burnout. Our signature Shirodhara begins with a welcoming short neck & shoulder massage. Once you are relaxed, the therapists will pour warm herbal oil over the 6th Ajna chakra point in the center of your forehead, famously known as the “third eye”. Your hair will then be washed properly and applied with a nourished hair mask to help repair the dull hair. 90 mins IDR 750.000++",
        "Intensive Hair SPA An intensive fragrant treatment to revitalize the hair utilizing the legendary aloe vera extract, a well-known ingredient that helps prevent hair loss by strengthening the roots. Spoil yourself even more with the scalp massage that is designed to enhance nutrient’s penetration and the mahamaya classic massage that target muscle soreness in the neck and shoulder 75 mins IDR 550.000++",
        "Authentic Hair Crème Bath The secret of the Indonesian beauty ritual that uses extracts blends of strawberry and yogurt containing Vitamin C and amino acids act to nourish and revive dry, damaged hair and leave hair smelling fresh and divine. A gentle head massage promotes scalp circulation and gloss, while the neck and shoulder massage boost your overall well-being. 75 mins IDR 550.000++",
        "Hair Wash with Vitamin Say no more to the bad hair day. Express treatment to cleanse your scalp and nourish your hair 30 mins IDR 250.000++",
        "Tropical Balinese Flower Bath Experience being the Balinese queen with a handcrafted flower bath and let the flowers spoil your body and mind. The bath is also infused with ylang ylang essential oil to enhance your soul journey. No wonder, It has become everybody's favorite to create a memorable moment in Ubud. 30 mins IDR 550.000++",
        "Energizing Herbal Bath Leisurely soak away your stress in the purity of nature with the aromatic blend of pandanus leaves, ginger, lime, and betel leaves. This Balinese herbal combination, along with the pure essential oil, encourages relaxation leaving the body refreshed and energized. 30 mins IDR 450.000++",
        "Cleopatra's Rose Milk bath Inspired by Cleopatra's ritual, boost your skin hydration even more in a milk bath scented with pure essential oil to calm your mind. A dash of fresh rose petals will brighten your mood for the remainder of the day 30 mins IDR 290.000++",
        "Island Frangipani Milk Bath Luxuriate in a warm bath of pure coconut milk and fresh frangipani petals to soften the skin and uplift the sense of well being. 30 mins IDR 290.000++",
        "Advanced Holistic Slimming Package Revitalize your body with our Advanced Slimming Package. Sculpt and define muscles with CM Slim, our advanced CE-certified muscle sculpting treatment to build muscle and burn fat at the same time. Unwind with a rejuvenating lymphatic drainage massage, targeting toxins and reducing water retention. Elevate your results with radiofrequency technology, tightening and toning your skin for a sleek silhouette. Embrace confidence and transformation in one holistic package. Muscle Sculpting by CM Slim in one area (CE Certified) Lymphatic Drainage Massage Radiofrequency 150 mins IDR 2.645.000++",
        "Holistic Cellulite Therapy by Tegoder Foot Ritual Full Body Anti Cellulite Infrared Thermal Blanket Balinese Warm Spice Bath Organic Coconut Drink Indulge in a full-body holistic skin-firming therapy to reveal softer skin & combat the cellulite. A blend of scientifically proven ingredients with anti cellulite massage technique improves metabolic circulation, and diminishes cellulite, leaving the skin's texture visibly plumper & smoother. The treatment is followed by a toning wrap in an infra-red thermal blanket to eliminate the toxin & excess water. Lastly, celebrate the progress with Balinese Spice Bath while enjoying the coconut drink to hydrate your body. 150 mins IDR 1.990.000++",
        "Self-Love Journey Indulge your self an invigorating ritual to create profound balance and harmony in your body and soul. Beginning with a relaxing Balinese Massage, step into coconut body scrub to exfoliate the dead cell, and finished with milk body polish to promote skin hydration. Lastly, spoil yourself with our tropical Balinese flower bath while enjoying a light and healthy spa cuisine as your body & mind deserve. Balinese Massage Coconut Body Scrub Milk Body Polish Scalp Massage Tropical Balinese Flower bath Light Spa Cuisine 180 mins IDR 1.390.000++",
        "Signature Nyuh (Coconut) Sensation Connecting you with the vital element of Balinese wellness, this holistic package will begin with a relaxing Balinese massage, followed by a coconut body scrub and coconut body wrap. Last, complete the journey with a skin nourishing session with an island frangipani milk bath made from pure coconut milk to refresh your body. From head to toe, you will feel rejuvenated and revitalized. Balinese Massage Coconut Body Scrub Coconut Body Wrap Scalp Massage Island Frangipani Milk Bath Organic Coconut Drink 180 mins IDR 1.190.000++",
        "Blissful Mahamaya Journey Capturing the goodness of nature, this signature experience delivers the benefit of Balinese herbal to calm your body and mind. Beginning with the herbal massage, discover the warmth and healing sensation of Balinese boreh, and followed by the energized herbal bath to promote the inner energy from within. Herbal Massage Boreh Spice Wrap Herbal Bath Healthy Green Juice (spinach, pineapple, apple, cucumber) 150 mins IDR 1.190.000++",
        "Cleopatra's Indulging Ritual Gift yourself once in a while. Throw back to the ancient time, and feel the royalty of Cleopatra's ritual to unwind yourself from the stress of modern living. This treatment begins with a Balinese massage. After enhancing the relaxation of your muscle, the skin is exfoliated with a choice of body scrub and finished with Cleopatra's rose milk Bath. Balinese Massage Body Scrub Cleopatra's Rose Bath 120 mins IDR 990.000++",
        "Stress Recovery Breathe into a classic ritual to relieve body tension and let go things that no longer serve you. This treatment features deep tissue massage to relieve the stubborn muscle tension, coconut body wrap to boost your skin's antioxidant, and complete with an aromatherapy bubble bath that will help to de-stress. Deep Tissue Massage Coconut Body Wrap Scalp Massage Aromatherapy Bubble Bath Cleanser Elixir (Coconut water, lime, ginger, dragon fruit) 120 mins IDR 950.000++",
        "Rama & Shinta Refresher This Balinese couple package is curated to help you recover from the mental strains of modern living. Beginning with a river stone massage, step into Balinese boreh spice wrap to warm up your body. Finish the ritual with enegizing and our signature herbal bath consisting of traditional blends of herbs that will allow you to feel physically and emotionally grounded. River Stone Massage Boreh Spice Wrap Herbal bath Healthy Green Juice (carrot, orange, lemon, ginger) 150 mins IDR 2.150.000++",
        "Honeymoon Enjoyment After a tiring wedding jitter, you both deserve ultimate relaxation. Dedicated to relieving the tension while sharing intimacy with your partner, this honeymoon package includes Balinese massages and milk body polish to give a boost to your skin. To end the treatment, immerse yourself and your love in a tropical Balinese flower bath ritual Balinese Massage Milk Body Polish Scalp Massage Tropical Balinese Flower Bath Tropical Blend Juice (dragon fruit, banana, coconut milk) 120 mins IDR 1.950.000++",
        "Romantic Bubble Bliss This dreamy spa package is designed exclusively for busy couples wanting to gift themselves with pampering time together. This romantic treatment consists of a Balinese massage for couples and an aromatherapy bubble bath with rose petals to enhance the romantic sensation. Balinese Massage Aromatherapy Bubble Bath with Rose Petals Ginger Tea 90 mins IDR 1.090.000++",
        "Collagen Booster Facial by Dermalogica Deep Cleansing – Microfoliant – Steam & Extraction – Face Massage with Roller - Soft Peeling - IPL Rejuvenation – Premium Gold Mask – Shoulder Massage – Serum Infusion with Electroporation – Eye & Lip Care – Moisturizer & Sunscreen A new start for smoother skin. A combination of soft peeling and micro exfoliant intensively works to remove skin debris and purify the skin surface. Intense pulse light therapy is then applied to your skin to target the deeper layer of the skin to revitalize skin cells and boost collagen renewal. Prepare to be pampered with a rejuvenating gold mask and heavenly shoulder massage. The whole experience will leave your skin with a plumper texture and replenished appearance. 90 mins IDR 1.290.000",
        "Firming & Resurfacing Facial by Dermalogica Deep Cleansing – Microdermabrasion - Radiofrequency – Steam & Extraction - High Frequency - Face Massage with Guasha - Recovery Mask - Serum Infusion - Eye & Lip Care – Moisturizer & Sunscreen Discover the power of restructuring and tightening experience in this to restore vitality and refresh your overall appearance. After double cleansing, radiofrequency is introduced to generate heat to stimulate the production of collagen and elastin as nonsurgical face-firming therapy. Dimond microdermabrasion and manual extraction will follow the journey to exfoliate dead skin, unclog the congested pores, and reveal smoother skin. The treatment concludes with a massage and mask to regenerate natural collagen for for more youthful look.. 90 mins IDR 990.000",
        "Red Carpet Hydra Glow Deep Cleansing - Enzyme Peeling - Soft Peeling & Steam - Hydra Peeling - Extraction - Face Massage - Tightening Stimulation - Premium Alga Mask - Brightening Eye Mask - Shoulder Massage - Hydrating Infusion - Serum - Eye & Lip Care - Moisturizer & Sunscreen Cleanse, brighten, and tighten. Discover red carpet-worthy radiance and refined pores with this non-invasive facial treatment. Your skin is gently resurfaced using Hydra Glow combining deep cleansing, vacuum extraction, and serum infusion. Experience tightening skin with electroporation, tightening stimulation, and a premium alga mask to enhance skin elasticity and firm your overall look. Get 90 mins IDR 1.290.000",
        "Hydra Glow Facial Deep Cleansing - Enzyme Peeling - Soft Peeling & Steam - Hydra Peeling - Extraction - Face Massage - Tightening Stimulation - Mask - Shoulder Massage - Hydrating Infusion - Serum Infusion—Eye & Lip Care - Moisturizer & Sunscreen This indulgent treatment is designed to deeply clean your skin while pumping the skin with nutrients to reveal smooth and brighten skin. Hydra vacuum technology helps to remove impurities with no downtime. It includes removal of comedones & treat of congestion. Electroporation and tightening stimulation follow to tone the skin. Your skin-reviving experience includes a personalized mask and a relaxing massage. The skin is then infused with a powerful blend of antioxidants and vitamins to maximize the brightening effect for more luminous skin. 75 mins IDR 850.000",
        "Glow and Go Facial Deep Cleansing - Soft Exfoliant - Hydra Peeling - Face Massage - Tightening Stimulation- Mask - Shoulder Massage - Hydrating Infusion - Eye & Lip Care - Moisturizer & Sunscreen A rapid repair solution to restore your skin glow. This treatment features two steps of hydra dermabrasion to exfoliate gently while hydrating your skin. Electroporation and tightening stimulation follow to tone the skin. Your skin-reviving experience includes a personalized mask and a relaxing massage. The treatment concludes with serum infusion packed with powerful actives, leaving the skin looking refreshed & more radiant. 45 mins IDR 590.000",
        "Triple Action Acne Care by Dermalogica Deep Cleansing — Pre Extraction Gel - Steam & Extraction - Natural Anti Bacterial Extracts— IPL Acne - Soft Peeling - Mask – Shoulder Massage - Serum Infusion – Eye & Lip Care – Moisturizer & Sunscreen Designed specifically for acne-prone skin, this treatment involves deep cleansing, hygienic extraction with natural anti-bacterial extracts, and high frequency to prevent further inflammation. It also includes Intense Pulse Light therapy that effectively destroys the P. acnes bacteria, treats inflammatory acne and inhibits sebaceous oil glands. Natural soft peeling is then applied to unblock the clogged pores and relieve congestion. We round off with our tea tree mask and special serum to clarify the skin. 90 mins IDR 1090.000",
        "Acne & Blemish Facial by Dermalogica Deep Cleansing — Pre Extraction Gel - Steam & Extraction - High Frequency - Natural Anti Bacterial Extracts - Soft Peeling - Mask – Shoulder Massage - Serum Infusion – Eye & Lip Care – Moisturizer & Sunscreen Deep cleansing facial to banish blemishes and balance oil production by removing the debris that builds up in pores. The extraction is done using an advanced formula made from anti-bacterial botanical extracts with high frequency to minimize inflammation and break out. It features a soft peeling to treat congested pores & decrease sebum. The treatment concludes with a tea tree mask and dedicated serum for acne-prone skin, leaving your skin feeling invigorated and thoroughly cleansed 75 mins IDR 850.000",
        "Illuminating Facial Deep Cleansing - Steam & Extraction - Resurfacing Peels - Face Massage - Booster Essence - Double White Booster Mask - Shoulder Massage - Eye & Lip Care - Moisturizer & Sunscreen Unveil a radiant and luminous complexion with our Illumniating Facial. Our signature facial features 5-step lightening system to lighten stubborn pigmentation and discol- oration by targeting melanin production in a 3-fold manner. Immerse yourself in the luxurious indulgence of this transformative treatment, meticulously crafted to en- hance your skin's luminosity and leave you with a radiant, lit-from-within complexion 90 mins IDR 1.290.000",
        "Calming Oxygen Facial Deep Cleansing - Jet Peel - Soft Peeling - Steam & Extraction- Face Massage with Roller - Oxygen Spray - Calming Stem Cell Mask with PDT - Serum Infusion with Electroporation - Eye & Lip Care - Moisturizer & Sunscreen A best friend for sensitive, this oxygen facial effectively quenches dehydrated, travel-weary, or sun-damaged skin. After deep cleansing, your skin will be exfoliated to remove the dead skin. Essential nutrients are infused to promote hydration follow- ing skin oxygenation to stimulate blood flow and encourage healthy production of newer skin cells. The session ends with stem cell face mask and PDT light therapy to soothe and calm the sensitive skin. 75 mins IDR 850.000",
        "The Essential Deep Cleansing - Exfoliation - Face Massage with Guasha - Personalized Mask Application - Serum Infusion with Electroporation - Eye & Lip Care - Moisturizer & Sunscreen In a rush but your skin needs a boost? Your skin is as unique as you are and it changes from day to day. This express facial features essential steps to deep cleanse your skin in a limited time. The active ingredients are tailored to your specific skin type and concern, leaving your skin clean and refreshed. A short yet relaxing massage completes your quick self-care moment while promoting blood circulation. 45 mins IDR 490.000",
        "Bright Eye Care Deep cleansing - Enzymatic Peeling - Massage - Soothing Mask - Eye Concentrate & Serum Specially designed for fatigued eyes that need a hydration booster and a new shine, this treatment can be added to any of your chosen facials. It begins with eye contour deep cleansing and massage, followed by a dedicated mask for the eyes. Eye con- centrate and cream help to refresh and plump the eye area, while a soothing scalp massage delivers a welcome relaxation. 30 mins IDR 390.000",
        "Bootylicious Deep Cleansing - Jet Peel - Soft Exfoliant - Steam & Extraction - Booty Mask - Firming Body Serum with Electroporation — Radiofrequency - Firming Body Cream with Booty Massage Wear your bikini worry-free. Our bootylicious facial comes with everything to treat your booty the love it deserves. This treatment involves deep cleanse, radiofrequency, extraction, booty massage, soft peeling, soothing hydro jelly mask, and firming body 75 mins IDR 1.050.000",
        "Backne Care Cleansing - Steam & Extraction - High Frequency - Soft Peeling - PDT - Peel Off Mask - Serum Infusion with Electroporation - Oil-Free Acne Moisturizer Calming and acne-preventing treatment that helps you to smooth and resurface your back. Our back acne treatment involves deep cleansing, extraction, and soft peels to exfoliate the dead skin gently and unclog the pores. Blue light therapy is also used to treat inflammation and accelerate the healing process. The treatment finished calming hydro mask and serum infusion. Get ready to rock and shine with your backless dress. 75 mins IDR 1.290.000",
        "Ultimate Radiance Deep Cleansing - Enzyme Peeling - Soft Exfoliant - Steam & Extraction - Face Massage - Painless Mesotherapy - Stem Cell Tightening Mask - Shoulder Massage - Eye & Lip Care - Moisturizer & Sunscreen Following extraction & gentle exfoliation, we will apply painless mesotherapy to deliver 56 nutrients that contain PDRN, growth factors, vitamins, peptides, amino acids, and hyaluronic acid to reach the targeted concern. The treatment concludes with an stem cell tightening mask to brighten and improve skin elas- ticity. Discover the uniqueness of ultimate radiance facial & step into a world of beauty and confidence. 75 mins IDR 2.590.000",
        "Skin Lifting Facial Deep Cleansing - Enzyme Peeling - Soft Exfoliant - Steam & Extraction - Face Massage with Roller - HIFU 150 shots - Calming Peptide Mask - Shoulder Massage - Eye & Lip Care - Moisturizer & Sunscreen Turn back the clock on mature skin and skin laxity. Deep cleansing and gentle exfolia- tion is first used to gently clear dead skin. HIFU then firms the skin to lift the aging skin by stimulating collagen production and giving a non-surgical skin lifting. A calming peptide mask containing hydrating ingredients concludes the treatment. Achieve long -lasting results that noticeably lift, firm, and brighten the skin. 90 mins IDR 2.590.000",
        "V-Shape Facial Deep Cleansing - Enzyme Peeling - Soft Exfoliant - Steam & Extraction- Face Massage with Roller - Lower Face HIFU - Calming Peptide Mask - Shoulder Massage - Eye & Lip Care - Moisturizer & Sunscreen Achieve your dreamy V-shaped face with this non-ordinary facial. Your V-shape jour- ney begins with double cleansing, gentle exfoliation, and stimulating massage. A new generation of HIFU will be applied to your lower face and jawline to lift the face and create a more defined jawline. It is an ideal alternative to lift your face without surgery. 120 mins IDR 4.500.000"
      ]
    },
    {
      "kind": "date",
      "name": "preferred-date",
      "label": "Date",
      "required": true
    },
    {
      "kind": "radio",
      "name": "preferred-time",
      "label": "Preferred Time",
      "options": [
        "10.00",
        "10.30",
        "11.00",
        "11.30",
        "12.00",
        "12.30",
        "13.00",
        "13.30",
        "14.00",
        "14.30",
        "15.00",
        "15.30",
        "16.00",
        "16.30",
        "17.00",
        "17.30",
        "18.00",
        "18.30",
        "19.00"
      ]
    },
    {
      "kind": "radio",
      "name": "nop",
      "label": "Number of persons",
      "options": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ]
    },
    {
      "kind": "textarea",
      "name": "special-request",
      "label": "Special Request"
    },
    {
      "kind": "text",
      "name": "your-name",
      "label": "Name",
      "required": true
    },
    {
      "kind": "email",
      "name": "your-email",
      "label": "Email",
      "required": true
    },
    {
      "kind": "tel",
      "name": "your-phone",
      "label": "Phone",
      "required": true
    },
    {
      "kind": "checkbox",
      "name": "agreement",
      "label": "Agreement",
      "required": true,
      "options": [
        "By submitting this form, i agree to pay the full payment to get the early booking discount and secure the slot. The early booking discount is valid for booking minimum 7 days prior to my treatment date. The discount will not be applied if i don't process the payment before my arrival date. I agree to the terms and conditions applied to the early booking, including the deposit is non refundable"
      ]
    }
  ],
  "spa-reservation-seminyak": [
    {
      "kind": "checkbox",
      "name": "package",
      "label": "Treatments",
      "options": [
        "Relaxing Balinese Massage This traditional Balinese Massage is a combination of long strokes, palm press, thumb press, and gentle stretching. Using a high-quality mixture of coconut, soybean, and sweet almond oil, it will relieve the strained muscle as well as evoke a sense of relaxation 60 mins IDR 390.000++",
        "Relaxing Balinese Massage This traditional Balinese Massage is a combination of long strokes, palm press, thumb press, and gentle stretching. Using a high-quality mixture of coconut, soybean, and sweet almond oil, it will relieve the strained muscle as well as evoke a sense of relaxation 90 mins IDR 550.000++",
        "Warm Stone Massage Instead of just gliding of heated stone lightly upon the surface of the skin, your therapist will use the stones as tools to deliver tissue massage, with the pressure based on your preference. It is effective to remove the tension and improve the blood circulation 90 mins IDR 590.000++",
        "Nyuh Bali Holistic Body Treatment Balinese Massage - Body Scrub - Shower. A ritual treatment to release your muscle aches and to remove the dead skin gently. Using the gentle salt’s scrub, they will remove the impurities while moisturizing the skin. Exfoliate your skin and let it shine 100 mins IDR 640.000++",
        "Cleopatra's Rose Ritual Balinese Massage - Body Scrub - Cleopatra's Milk Bath with Rose Petals. After the tiring days, it's time to relax. You deserve a break. In the end, pamper your self with Cleopatra's milk bath that will moisturize your skin while spoiling your soul & mind 120 mins IDR 850.000++",
        "Romantic Getaway Package Balinese Massage - Bubble Bath with Rose Petals. A perfect choice for the busy couples who would like to gift themselves 90 mins IDR 950.000++",
        "Honeymoon Enjoyment Package Balinese Massage - Body Scrub - Exotic Flower Bath. Who does not love the flower? This luxury package will give you a true spa experience by discovering the uniqueness of relaxation in the romantic ambiance. Feel free to choose your own flower bath's design 120 mins IDR 1.350.000++"
      ]
    },
    {
      "kind": "date",
      "name": "preferred-date",
      "label": "Date",
      "required": true
    },
    {
      "kind": "radio",
      "name": "preferred-time",
      "label": "Preferred Time",
      "options": [
        "10.00",
        "10.30",
        "11.00",
        "11.30",
        "12.00",
        "12.30",
        "13.00",
        "13.30",
        "14.00",
        "14.30",
        "15.00",
        "15.30",
        "16.00",
        "16.30",
        "17.00",
        "17.30",
        "18.00"
      ]
    },
    {
      "kind": "radio",
      "name": "nop",
      "label": "Number of persons",
      "options": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ]
    },
    {
      "kind": "textarea",
      "name": "special-request",
      "label": "Special Request"
    },
    {
      "kind": "text",
      "name": "your-name",
      "label": "Name",
      "required": true
    },
    {
      "kind": "email",
      "name": "your-email",
      "label": "Email",
      "required": true
    },
    {
      "kind": "tel",
      "name": "your-phone",
      "label": "Phone",
      "required": true
    },
    {
      "kind": "checkbox",
      "name": "agreement",
      "label": "Agreement",
      "required": true,
      "options": [
        "By submitting this form, i agree to pay the full payment to get the early booking discount. The discount will not be applied if i don't process the payment before my arrival date. I agree to the terms and conditions applied to the early booking, including the deposit is non refundable"
      ]
    }
  ]
};
