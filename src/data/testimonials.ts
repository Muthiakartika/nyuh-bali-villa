// Real guest testimonials from each property's "What our guests are saying"
// carousel. Kept separate from properties.ts because this array is
// noticeably longer than the rest of that file's data and isn't needed by
// anything except the About pages (properties.ts is needed by nav/footer
// on every page).
export type Testimonial = {
  quote: string;
  author: string;
};

export const TESTIMONIALS: Record<"seminyak" | "ubud", Testimonial[]> = {
  seminyak: [
    {
      quote:
        "Over the years of travelling i've been lucky enough to stay in some amazing 5-star hotels but nothing comes close to nyuh bali villas giving me the best & friendliest stay ever.Thanking everyone sincerely",
      author: "Jeannie Bates in Tripadvisor",
    },
    {
      quote:
        "I honestly had the best trip to Bali, the accommodation was unreal with the service being excellent.",
      author: "Cassandra, Tripadvisor",
    },
    {
      quote:
        "What we appreciate most of all is the kind and hospitable service. We were pampered by the butlers, front desk personnel, and drivers with everything we needed during our stay. We really enjoyed the personal care of this hotel and we can not recommend this enough! We would stay here over and over again",
      author: "Gretchen, Tripadvisor",
    },
  ],
  ubud: [
    {
      quote:
        "I'd seen it online and knew it looked lovely, but didn't comprehend how gorgeous until I was here. It was absolutely everything I wanted from my stay in Bali, to be pampered and truly be on vacation from normal life,",
      author: "OwnLtlWrld, Tripadvisor",
    },
    {
      quote:
        "Heaven on earth. The logo from the hotel is 'romance, retreat and reborn. We are reborn after our stay here! Our casltle' will stay in our heart, this little beautiful paradise. We hope we will see you again.",
      author: "Lieve & Rudi , Tripadvisor",
    },
    {
      quote:
        "BALI BLESS WITHIN LUXURY SETTING. Nyuh Bali Resort & Spa is absolute luxury at a reasonable cost., set in beautiful jungle like gardens where at night you can just about hear a pin drop. Fantastic staff who were only so willing and happy to ensure anything I needed was attended to promptly.",
      author: "Jeannie Bates, Tripadvisor",
    },
    {
      quote:
        "We would love to stay here again and are so very grateful for the wonderful experience we had at Nyuh. Suksma!",
      author: "Nicole Himes",
    },
  ],
};
