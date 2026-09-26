/* ==========================================================================
   Site content. Edit this file to add papers, talks, videos and photographs.
   Pages read these lists and render them; no build step is needed.
   ========================================================================== */

window.SITE = {
  /* ------------------------------------------------------------------
     Publications
     role: "first" (first author) | "co" (co-author)
     kind: "journal" | "proceedings" | "chapter" | "whitepaper" | "preprint"
     status: optional, e.g. "Under review" (shown as a tag; no DOI needed)
     collab: optional collaboration name shown as a tag.
     video: YouTube id of a summary video (adds a "Video" link).
     For a book chapter use kind: "chapter", venue: book title and editors,
     and publisher: "..." (shown after the venue).
     ------------------------------------------------------------------ */
  publications: [
    {
      role: "first", kind: "journal", year: 2026,
      title: "A study on the contribution of the interplanetary medium in radio occultation experiments",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Banerjee, S., Manikantan, R., Sharma, A., Imamura, T.",
      venue: "Icarus",
      doi: "10.1016/j.icarus.2026.117291",
      arxiv: "2608.03435",
      video: "Ex9r_Qzf1Dc",
      missions: ["Chandrayaan-2", "Chandrayaan-3", "Venus Express", "Akatsuki"]
    },
    {
      role: "first", kind: "journal", year: 2026,
      title: "Plasma turbulence in the lunar environment across solar wind and magnetotail conditions: Observations from Chandrayaan-2 Radio Science experiment",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Sharma, A.",
      venue: "Journal of Geophysical Research: Planets",
      doi: "10.1029/2026JE009957",
      arxiv: "2608.15512",
      video: "0qbrOB-qnnA",
      missions: ["Chandrayaan-2"]
    },
    {
      role: "first", kind: "journal", year: 2026,
      title: "A turbulence index independent framework for deriving solar wind speed and coronal electron density from radio spectral broadening",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Banerjee, S., Imamura, T., Ando, H.",
      venue: "Monthly Notices of the Royal Astronomical Society",
      doi: "10.1093/mnras/stag554",
      arxiv: "2603.20874",
      video: "BUyCingJDiM",
      missions: ["Akatsuki"]
    },
    {
      role: "first", kind: "journal", year: 2026,
      title: "A generalized method for estimating solar wind speeds and densities using spectral broadening for a Kolmogorov turbulence spectrum",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Roopa, M. V., Imamura, T.",
      venue: "Advances in Space Research",
      doi: "10.1016/j.asr.2026.03.059",
      arxiv: "2603.23929",
      missions: ["Mars Orbiter Mission", "Akatsuki"]
    },
    {
      role: "first", kind: "journal", year: 2025,
      title: "On the estimation of solar wind velocity under varying solar activity conditions using Akatsuki measurements",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Imamura, T.",
      venue: "Monthly Notices of the Royal Astronomical Society",
      doi: "10.1093/mnras/staf1305",
      arxiv: "2508.06381",
      missions: ["Akatsuki"]
    },
    {
      role: "first", kind: "journal", year: 2025,
      title: "Insights into solar wind flow speeds from the coronal radio occultation experiment: Findings from the Indian Mars Orbiter Mission",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Roopa, M. V., Dai, B. K.",
      venue: "The Astrophysical Journal",
      doi: "10.3847/1538-4357/adb627",
      arxiv: "2502.09512",
      code: "https://github.com/jovian-explorer/Sun",
      missions: ["Mars Orbiter Mission"]
    },

    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2024,
      title: "A benchmark JWST near-infrared spectrum for the exoplanet WASP-39 b",
      authors: "Carter, A. L., May, E. M., Espinoza, N., Welbanks, L., et al. (incl. Aggarwal, K.)",
      venue: "Nature Astronomy",
      doi: "10.1038/s41550-024-02292-x"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2024,
      title: "Nightside clouds and disequilibrium chemistry on the hot Jupiter WASP-43b",
      authors: "Bell, T. J., Crouzet, N., Cubillos, P., Kreidberg, L., Piette, A. A. A., et al. (incl. Aggarwal, K.)",
      venue: "Nature Astronomy",
      doi: "10.1038/s41550-024-02230-x"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2024,
      title: "Sulphur dioxide in the mid-infrared transmission spectrum of WASP-39b",
      authors: "Powell, D., Feinstein, A., Lee, E., Zhang, M., Tsai, S., Taylor, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-024-07040-9"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2023,
      title: "Photochemically produced SO₂ in the atmosphere of WASP-39b",
      authors: "Tsai, S., Lee, E., Powell, D., Gao, P., Zhang, X., Moses, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-023-05902-2",
      arxiv: "2211.10490"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2023,
      title: "Detection of carbon monoxide’s 4.6 micron fundamental band structure in WASP-39b’s atmosphere with JWST NIRSpec G395H",
      authors: "Grant, D., Lothringer, J. D., Wakeford, H. R., et al. (incl. Aggarwal, K.)",
      venue: "The Astrophysical Journal Letters",
      doi: "10.3847/2041-8213/acd544"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2023,
      title: "A broadband thermal emission spectrum of the ultra-hot Jupiter WASP-18b",
      authors: "Coulombe, L.-P., Benneke, B., Challener, R., Piette, A., Wiser, L., Mansfield, M., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-023-06230-1"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2023,
      title: "Identification of carbon dioxide in an exoplanet atmosphere",
      authors: "JWST Transiting Exoplanet Community Early Release Science Team: Ahrer, E., Alderson, L., Batalha, N., Bean, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05269-w",
      code: "https://github.com/jovian-explorer/Identification-of-carbon-dioxide-in-an-exoplanet-atmosphere"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2023,
      title: "Early Release Science of the exoplanet WASP-39b with JWST NIRSpec PRISM",
      authors: "Rustamkulov, Z., Sing, D., Mukherjee, S., May, E., Kirk, J., Schlawin, E., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05677-y"
    },
    {
      role: "co", kind: "journal", collab: "JWST ERS", year: 2023,
      title: "Early Release Science of the exoplanet WASP-39b with JWST NIRSpec G395H",
      authors: "Alderson, L., Wakeford, H., Alam, M., Batalha, N., Lothringer, J., Redai, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05591-3"
    },

    {
      role: "co", kind: "whitepaper", year: 2023,
      title: "Improving multi-dimensional data formats, access, and assimilation tools for the twenty-first century",
      authors: "Seaton, D., Caspi, A., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics 2024 Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i361"
    },
    {
      role: "co", kind: "whitepaper", year: 2023,
      title: "COMPLETE: a flagship mission for complete understanding of 3D coronal magnetic energy release",
      authors: "Caspi, A., Seaton, D., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics 2024 Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i048"
    },
    {
      role: "co", kind: "whitepaper", year: 2023,
      title: "Magnetic energy powers the corona: how we can understand its 3D storage & release",
      authors: "Caspi, A., Seaton, D., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics 2024 Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i049"
    },

    {
      role: "co", kind: "whitepaper", year: 2025,
      title: "UK white paper on magnetic reconnection",
      authors: "Russell, A. J. B., Aggarwal, K., Rueda, J. A. A., Allanson, O., Baker, D., Bate, W., et al.",
      venue: "arXiv preprint",
      arxiv: "2512.11631"
    },
    {
      role: "co", kind: "chapter", year: 2026,
      title: "Probing the solar corona and the solar wind using angular broadening observations with the SKA",
      authors: "Zhang, P., Morgan, J., Oberoi, D., Strauss, D. T., Luo, Y., Kontar, E., Huang, Z., Aggarwal, K., Kumari, A., Datta, A., Morosan, D. E., Botha, G. J. J.",
      venue: "Advancing Astrophysics: Preparing for Science with the SKAO",
      arxiv: "2603.25421"
    },

    {
      role: "co", kind: "journal", status: "Under review", year: 2026,
      title: "Long-term GNSS loss-of-lock across the Indian equatorial ionization anomaly",
      authors: "Choudhary, R. K., Aggarwal, K., Potdar, A.",
      venue: "GPS Solutions"
    },
    {
      role: "co", kind: "journal", status: "Under review", year: 2026,
      title: "High-spatial and temporal 3D imaging of the ionosphere: a GAGAN-based virtual receiver approach",
      authors: "Choudhary, R. K., Potdar, A., Aggarwal, K.",
      venue: "Journal of Geophysical Research: Space Weather"
    },
    {
      role: "co", kind: "journal", status: "Under review", year: 2026,
      title: "Earth\u2019s magnetopause response during the Mother\u2019s Day storm based on multi-satellite data",
      authors: "Deep, A., Datta, A., Aggarwal, K., Brawar, B.",
      venue: "Solar Physics"
    },

    {
      role: "first", kind: "proceedings", year: 2025,
      title: "Studying the \u2018Smiley Sun\u2019 using the Akatsuki radio occultation experiment",
      authors: "Aggarwal, K., Datta, A., Choudhary, R. K.",
      venue: "Proceedings of the 7th URSI Asia-Pacific Radio Science Conference (AP-RASC 2025)",
      doi: "10.46620/ursiaprasc25/ahct9245"
    },
    {
      role: "first", kind: "proceedings", year: 2024,
      title: "Results from radio occultation studies using Indian Mars Orbiter Mission",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A.",
      venue: "Proceedings of the 6th URSI Regional Conference on Radio Science (RCRS 2024)",
      doi: "10.46620/ursi_rsrc24/1017qon9346"
    },
    {
      role: "co", kind: "proceedings", year: 2025,
      title: "Dynamics of Earth\u2019s magnetopause during solar storms: insights from in-situ measurements of NASA\u2019s MMS mission",
      authors: "Deep, A., Datta, A., Brawar, B., Aggarwal, K.",
      venue: "Proceedings of the 7th URSI Asia-Pacific Radio Science Conference (AP-RASC 2025)",
      doi: "10.46620/ursiaprasc25/qzpe5277"
    },
    {
      role: "co", kind: "proceedings", year: 2023,
      title: "Monitoring infrastructure faults with YOLOv5, assisting safety inspectors",
      authors: "Shekhar, K. S., Tanti, H. A., Datta, A., Aggarwal, K.",
      venue: "2023 International Conference on Integration of Computational Intelligent System (ICICIS), IEEE",
      doi: "10.1109/ICICIS56802.2023.10430270"
    }
  ],

  /* ------------------------------------------------------------------
     Home page "Recent" list: one line per item, newest first.
     type: Paper | Talk | Poster | Video | Milestone
     ------------------------------------------------------------------ */
  recent: [
    { date: "Sep 2026", type: "Video", title: "Video summaries of three 2026 papers", where: "YouTube", href: "videos.html" },
    { date: "2026", type: "Paper", title: "Plasma turbulence in the lunar environment across solar wind and magnetotail conditions", where: "JGR: Planets", href: "https://doi.org/10.1029/2026JE009957" },
    { date: "2026", type: "Paper", title: "A study on the contribution of the interplanetary medium in radio occultation experiments", where: "Icarus", href: "https://doi.org/10.1016/j.icarus.2026.117291" },
    { date: "May 2026", type: "Milestone", title: "PhD thesis submitted", where: "IIT Indore" },
    { date: "Mar 2026", type: "Talk", title: "A turbulence index independent framework for solar wind speed and coronal density", where: "7th Indian Planetary Science Conference, IIT Indore", href: "talks.html" },
    { date: "2026", type: "Paper", title: "A turbulence index independent framework for deriving solar wind speed and coronal electron density from radio spectral broadening", where: "MNRAS", href: "https://doi.org/10.1093/mnras/stag554" },
    { date: "2026", type: "Paper", title: "A generalized method for estimating solar wind speeds and densities for a Kolmogorov turbulence spectrum", where: "Advances in Space Research", href: "https://doi.org/10.1016/j.asr.2026.03.059" },
    { date: "Jan 2026", type: "Poster", title: "Solar wind speeds from Doppler broadening: MOM and Akatsuki", where: "ISRO\u2013ESA Workshop, Thiruvananthapuram", href: "talks.html" },
    { date: "Dec 2025", type: "Poster", title: "Solar wind speeds from Doppler broadening: MOM and Akatsuki", where: "AGU Fall Meeting, New Orleans", href: "talks.html" },
    { date: "Aug 2025", type: "Talk", title: "Studying the \u2018Smiley Sun\u2019 with Akatsuki radio occultation", where: "URSI AP-RASC 2025, Sydney", href: "talks.html" }
  ],

  /* Citation count shown on the publications page. */
  metrics: { citations: 2248, source: "ResearchGate", url: "https://www.researchgate.net/profile/Keshav-Aggarwal-4" },

  /* ------------------------------------------------------------------
     Conference presentations.
     date: "YYYY-MM" (used for sorting). kind: "Talk" | "Poster"
     award: optional prize text. pdf: optional link to slides or poster.
     ------------------------------------------------------------------ */
  conferences: [
    {
      date: "2026-03", dates: "23\u201325 Mar 2026", kind: "Talk",
      event: "7th Indian Planetary Science Conference (IPSC 2026)",
      place: "IIT Indore, India",
      title: "A turbulence index independent framework for deriving solar wind speed and coronal electron density from radio spectral broadening"
    },
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
      title: "Estimating solar wind speeds using Doppler broadening: results from MOM and Akatsuki",
      award: "AGU Student Grant"
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
      "Assam/Kamrup Metropolitan",
      "Chandigarh/Chandigarh",
      "Delhi/Central Delhi",
      "Delhi/Central North Delhi",
      "Delhi/East Delhi",
      "Delhi/New Delhi",
      "Delhi/North Delhi",
      "Delhi/North East Delhi",
      "Delhi/North West Delhi",
      "Delhi/Old Delhi",
      "Delhi/Outer North Delhi",
      "Delhi/South Delhi",
      "Delhi/South East Delhi",
      "Delhi/South West Delhi",
      "Delhi/West Delhi",
      "Goa/Kushavati",
      "Goa/North Goa",
      "Goa/South Goa",
      "Haryana/Gurugram",
      "Haryana/Panchkula",
      "Himachal Pradesh/Kullu",
      "Himachal Pradesh/Shimla",
      "Jammu and Kashmir/Jammu",
      "Jammu and Kashmir/Reasi",
      "Karnataka/Bengaluru Urban",
      "Kerala/Kollam",
      "Kerala/Thiruvananthapuram",
      "Madhya Pradesh/Bhopal",
      "Madhya Pradesh/Dewas",
      "Madhya Pradesh/Indore",
      "Madhya Pradesh/Ujjain",
      "Maharashtra/Mumbai City",
      "Maharashtra/Mumbai Suburban",
      "Maharashtra/Pune",
      "Maharashtra/Raigad",
      "Meghalaya/East Khasi Hills",
      "Meghalaya/Ri-Bhoi",
      "Punjab/Sahibzada Ajit Singh Nagar",
      "Rajasthan/Jaipur",
      "Rajasthan/Sri Ganganagar",
      "Uttar Pradesh/Baghpat",
      "Uttar Pradesh/Ghaziabad",
      "Uttar Pradesh/Meerut",
      "Uttar Pradesh/Muzaffarnagar",
      "Uttar Pradesh/Saharanpur",
      "Uttar Pradesh/Shamli",
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
      { name: "Indore", country: "India", lat: 22.7196, lon: 75.8577, visits: [{ date: "2026-03", note: "7th Indian Planetary Science Conference, talk" }, { date: "2021", note: "IIT Indore: M.Sc. and Ph.D." }] },
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
      { name: "Panaji", country: "India", lat: 15.4909, lon: 73.8278, visits: [] },
      { name: "Calangute and Baga", country: "India", lat: 15.5439, lon: 73.7553, visits: [] },
      { name: "Aguada Fort", country: "India", lat: 15.4926, lon: 73.7735, visits: [] },
      { name: "Old Goa", country: "India", lat: 15.5009, lon: 73.9116, visits: [] },
      { name: "Dudhsagar Falls", country: "India", lat: 15.3144, lon: 74.3143, visits: [] },
      { name: "Kollam", country: "India", lat: 8.8932, lon: 76.6141, visits: [] },
      { name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, visits: [] },
      { name: "Panvel", country: "India", lat: 18.9894, lon: 73.1175, visits: [] },
      { name: "Bengaluru", country: "India", lat: 12.9716, lon: 77.5946, visits: [] },
      { name: "Guwahati", country: "India", lat: 26.1445, lon: 91.7362, visits: [] },
      { name: "Umiam", country: "India", lat: 25.6569, lon: 91.8826, visits: [] },
      { name: "Cherrapunji (Sohra)", country: "India", lat: 25.2702, lon: 91.7323, visits: [] },
      { name: "Muzaffarnagar", country: "India", lat: 29.4727, lon: 77.7085, visits: [] },
      { name: "Shamli", country: "India", lat: 29.4502, lon: 77.3172, visits: [] },
      { name: "Baghpat", country: "India", lat: 28.9448, lon: 77.2183, visits: [] }
    ],
    countries: []
  },

  /* ------------------------------------------------------------------
     Photography: sections and albums shown on photography.html.
     Photographs are listed in assets/js/photos.js (written by
     tools/photos.py); each photo's "album" must match an album id here.
     region: { states: [...] } or { country: "..." } draws the album's
     cover map until a photograph is marked "cover": true.
     ------------------------------------------------------------------ */
  photography: {
    kit: "Canon EOS R7",
    sections: [
      { id: "night-sky", title: "Night sky", description: "Astrophotography: deep-sky objects, the Moon and planets, and wide-field frames." },
      { id: "travel", title: "Travel", description: "Places across India and abroad, grouped by region." },
      { id: "conferences", title: "Conferences", description: "Meetings, talks and poster sessions." }
    ],
    albums: [
      { id: "deep-sky", section: "night-sky", title: "Deep-sky objects", description: "Nebulae, clusters and galaxies." },
      { id: "moon-planets", section: "night-sky", title: "Moon and planets", description: "Lunar phases and planetary close-ups." },
      { id: "wide-field", section: "night-sky", title: "Milky Way and wide field", description: "Wide-angle night-sky landscapes." },

      { id: "sydney", section: "travel", title: "Sydney", place: "New South Wales, Australia", region: { country: "Australia", point: [151.2093, -33.8688] } },
      { id: "himachal", section: "travel", title: "Shimla and Manali", place: "Himachal Pradesh", region: { states: ["Himachal Pradesh"] } },
      { id: "jammu-kashmir", section: "travel", title: "Jammu and Vaishno Devi", place: "Jammu and Kashmir", region: { states: ["Jammu and Kashmir"] } },
      { id: "uttarakhand", section: "travel", title: "Dehradun, Roorkee and Bhimtal", place: "Uttarakhand", region: { states: ["Uttarakhand"] } },
      { id: "tricity", section: "travel", title: "Chandigarh, Mohali and Panchkula", place: "Chandigarh, Punjab and Haryana", region: { states: ["Chandigarh", "Punjab", "Haryana"] } },
      { id: "delhi-ncr", section: "travel", title: "Delhi and NCR", place: "Delhi, Haryana and Uttar Pradesh", region: { states: ["Delhi"] } },
      { id: "western-up", section: "travel", title: "Meerut and western Uttar Pradesh", place: "Uttar Pradesh", region: { states: ["Uttar Pradesh"], focus: ["Meerut", "Ghaziabad", "Saharanpur", "Muzaffarnagar", "Shamli", "Baghpat"] } },
      { id: "varanasi", section: "travel", title: "Varanasi and Sarnath", place: "Uttar Pradesh", region: { states: ["Uttar Pradesh"], focus: ["Varanasi"] } },
      { id: "jaipur", section: "travel", title: "Jaipur", place: "Rajasthan", region: { states: ["Rajasthan"] } },
      { id: "madhya-pradesh", section: "travel", title: "Indore, Ujjain and Mhow", place: "Madhya Pradesh", region: { states: ["Madhya Pradesh"] } },
      { id: "maharashtra", section: "travel", title: "Mumbai, Pune and Panvel", place: "Maharashtra", region: { states: ["Maharashtra"] } },
      { id: "goa", section: "travel", title: "Goa", place: "Panaji, Old Goa, Calangute, Baga, Aguada, Dudhsagar", region: { states: ["Goa"] } },
      { id: "bengaluru", section: "travel", title: "Bengaluru", place: "Karnataka", region: { states: ["Karnataka"] } },
      { id: "kerala", section: "travel", title: "Thiruvananthapuram and Kollam", place: "Kerala", region: { states: ["Kerala"] } },
      { id: "northeast", section: "travel", title: "Guwahati, Umiam and Cherrapunji", place: "Assam and Meghalaya", region: { states: ["Assam", "Meghalaya"] } },

      { id: "ipsc-2026", section: "conferences", title: "IPSC 2026", place: "IIT Indore", date: "2026-03" },
      { id: "isro-esa-2026", section: "conferences", title: "ISRO\u2013ESA Workshop", place: "Thiruvananthapuram", date: "2026-01" },
      { id: "variable-sun-2025", section: "conferences", title: "The Variable Sun", place: "Thiruvananthapuram", date: "2025-12" },
      { id: "asi-2025", section: "conferences", title: "ASI Symposium 003", place: "JECRC University, Jaipur", date: "2025-09" },
      { id: "ursi-aprasc-2025", section: "conferences", title: "URSI AP-RASC 2025", place: "ICC Sydney", date: "2025-08" },
      { id: "ipsc-2025", section: "conferences", title: "IPSC 2025", place: "IIT Roorkee", date: "2025-03" },
      { id: "ursi-rcrs-2024", section: "conferences", title: "URSI-RCRS 2024", place: "GEHU Bhimtal", date: "2024-10" },
      { id: "iswc-2024", section: "conferences", title: "Indian Space Weather Conference", place: "IIT Roorkee", date: "2024-10" },
      { id: "al1sc-iiti-2024", section: "conferences", title: "Aditya-L1 Support Cell workshop", place: "IIT Indore", date: "2024-09" },
      { id: "al1sc-bhu-2023", section: "conferences", title: "3rd Aditya-L1 Workshop", place: "IIT (BHU) Varanasi", date: "2023-02" },
      { id: "ursi-rcrs-2022", section: "conferences", title: "URSI-RCRS 2022", place: "IIT Indore", date: "2022-12" }
    ]
  }
};
