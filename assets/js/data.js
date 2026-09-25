/* ==========================================================================
   Site content. Edit this file to add papers, talks, videos and photographs.
   Pages read these lists and render them; no build step is needed.
   ========================================================================== */

window.SITE = {
  /* ------------------------------------------------------------------
     Publications
     video: YouTube id of a summary video (adds a "Video" link).
     type: "first"      first-author refereed papers
           "collab"     co-authored papers (JWST ERS collaboration)
           "whitepaper" community white papers
     ------------------------------------------------------------------ */
  publications: [
    {
      type: "first", year: 2026,
      title: "A study on the contribution of the interplanetary medium in radio occultation experiments",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Banerjee, S., Manikantan, R., Sharma, A., Imamura, T.",
      venue: "Icarus",
      doi: "10.1016/j.icarus.2026.117291",
      arxiv: "2608.03435",
      video: "Ex9r_Qzf1Dc",
      missions: ["Chandrayaan-2", "Chandrayaan-3", "Venus Express", "Akatsuki"]
    },
    {
      type: "first", year: 2026,
      title: "Plasma turbulence in the lunar environment across solar wind and magnetotail conditions: Observations from Chandrayaan-2 Radio Science experiment",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Sharma, A.",
      venue: "Journal of Geophysical Research: Planets",
      doi: "10.1029/2026JE009957",
      arxiv: "2608.15512",
      video: "0qbrOB-qnnA",
      missions: ["Chandrayaan-2"]
    },
    {
      type: "first", year: 2026,
      title: "A turbulence index independent framework for deriving solar wind speed and coronal electron density from radio spectral broadening",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Banerjee, S., Imamura, T., Ando, H.",
      venue: "Monthly Notices of the Royal Astronomical Society",
      doi: "10.1093/mnras/stag554",
      arxiv: "2603.20874",
      video: "BUyCingJDiM",
      missions: ["Akatsuki"]
    },
    {
      type: "first", year: 2026,
      title: "A generalized method for estimating solar wind speeds and densities using spectral broadening for a Kolmogorov turbulence spectrum",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Roopa, M. V., Imamura, T.",
      venue: "Advances in Space Research",
      doi: "10.1016/j.asr.2026.03.059",
      arxiv: "2603.23929",
      missions: ["Mars Orbiter Mission", "Akatsuki"]
    },
    {
      type: "first", year: 2025,
      title: "On the estimation of solar wind velocity under varying solar activity conditions using Akatsuki measurements",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Imamura, T.",
      venue: "Monthly Notices of the Royal Astronomical Society",
      doi: "10.1093/mnras/staf1305",
      arxiv: "2508.06381",
      missions: ["Akatsuki"]
    },
    {
      type: "first", year: 2025,
      title: "Insights into solar wind flow speeds from the coronal radio occultation experiment: Findings from the Indian Mars Orbiter Mission",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Roopa, M. V., Dai, B. K.",
      venue: "The Astrophysical Journal",
      doi: "10.3847/1538-4357/adb627",
      arxiv: "2502.09512",
      code: "https://github.com/jovian-explorer/Sun",
      missions: ["Mars Orbiter Mission"]
    },

    {
      type: "collab", year: 2024,
      title: "A benchmark JWST near-infrared spectrum for the exoplanet WASP-39 b",
      authors: "Carter, A. L., May, E. M., Espinoza, N., Welbanks, L., et al. (incl. Aggarwal, K.)",
      venue: "Nature Astronomy",
      doi: "10.1038/s41550-024-02292-x"
    },
    {
      type: "collab", year: 2024,
      title: "Nightside clouds and disequilibrium chemistry on the hot Jupiter WASP-43b",
      authors: "Bell, T. J., Crouzet, N., Cubillos, P., Kreidberg, L., Piette, A. A. A., et al. (incl. Aggarwal, K.)",
      venue: "Nature Astronomy",
      doi: "10.1038/s41550-024-02230-x"
    },
    {
      type: "collab", year: 2024,
      title: "Sulphur dioxide in the mid-infrared transmission spectrum of WASP-39b",
      authors: "Powell, D., Feinstein, A., Lee, E., Zhang, M., Tsai, S., Taylor, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-024-07040-9"
    },
    {
      type: "collab", year: 2023,
      title: "Photochemically produced SO₂ in the atmosphere of WASP-39b",
      authors: "Tsai, S., Lee, E., Powell, D., Gao, P., Zhang, X., Moses, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-023-05902-2"
    },
    {
      type: "collab", year: 2023,
      title: "Detection of carbon monoxide’s 4.6 micron fundamental band structure in WASP-39b’s atmosphere with JWST NIRSpec G395H",
      authors: "Grant, D., Lothringer, J. D., Wakeford, H. R., et al. (incl. Aggarwal, K.)",
      venue: "The Astrophysical Journal Letters",
      doi: "10.3847/2041-8213/acd544"
    },
    {
      type: "collab", year: 2023,
      title: "A broadband thermal emission spectrum of the ultra-hot Jupiter WASP-18b",
      authors: "Coulombe, L.-P., Benneke, B., Challener, R., Piette, A., Wiser, L., Mansfield, M., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-023-06230-1"
    },
    {
      type: "collab", year: 2023,
      title: "Identification of carbon dioxide in an exoplanet atmosphere",
      authors: "JWST Transiting Exoplanet Community Early Release Science Team: Ahrer, E., Alderson, L., Batalha, N., Bean, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05269-w",
      code: "https://github.com/jovian-explorer/Identification-of-carbon-dioxide-in-an-exoplanet-atmosphere"
    },
    {
      type: "collab", year: 2023,
      title: "Early Release Science of the exoplanet WASP-39b with JWST NIRSpec PRISM",
      authors: "Rustamkulov, Z., Sing, D., Mukherjee, S., May, E., Kirk, J., Schlawin, E., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05677-y"
    },
    {
      type: "collab", year: 2023,
      title: "Early Release Science of the exoplanet WASP-39b with JWST NIRSpec G395H",
      authors: "Alderson, L., Wakeford, H., Alam, M., Batalha, N., Lothringer, J., Redai, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05591-3"
    },

    {
      type: "whitepaper", year: 2023,
      title: "Improving multi-dimensional data formats, access, and assimilation tools for the twenty-first century",
      authors: "Seaton, D., Caspi, A., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i361"
    },
    {
      type: "whitepaper", year: 2023,
      title: "COMPLETE: a flagship mission for complete understanding of 3D coronal magnetic energy release",
      authors: "Caspi, A., Seaton, D., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i048"
    },
    {
      type: "whitepaper", year: 2023,
      title: "Magnetic energy powers the corona: how we can understand its 3D storage & release",
      authors: "Caspi, A., Seaton, D., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i049"
    }
  ],

  /* ------------------------------------------------------------------
     Conference presentations.
     date: "YYYY-MM" (used for sorting). kind: "Talk" | "Poster"
     award: optional prize text. pdf: optional link to slides or poster.
     ------------------------------------------------------------------ */
  conferences: [
    {
      date: "2026-01", dates: "Jan 2026", kind: "Poster",
      event: "ISRO\u2013ESA Workshop",
      place: "Thiruvananthapuram, India",
      title: "Estimating solar wind speeds using Doppler broadening: results from MOM and Akatsuki"
    },
    {
      date: "2025-12", dates: "Dec 2025", kind: "Poster",
      event: "AGU Fall Meeting 2025",
      place: "New Orleans, United States",
      title: "Estimating solar wind speeds using Doppler broadening: results from MOM and Akatsuki"
    },
    {
      date: "2025-12", dates: "Dec 2025", kind: "Poster",
      event: "The Variable Sun",
      place: "Thiruvananthapuram, India",
      title: "Estimating solar wind speeds using Doppler broadening: results from MOM and Akatsuki"
    },
    {
      date: "2025-09", dates: "8\u201310 Sep 2025", kind: "Poster",
      event: "ASI Symposium 003, Astronomical Society of India",
      place: "JECRC University, Jaipur, India",
      title: "Probing the Smiley-Sun using Akatsuki radio signals",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/ASI_Symposium_Jaipur.pdf"
    },
    {
      date: "2025-08", dates: "Aug 2025", kind: "Talk",
      event: "URSI Asia-Pacific Radio Science Conference (URSI AP-RASC 2025)",
      place: "International Convention Centre, Sydney, Australia",
      title: "Studying the \u2018Smiley Sun\u2019 using the Akatsuki radio occultation experiment"
    },
    {
      date: "2025-03", dates: "4\u20137 Mar 2025", kind: "Poster",
      event: "6th Indian Planetary Science Conference (IPSC)",
      place: "IIT Roorkee, India",
      title: "On the estimation of solar wind velocity using spectral characteristics of the probing radio signals: results from solar occultation measurements using Indian Mars Orbiter Mission",
      award: "Early Career Researcher Award, best poster",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/IPSC_IITR.pdf"
    },
    {
      date: "2024-10", dates: "22\u201325 Oct 2024", kind: "Poster",
      event: "6th URSI Regional Conference on Radio Science (URSI-RCRS)",
      place: "Graphic Era Hill University, Bhimtal, India",
      title: "Results from radio occultation studies using Indian Mars Orbiter Mission",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/URSI_Poster_GEHU_Bhimtal_2024.pdf"
    },
    {
      date: "2024-10", dates: "Oct 2024", kind: "Talk",
      event: "3rd Indian Space Weather Conference",
      place: "IIT Roorkee, India",
      title: "Results from radio occultation studies using Indian Mars Orbiter Mission"
    },
    {
      date: "2023-10", dates: "Oct 2023", kind: "Talk",
      event: "2nd Indian Space Weather Conference",
      place: "Physical Research Laboratory, Ahmedabad, India",
      title: "Unveiling space weather and planetary atmosphere dynamics through Aditya-L1 and DISHA data integration"
    },
    {
      date: "2023-09", dates: "Sep 2023", kind: "Talk",
      event: "Venus Science Conference",
      place: "Physical Research Laboratory, Ahmedabad, India",
      title: "Retrieving sulphuric acid profiles of the Venus atmosphere from Akatsuki radio occultation data"
    }
  ],

  /* ------------------------------------------------------------------
     Travel. Drawn on travel.html.
     districts: "State/District", spelled as in the map data. The easiest way
                to edit this list is travel.html#edit (click districts, then
                "Copy data" and paste the result here).
     places:    pins on the world map (and on the India map for Indian cities).
                lat/lon in decimal degrees. visits: { date: "YYYY-MM", note }.
     countries: extra countries to shade that have no pinned city.
     ------------------------------------------------------------------ */
  travel: {
    districts: [
      "Chandigarh/Chandigarh",
      "Delhi/New Delhi",
      "Goa/North Goa",
      "Haryana/Gurugram",
      "Haryana/Panchkula",
      "Himachal Pradesh/Kullu",
      "Himachal Pradesh/Shimla",
      "Jammu and Kashmir/Jammu",
      "Jammu and Kashmir/Reasi",
      "Kerala/Thiruvananthapuram",
      "Madhya Pradesh/Indore",
      "Madhya Pradesh/Ujjain",
      "Maharashtra/Pune",
      "Punjab/Sahibzada Ajit Singh Nagar",
      "Rajasthan/Jaipur",
      "Uttar Pradesh/Ghaziabad",
      "Uttar Pradesh/Meerut",
      "Uttar Pradesh/Saharanpur",
      "Uttar Pradesh/Varanasi",
      "Uttarakhand/Dehradun",
      "Uttarakhand/Haridwar",
      "Uttarakhand/Nainital"
    ],
    places: [
      { name: "Thiruvananthapuram", country: "India", lat: 8.5241, lon: 76.9366, visits: [{ date: "2026-01", note: "ISRO–ESA Workshop, poster" }, { date: "2025-12", note: "The Variable Sun, poster" }, { date: "2026", note: "Student visitor, Space Physics Laboratory, VSSC" }] },
      { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, visits: [{ date: "2025-08", note: "URSI AP-RASC 2025, talk" }] },
      { name: "Jaipur", country: "India", lat: 26.9124, lon: 75.7873, visits: [{ date: "2025-09", note: "ASI Symposium 003, poster" }] },
      { name: "Roorkee", country: "India", lat: 29.8543, lon: 77.888, visits: [{ date: "2025-03", note: "6th Indian Planetary Science Conference, poster; best poster award" }, { date: "2024-10", note: "3rd Indian Space Weather Conference, talk" }] },
      { name: "Bhimtal", country: "India", lat: 29.344, lon: 79.563, visits: [{ date: "2024-10", note: "6th URSI-RCRS, poster" }] },
      { name: "Indore", country: "India", lat: 22.7196, lon: 75.8577, visits: [{ date: "2021", note: "IIT Indore: M.Sc. and Ph.D." }] },
      { name: "Meerut", country: "India", lat: 28.9845, lon: 77.7064, visits: [{ date: "2021", note: "B.Sc., CCS University" }] },
      { name: "Mhow", country: "India", lat: 22.5524, lon: 75.7565, visits: [] },
      { name: "Ujjain", country: "India", lat: 23.1765, lon: 75.7885, visits: [] },
      { name: "New Delhi", country: "India", lat: 28.6139, lon: 77.209, visits: [] },
      { name: "Gurugram", country: "India", lat: 28.4595, lon: 77.0266, visits: [] },
      { name: "Ghaziabad", country: "India", lat: 28.6692, lon: 77.4538, visits: [] },
      { name: "Saharanpur", country: "India", lat: 29.968, lon: 77.551, visits: [] },
      { name: "Dehradun", country: "India", lat: 30.3165, lon: 78.0322, visits: [] },
      { name: "Chandigarh", country: "India", lat: 30.7333, lon: 76.7794, visits: [] },
      { name: "Mohali", country: "India", lat: 30.7046, lon: 76.7179, visits: [] },
      { name: "Panchkula", country: "India", lat: 30.6942, lon: 76.8606, visits: [] },
      { name: "Shimla", country: "India", lat: 31.1048, lon: 77.1734, visits: [] },
      { name: "Manali", country: "India", lat: 32.2432, lon: 77.1892, visits: [] },
      { name: "Jammu", country: "India", lat: 32.7266, lon: 74.857, visits: [] },
      { name: "Katra (Vaishno Devi)", country: "India", lat: 32.9916, lon: 74.9319, visits: [] },
      { name: "Varanasi", country: "India", lat: 25.3176, lon: 82.9739, visits: [] },
      { name: "Sarnath", country: "India", lat: 25.3811, lon: 83.0214, visits: [] },
      { name: "Pune", country: "India", lat: 18.5204, lon: 73.8567, visits: [] },
      { name: "Goa", country: "India", lat: 15.4909, lon: 73.8278, visits: [] }
    ],
    countries: []
  },

  /* ------------------------------------------------------------------
     Photo albums shown on photography.html. The photographs themselves
     are listed in assets/js/photos.js, which tools/photos.py writes.
     Each photo's "album" field must match an album id below.
     ------------------------------------------------------------------ */
  photography: {
    kit: "Canon EOS R7",
    albums: [
      { id: "night-sky", title: "Night sky", description: "Deep-sky objects, the Moon and planets, and wide-field Milky Way frames." },
      { id: "travel", title: "Travel", description: "Places visited for work and otherwise." },
      { id: "conferences", title: "Conferences", description: "Meetings, posters and campuses." }
    ]
  }
};
